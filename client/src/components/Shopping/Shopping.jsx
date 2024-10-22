import React, { useEffect, useState } from "react";
import { get, post } from "../../api";
import { Table, Form } from "react-bootstrap";
import "./Shopping.css"
import Spinner from "../Spinner";
import LogginForm from "../LoginForm";
import { TIMEOUT_DELAY } from "../../constants";

const Shopping = () => {
    const [tableData, setTableData] = useState(null);
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
        setIsLoading(true);
        const password = event.target[0].value.trim();
        const action = event.nativeEvent.submitter.value;
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
        }
    };

    const addAliment = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const name = event.target[0].value.trim();
        let message = "";
        if (name) {
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
                }
            }
        }
    };

    const handleCheckboxChange = (event, id) => {
        // TODO: implement me
    };

    const handleEditClick = (event, id) => {
        // TODO: implement me
    };

    return (
        <><h1 id="shopping">Shopping</h1>
            <div className="app shopping"> {
                message ? <div>{message}</div> :
                    isLoginFormVisible ? <LogginForm onSubmit={(e) => {
                        handleLoginSubmit(e)
                    }} /> :
                        isLoading ? <Spinner /> :
                            <>
                                {isAddAlimentVisible && <Form onSubmit={(e) => addAliment(e)}>
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
                                                            value={row.quantity}
                                                            type="number"
                                                            onChange={(e) => handleCheckboxChange(e, row.id)}
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
