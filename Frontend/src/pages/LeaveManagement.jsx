
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeaveManagement.css";

function LeaveManagement() {
    const navigate = useNavigate();
    const [leaves, setLeaves] = useState([]);
    const [employeeName, setEmployeeName] = useState("");
    const [leaveType, setLeaveType] = useState("Casual Leave");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setReason] = useState("");

    const handleApplyLeave = (e) => {
        e.preventDefault();

        if (!employeeName.trim() || !fromDate || !toDate || !reason.trim()) {
            return;
        }

        if (toDate < fromDate) {
            alert("To Date cannot be earlier than From Date.");
            return;
        }

        setLeaves((previous) => [
            ...previous,
            {
                id: Date.now(),
                employeeName: employeeName.trim(),
                leaveType,
                fromDate,
                toDate,
                reason: reason.trim(),
                status: "Pending",
            },
        ]);

        setEmployeeName("");
        setLeaveType("Casual Leave");
        setFromDate("");
        setToDate("");
        setReason("");
    };

    return (
        <div className="leave-page">
            <div className="leave-header">
                <div>
                    <h1>Leave Management</h1>
                    <p>Manage and track employee leave requests.</p>
                </div>

                <button
                    type="button"
                    className="leave-back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back To Dashboard
                </button>
            </div>

            <form className="leave-form" onSubmit={handleApplyLeave}>
                <input
                    type="text"
                    placeholder="Employee name"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    required
                />

                <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                >
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                    <option>Earned Leave</option>
                    <option>Unpaid Leave</option>
                </select>

                <label>
                    From Date
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        required
                    />
                </label>

                <label>
                    To Date
                    <input
                        type="date"
                        value={toDate}
                        min={fromDate || undefined}
                        onChange={(e) => setToDate(e.target.value)}
                        required
                    />
                </label>

                <textarea
                    placeholder="Reason for leave"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />

                <button type="submit">+ Apply for Leave</button>
            </form>

            <div className="leave-table-container">
                <table className="leave-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee</th>
                            <th>Leave Type</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Reason</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {leaves.map((leave, index) => (
                            <tr key={leave.id}>
                                <td>{index + 1}</td>
                                <td>{leave.employeeName}</td>
                                <td>{leave.leaveType}</td>
                                <td>{leave.fromDate}</td>
                                <td>{leave.toDate}</td>
                                <td>{leave.reason}</td>
                                <td>
                                    <span className="leave-status">
                                        {leave.status}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {leaves.length === 0 && (
                            <tr>
                                <td colSpan="7">
                                    No leave requests available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LeaveManagement;
