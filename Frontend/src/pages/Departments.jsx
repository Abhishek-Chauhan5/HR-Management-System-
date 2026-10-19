
import { useState } from "react";
import "./Departments.css";

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [departmentName, setDepartmentName] = useState("");

    const handleAddDepartment = (e) => {
        e.preventDefault();

        if (!departmentName.trim()) {
            return;
        }

        const newDepartment = {
            id: Date.now(),
            name: departmentName.trim(),
        };

        setDepartments((previous) => [...previous, newDepartment]);
        setDepartmentName("");
    };

    return (
        <div className="departments-page">
            <div className="departments-header">
                <div>
                    <h1>Departments</h1>
                    <p>Manage your organization's departments.</p>
                </div>
            </div>

            <form
                className="department-form"
                onSubmit={handleAddDepartment}
            >
                <input
                    type="text"
                    placeholder="Enter department name"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                />
                <button
                type="button"
                className="back-dashboard-btn"
                onClick={() => window.location.href = "/dashboard"}
                >
                ← Back to Dashboard
                </button>
                
                <button type="submit">+ Add Department</button>
            </form>

            <div className="departments-table-container">
                <table className="departments-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Department Name</th>
                        </tr>
                    </thead>

                    <tbody>
                        {departments.map((department, index) => (
                            <tr key={department.id}>
                                <td>{index + 1}</td>
                                <td>{department.name}</td>
                            </tr>
                        ))}

                        {departments.length === 0 && (
                            <tr>
                                <td colSpan="2">
                                    No departments added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Departments;
