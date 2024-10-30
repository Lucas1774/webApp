import React, { useEffect, useState, useCallback } from "react";
import useDebounce from "../../hooks/useDebounce";
import { get, post } from "../../api";
import { Table, Button, Form } from "react-bootstrap";
import "./Shopping.css"
import Spinner from "../Spinner";
import LoginForm from "../LoginForm";
import deleteIcon from "../../assets/images/bin.png"
import resetIcon from "../../assets/images/remove.png"
import editIcon from "../../assets/images/edit.png"
import * as constants from "../../constants";
import { handleError } from "../errorHandler";

const Shopping = () => {
    const [tableData, setTableData] = useState(null);
    const [quantityInputValue, setQuantityInputValue] = useState({});
    const [filterValue, setFilterValue] = useState({});
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
    const [isAddAlimentVisible, setIsAddAlimentVisible] = useState(false);
    const [filters, setFilters] = useState({});
    const [order, setOrder] = useState({ key: null, order: constants.DESC })
    const [isShowOnlyPositive, setIsShowOnlyPositive] = useState(false);

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
                handleError("Error checking authentication", error);
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
            handleError("Error fetching data", error);
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
            handleError("Error sending data", error);
        } finally {
            if (message) {
                setMessage(message);
                setTimeout(() => {
                    setMessage(null);
                    callbackAfterSuccess();
                }, constants.TIMEOUT_DELAY);
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
            }, constants.TIMEOUT_DELAY);
        } else {
            makeGenericRequest(() => post('/login', password), () => {
                setIsLoading(true);
                setIsLoginFormVisible(false);
                getData();
            });
        }
    };

    const handleResetAll = async () => {
        makeGenericRequest(() => post('/update-all-aliment-quantity', null), () => {
            setIsLoading(true);
            setIsAddAlimentVisible(false);
            getData();
        });
    }

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

    const handleEditAliment = () => {
        // TODO: implement me
    }

    const handleRemoveAliment = async (id, name) => {
        makeGenericRequest(() => post('/remove-aliment', { id, name }), () => {
            setIsLoading(true);
            setIsAddAlimentVisible(false);
            getData();
        });
    }

    const applyFilters = (data, filters) => {
        return data.filter((row) => {
            return (!isShowOnlyPositive || (isShowOnlyPositive && row[constants.QUANTITY_KEY] !== 0)) && Object.keys(filters).every((key) => {
                if (constants.META.DATATYPE[key] === constants.NUMBER) {
                    return isNaN(filters[key]) || row[key] >= filters[key];
                } else if (constants.META.DATATYPE[key] === constants.STRING) {
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
            if (order.order === constants.DESC) {
                return a[order.key] < b[order.key] ? 1 : -1;
            } else {
                return a[order.key] > b[order.key] ? 1 : -1;
            }
        });
    };

    const renderColumn = (key, id, name, quantity) => {
        if (key === constants.NAME_KEY) {
            return <td key={key} title={name} style={{ maxWidth: '100px' }}>{name}</td>;
        }
        if (key === constants.CATEGORY_KEY) {
            return <td key={key} title={name} style={{ maxWidth: '100px' }}>{name}</td>;
        }
        if (key === constants.QUANTITY_KEY) {
            return (
                <td key={key}>
                    <div className="cell-item-container">
                        <Form.Control defaultValue={quantity}
                            inputMode="numeric"
                            onChange={(e) =>
                                setQuantityInputValue({
                                    value: parseInt(e.target.value),
                                    rowId: id,
                                    rowName: name
                                })}
                            onClick={(e) => e.target.select()}
                        />
                        <Button className="icon-button" onClick={() => {
                            if (quantity !== 0) {
                                updateAliment(0, id, name)
                            }
                        }}>
                            <img src={resetIcon} alt=""></img>
                        </Button>
                    </div>
                </td>
            );
        }
        if (key === constants.EDIT_KEY) {
            return (
                <td key={key} title={constants.EDIT_KEY.toLowerCase()} style={{ padding: '5px' }}>
                    <Button className="icon-button" onClick={() => handleEditAliment(id, name)}>
                        <img src={editIcon} alt=""></img>
                    </Button>
                </td>
            );
        }
        if (key === constants.REMOVE_KEY) {
            return (
                <td key={key} title={constants.REMOVE_KEY.toLowerCase()} style={{ padding: '5px' }}>
                    <Button className="icon-button" onClick={() => handleRemoveAliment(id, name)}>
                        <img src={deleteIcon} alt=""></img>
                    </Button>
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
                                    <Form.Control type="text" />
                                    <Button className="thirty-percent" type="submit" variant="success">Add</Button>
                                    <Button className="thirty-percent" onClick={() => setIsShowOnlyPositive((prev) => !prev)}>{isShowOnlyPositive ? "Show all" : "Hide zero"}</Button>
                                    <Button className="thirty-percent restart" onClick={() => handleResetAll()}>Reset all</Button>
                                </Form>
                                } {tableData &&
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                {constants.META.KEYS.filter((key) => constants.META.VISIBLE[key]).map((key) => (
                                                    <th key={key}>
                                                        {constants.META.FILTERABLE[key] && (
                                                            <Form.Control type="text"
                                                                placeholder={constants.META.DISPLAY_NAME[key]}
                                                                onChange={(e) =>
                                                                    setFilterValue({
                                                                        column: key,
                                                                        value: constants.META.DATATYPE[key] === constants.NUMBER ? parseInt(e.target.value) : e.target.value
                                                                    })}
                                                                onClick={(e) => e.target.select()}
                                                            />
                                                        )}
                                                        {constants.META.SORTABLE[key] && (
                                                            <Button onClick={() => {
                                                                setOrder((prevOrder) => ({
                                                                    key: key,
                                                                    order: prevOrder.key === key ? (prevOrder.order === constants.DESC ? constants.ASC : constants.DESC) : constants.ASC
                                                                }));
                                                            }}>
                                                                {order.key === key ? order.order === constants.ASC ? '▲' : '▼' : 'Sort'}
                                                            </Button>
                                                        )}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applyOrder(applyFilters(tableData, filters), order).map((row) => {
                                                const id = row[constants.ID_KEY];
                                                const name = row[constants.NAME_KEY];
                                                const quantity = row[constants.QUANTITY_KEY];
                                                return (
                                                    <tr key={id}>
                                                        {constants.META.KEYS
                                                            .filter((key) => constants.META.VISIBLE[key])
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
