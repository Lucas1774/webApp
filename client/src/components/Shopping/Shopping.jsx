import React, { useEffect, useState, useCallback } from "react";
import useDebounce from "../../hooks/useDebounce";
import { get, post } from "../../api";
import { Table, Form } from "react-bootstrap";
import "./Shopping.css"
import Spinner from "../Spinner";
import LoginForm from "../LoginForm";
import icon from "../../assets/images/bin.png"
import { TIMEOUT_DELAY, DESC, ASC, ID_KEY, NAME_KEY, QUANTITY_KEY, REMOVE_KEY, STRING, NUMBER, META } from "../../constants";

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
                const response = await get("/check-auth");
                if (response.data !== 1) {
                    setIsLoginFormVisible(true);
                } else {
                    await getData();
                }
            } catch (error) {
                alert("Error checking authentication:", error.message);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

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

    const makeGenericRequest = async (request, callbackAfterSuccess) => {
        setIsLoading(true);
        let message = "";
        try {
            const response = await request();
            message = response.data;
        } catch (error) {
            alert("Error sending data:", error.message);
        } finally {
            if (message) {
                setMessage(message);
                setTimeout(() => {
                    setMessage(null);
                    callbackAfterSuccess();
                }, TIMEOUT_DELAY);
            } else {
                setIsLoading(false);
            }
        }
    }

    const updateAliment = useCallback(async (value, id, name) => {
        if (isNaN(value) || parseInt(value) < 0) {
            return;
        }
        makeGenericRequest(() => post('/update-aliment-quantity', { id, name, quantity: parseInt(value) }), () => {
            setIsLoading(true);
            setIsAddAlimentVisible(false);
            getData();
        });
    }, []);

    useEffect(() => {
        if (debouncedValue?.value != null && debouncedValue?.rowId != null && debouncedValue?.rowName != null) {
            updateAliment(debouncedValue.value, debouncedValue.rowId, debouncedValue.rowName);
        }
    }, [debouncedValue, updateAliment]);

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        const password = event.target[0].value.trim();
        const action = event.nativeEvent.submitter.value;
        if (!password || "validate" !== action) {
            setMessage("No password provided. Continuing as guest");
            setTimeout(() => {
                setMessage(null);
                setIsLoading(true);
                setIsLoginFormVisible(false);
                getData();
            }, TIMEOUT_DELAY);
        } else {
            makeGenericRequest(() => post('/login', password), () => {
                setIsLoading(true);
                setIsLoginFormVisible(false);
                getData();
            });
        }
    };

    const handleAddAlimentSubmit = async (event) => {
        event.preventDefault();
        const name = event.target[0].value.trim();
        if (!name) {
            return;
        }
        makeGenericRequest(() => post('/new-aliment', name), () => {
            setIsLoading(true);
            setIsAddAlimentVisible(false);
            getData();
        });
    };

    const handleRemoveAliment = async (id, name) => {
        makeGenericRequest(() => post('/remove-aliment', { id, name }), () => {
            setIsLoading(true);
            setIsAddAlimentVisible(false);
            getData();
        });
    }

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

    const renderColumn = (key, id, name, quantity) => {
        if (key === NAME_KEY) {
            return <td style={{ color: 'white' }}>{name}</td>;
        }
        if (key === QUANTITY_KEY) {
            return (
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
            );
        }
        if (key === REMOVE_KEY) {
            return (
                <td>
                    <button style={{ textAlign: 'center', width: '100%', height: '100%', margin: '0', padding: '0' }} onClick={() => handleRemoveAliment(id, name)}>
                        <img style={{ height: '45px', margin: '0', paddingBottom: '8px' }} src={icon} alt=""></img>
                    </button>
                </td>
            );
        }
    }

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
                                                        {META.KEYS
                                                            .filter((key) => META.VISIBLE[key])
                                                            .map((key) => renderColumn(key, id, name, quantity))}
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
