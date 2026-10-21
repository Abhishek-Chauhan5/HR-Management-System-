
import { useState } from "react";
import "./Attendance.css";
import { useNavigate} from "react-router-dom";
function Attendance() {
    const [attendance, setAttendance] = useState([]);
    const [employeeName, setEmployeeName] = useState("");
    const [status, setStatus] = useState("Present");
     const navigate = useNavigate();

    const handleMarkAttendance = (e) => {
        e.preventDefault();

        if (!employeeName.trim()) {
            return;
        }

        setAttendance((previous) => [
            ...previous,
            {
                id: Date.now(),
                employeeName: employeeName.trim(),
                status,
                date: new Date().toLocaleDateString(),
            },
        ]);

        setEmployeeName("");
        setStatus("Present");
    };

    return (
        <div className="attendance-page">
            <div className="attendance-header">
                <h1>Attendance</h1>
                <p>Manage and view employee attendance.</p>
            </div>
            

            <form
                className="attendance-form"
                onSubmit={handleMarkAttendance}
            >
                <input
                    type="text"
                    placeholder="Enter employee name"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    required
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="On Leave">On Leave</option>
                </select>

                <button
        type="button"
        className="attendance-back-button"
        onClick={() => navigate(-1)}
    >
        ← Back To Dashboard
    </button>

                <button type="submit">Mark Attendance</button>
            </form>

            <div className="attendance-table-container">
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {attendance.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.employeeName}</td>
                                <td>{item.date}</td>
                                <td>{item.status}</td>
                            </tr>
                        ))}

                        {attendance.length === 0 && (
                            <tr>
                                <td colSpan="4">
                                    No attendance records available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Attendance;
