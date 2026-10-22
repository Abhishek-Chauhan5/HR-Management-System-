
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LeaveManagement.css";
import api from "../services/api";

function LeaveManagement() {
    const navigate = useNavigate();

    const [leaves, setLeaves] = useState([]);
    const [employeeName, setEmployeeName] = useState("");
    const [leaveType, setLeaveType] = useState("Casual Leave");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch leave requests
    const fetchLeaves = async () => {
        try {
            setLoading(true);

            const response = await api.get("accounts/leaves/");
            const data = response.data;

            setLeaves(
                Array.isArray(data)
                    ? data
                    : data.results || []
            );
        } catch (error) {
            console.error("Failed to fetch leave requests:", error);
            alert("Unable to load leave requests. Please check your login and API.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    // Approve or reject a leave request
    const handleLeaveStatus = async (id, newStatus) => {
        try {
            await api.patch(`accounts/leaves/${id}/`, {
                status: newStatus.toLowerCase(),
            });

            setLeaves((previous) =>
                previous.map((leave) =>
                    leave.id === id
                        ? { ...leave, status: newStatus.toLowerCase() }
                        : leave
                )
            );
        } catch (error) {
            console.error("Failed to update leave status:", error);
            alert(
                "Unable to update status. Please check the backend permissions and serializer."
            );
        }
    };

    // Apply for leave
    const handleApplyLeave = async (e) => {
        e.preventDefault();

        if (!employeeName.trim() || !fromDate || !toDate || !reason.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        if (toDate < fromDate) {
            alert("To Date cannot be earlier than From Date.");
            return;
        }

        try {
            const response = await api.post("accounts/leaves/", {
                start_date: fromDate,
                end_date: toDate,
                reason: reason.trim(),
            });

            setLeaves((previous) => [...previous, response.data]);

            setEmployeeName("");
            setLeaveType("Casual Leave");
            setFromDate("");
            setToDate("");
            setReason("");

            alert("Leave request submitted successfully.");
        } catch (error) {
            console.error("Failed to submit leave request:", error);
            alert(
                "Unable to submit leave request. Please check your login and backend API."
            );
        }
    };

    // Normalize status returned by Django
    const getStatus = (status) => {
        const value = String(status || "pending").toLowerCase();

        return value.charAt(0).toUpperCase() + value.slice(1);
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
                    onClick={() => navigate("/dashboard")}
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
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8">Loading leave requests...</td>
                            </tr>
                        ) : leaves.length === 0 ? (
                            <tr>
                                <td colSpan="8">No leave requests available.</td>
                            </tr>
                        ) : (
                            leaves.map((leave, index) => {
                                const status = getStatus(leave.status);
                                const isPending =
                                    String(leave.status || "pending").toLowerCase() ===
                                    "pending";

                                return (
                                    <tr key={leave.id}>
                                        <td>{index + 1}</td>

                                        <td>
                                            {leave.employee_name ||
                                                leave.employeeName ||
                                                leave.employee ||
                                                "—"}
                                        </td>

                                        <td>
                                            {leave.leave_type ||
                                                leave.leaveType ||
                                                "—"}
                                        </td>

                                        <td>{leave.start_date || leave.fromDate}</td>
                                        <td>{leave.end_date || leave.toDate}</td>
                                        <td>{leave.reason}</td>

                                        <td>
                                            <span
                                                className={`leave-status ${status.toLowerCase()}`}
                                            >
                                                {status}
                                            </span>
                                        </td>

                                        <td>
                                            {isPending ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="leave-approve-button"
                                                        onClick={() =>
                                                            handleLeaveStatus(
                                                                leave.id,
                                                                "approved"
                                                            )
                                                        }
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="leave-reject-button"
                                                        onClick={() =>
                                                            handleLeaveStatus(
                                                                leave.id,
                                                                "rejected"
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="leave-no-action">
                                                    No actions
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LeaveManagement;
