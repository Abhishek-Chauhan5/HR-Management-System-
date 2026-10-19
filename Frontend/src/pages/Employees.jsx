import { useEffect, useState } from "react";
import api from "../services/api";
import "./Employees.css";

function Employees() {

    const [employees, setEmployees] = useState([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {

        const fetchEmployees = async () => {

            try {

                const response = await api.get(
                    `accounts/employees/?search=${search}`
                );

                console.log("Employees:", response.data);

                setEmployees(response.data.results);

            } catch (error) {

                console.error("Employee API Error:", error);

                setMessage("Unable to load employees.");
            }
        };

        fetchEmployees();

    }, [search]);


    return (
        <div className="employees-page">

            <div className="employees-header">

                <div>
                    <h1>Employees</h1>

                    <p>
                        Manage and view all employees.
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="employee-search"
                />
                
                <button
                    type="button"
                    className="back-dashboard-btn"
                    onClick={() => window.location.href = "/dashboard"}
                    >
                    ← Back to Dashboard
                </button>

                <button className="add-employee-btn">
                    + Add Employee
                </button>

            </div>


            {message && (
                <p className="error-message">
                    {message}
                </p>
            )}


            <div className="employees-table-container">

                <table className="employees-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>


                    <tbody>

                        {employees.map((employee) => (

                            <tr key={employee.id}>

                                <td>{employee.id}</td>

                                <td>{employee.name}</td>

                                <td>{employee.username}</td>

                                <td>{employee.email}</td>

                                <td>{employee.department}</td>

                                <td>{employee.designation}</td>

                                <td>{employee.role}</td>

                                <td>
                                    <button className="edit-btn">
                                        Edit
                                    </button>
                                </td>

                            </tr>

                        ))}


                        {employees.length === 0 && !message && (

                            <tr>
                                <td colSpan="8">
                                    No employees found.
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Employees;