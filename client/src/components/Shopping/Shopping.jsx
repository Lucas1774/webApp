import React, { useEffect, useState, useCallback } from "react";
import useDebounce from "../../hooks/useDebounce";
import { get, post } from "../../api";
import { Table, Form } from "react-bootstrap";
import "./Shopping.css"
import Spinner from "../Spinner";
import LoginForm from "../LoginForm";
import { TIMEOUT_DELAY, DESC, ASC, ID_KEY, NAME_KEY, QUANTITY_KEY, STRING, NUMBER, META } from "../../constants";

const Shopping = () => {
    const [tableData, setTableData] = useState(null);
    const [quantityInputValue, setQuantityInputValue] = useState({});
    const [filterValue, setFilterValue] = useState({});
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
    const [isAddAlimentVisible, setIsAddAlimentVisible] = useState(false);
    const [filters, setFilters] = useState({});
    const [order, setOrder] = useState({ key: null, order: DESC })

    const debouncedValue = useDebounce(quantityInputValue, 1000);
    const filterDebouncedValue = useDebounce(filterValue, 1000)

    const getData = async () => {
        setIsLoading(true);
        try {
            const response = await get("/shopping");
            setTableData(response.data);
        } catch (error) {
            alert("Error fetching data:", error.message);
        } finally {
            setIsLoading(false);
            setIsAddAlimentVisible(true);
        }
    };

    const updateAliment = useCallback(async (value, id, name) => {
        if (isNaN(value) || parseInt(value) < 0) {
            return;
        }
        setIsLoading(true);
        let message = "";
        try {
            await post('/update-aliment-quantity', { id, quantity: parseInt(value) });
            message = name + " updated";
        } catch (error) {
            alert("Error sending data:", error.message);
        } finally {
            if (message) {
                setMessage(message);
                setTimeout(() => {
                    setMessage(null);
                    setIsLoading(true);
                    setIsAddAlimentVisible(false);
                    getData();
                }, TIMEOUT_DELAY);
            } else {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (debouncedValue?.value != null && debouncedValue?.rowId != null && debouncedValue?.rowName != null) {
            updateAliment(debouncedValue.value, debouncedValue.rowId, debouncedValue.rowName);
        }
    }, [debouncedValue, updateAliment]);

    useEffect(() => {
        if (filterDebouncedValue?.value != null && filterDebouncedValue?.column != null) {
            setFilters(prevFilters => {
                const newFilters = { ...prevFilters };
                newFilters[filterDebouncedValue.column] = filterDebouncedValue.value;
                return newFilters;
            });
        }
    }, [filterDebouncedValue]);

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                await get("/check-auth");
                await getData();
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setIsLoginFormVisible(true);
                } else {
                    alert("Error checking authentication:", error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        const password = event.target[0].value.trim();
        const action = event.nativeEvent.submitter.value;
        setIsLoading(true);
        let message = "";
        if ("validate" === action && password) {
            try {
                const response = await post('/login', password);
                message = response.data !== -1 ? "Granted admin access" : "Wrong password. Continuing as guest";
            } catch (error) {
                alert("Error sending data:", error.message);
            }
        } else {
            message = "No password provided. Continuing as guest";
        }
        if (message) {
            setMessage(message);
            setTimeout(() => {
                setMessage(null);
                setIsLoading(true);
                setIsLoginFormVisible(false);
                getData();
            }, TIMEOUT_DELAY);
        } else {
            setIsLoading(false);
        }
    };

    const handleAddAlimentSubmit = async (event) => {
        event.preventDefault();
        const name = event.target[0].value.trim();
        if (!name) {
            return;
        }
        setIsLoading(true);
        let message = "";
        try {
            const response = await post('/new-aliment', name);
            message = response.data === 1 ? "Aliment added" : response.data;
        } catch (error) {
            alert("Error sending data:", error.message);
        } finally {
            if (message) {
                setMessage(message);
                setTimeout(() => {
                    setMessage(null);
                    setIsLoading(true);
                    setIsAddAlimentVisible(false);
                    getData();
                }, TIMEOUT_DELAY);
            } else {
                setIsLoading(false);
            }
        }
    };

    const handleEditClick = (event, id) => {
        // TODO: implement me
    };

    const applyFilters = (data, filters) => {
        return data.filter((row) => {
            return Object.keys(filters).every((key) => {
                if (META.DATATYPE[key] === NUMBER) {
                    return isNaN(filters[key]) || row[key] === filters[key];
                } else if (META.DATATYPE[key] === STRING) {
                    return row[key].toString().toLowerCase().includes(filters[key].toLowerCase());
                } else {
                    return true;
                }
            });
        });
    };

    const applyOrder = (data, order) => {
        if (order.key === null) {
            return data;
        }
        return data.sort((a, b) => {
            if (order.order === DESC) {
                return a[order.key] < b[order.key] ? 1 : -1;
            } else {
                return a[order.key] > b[order.key] ? 1 : -1;
            }
        });
    };

    return (
        <><h1 id="shopping">Shopping</h1>
            <div className="app shopping"> {
                message ? <div>{message}</div> :
                    isLoginFormVisible ? <LoginForm onSubmit={(e) => {
                        handleLoginSubmit(e)
                    }} /> :
                        isLoading ? <Spinner /> :
                            <>
                                {isAddAlimentVisible && <Form onSubmit={(e) => handleAddAlimentSubmit(e)}>
                                    <input type="text" />
                                    <button type="submit">Add aliment</button>
                                </Form>
                                } {tableData &&
                                    <Table striped bordered hover responsive style={{ width: '100%', tableLayout: 'fixed' }}>
                                        <thead>
                                            <tr>
                                                {META.KEYS.filter((key) => META.VISIBLE[key]).map((key) => (
                                                    <th key={key} style={{ color: 'white' }}>
                                                        {META.DISPLAY_NAME[key]}
                                                        {META.SORTABLE[key] && (
                                                            <button onClick={() => {
                                                                setOrder((prevOrder) => ({
                                                                    key: key,
                                                                    order: prevOrder.key === key ? (prevOrder.order === DESC ? ASC : DESC) : ASC
                                                                }));
                                                            }}>
                                                                {order.key === key ? order.order === ASC ? '▲' : '▼' : 'Sort'}
                                                            </button>
                                                        )}
                                                        {META.FILTERABLE[key] && (
                                                            <input style={{ width: '100%' }}
                                                                type="text"
                                                                onChange={(e) =>
                                                                    setFilterValue({
                                                                        column: key,
                                                                        value: META.DATATYPE[key] === NUMBER ? parseInt(e.target.value) : e.target.value
                                                                    })}
                                                            />
                                                        )}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applyOrder(applyFilters(tableData, filters), order).map((row) => {
                                                const id = row[ID_KEY];
                                                const name = row[NAME_KEY];
                                                const quantity = row[QUANTITY_KEY];
                                                return (
                                                    <tr key={id}>
                                                        <td style={{ color: 'white' }}>{name}</td>
                                                        <td>
                                                            <input style={{ width: '100%' }}
                                                                defaultValue={quantity}
                                                                type="number"
                                                                onChange={(e) =>
                                                                    setQuantityInputValue({
                                                                        value: parseInt(e.target.value),
                                                                        rowId: id,
                                                                        rowName: name
                                                                    })}
                                                            />
                                                        </td>
                                                        <td>
                                                            <button onClick={(e) => handleEditClick(e, row.id)}>Edit</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                }</>
            }</div></>
    );
};

export default Shopping;
