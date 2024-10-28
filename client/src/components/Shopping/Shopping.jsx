import React, { useEffect, useState, useCallback } from "react";
import useDebounce from "../../hooks/useDebounce";
import { get, post } from "../../api";
import { Table, Form } from "react-bootstrap";
import "./Shopping.css"
import Spinner from "../Spinner";
import LoginForm from "../LoginForm";
import { TIMEOUT_DELAY } from "../../constants";

const Shopping = () => {
    const [tableData, setTableData] = useState(null);
    const [quantityInputValue, setQuantityInputValue] = useState({ value: null, rowId: null, rowName: null });
    const debouncedValue = useDebounce(quantityInputValue, 1000);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
    const [isAddAlimentVisible, setIsAddAlimentVisible] = useState(false);

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

    const updateAliment = useCallback(async (value, id, name) => {
        if (!value || isNaN(value) || parseInt(value) < 0) {
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
        if (debouncedValue && debouncedValue.value !== null
            && debouncedValue.rowId !== null && debouncedValue.rowName) {
            updateAliment(debouncedValue.value, debouncedValue.rowId, debouncedValue.rowName);
        }
    }, [debouncedValue, updateAliment]);

    const handleEditClick = (event, id) => {
        // TODO: implement me
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
                                        <tbody>
                                            {tableData.map((row) => (
                                                <tr key={row.id}>
                                                    <td style={{ color: 'white' }}>{row.name}</td>
                                                    <td>
                                                        <input style={{ width: '100%' }}
                                                            defaultValue={row.quantity}
                                                            type="number"
                                                            onChange={(e) =>
                                                                setQuantityInputValue({
                                                                    value: e.target.value,
                                                                    rowId: row.id,
                                                                    rowName: row.name
                                                                })}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button onClick={(e) => handleEditClick(e, row.id)}>Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                }</>
            }</div></>
    );
};

export default Shopping;
