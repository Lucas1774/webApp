import React, { useEffect, useState } from "react";
import { get } from "../../api";
import { Table } from "react-bootstrap";
import "./Shopping.css"
import Spinner from "../Spinner";

const Shopping = () => {
    const [tableData, setTableData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        get("/shopping")
            .then((response) => {
                setTableData(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                alert("Error fetching data:", error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleCheckboxChange = (event, id) => {
        // TODO: implement me
    };

    const handleEditClick = (event, id) => {
        // TODO: implement me
    };

    return (
        <><h1 id="shopping">Shopping</h1>
            <div className="app shopping">
                {
                    isLoading ? <Spinner /> :
                        <Table striped bordered hover responsive>
                            <tbody>
                                {tableData.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.name}</td>
                                        <td>
                                            <input
                                                value={row.quantity}
                                                type="number"
                                                onChange={(e) => handleCheckboxChange(e, row.id)} />
                                        </td>
                                        <td>
                                            <button onClick={(e) => handleEditClick(e, row.id)}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                }
            </div></>
    );
};

export default Shopping;
