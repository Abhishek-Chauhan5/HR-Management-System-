import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import api from "../services/api";
import "../App.css";

function Dashboard() {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [message, setMessage] = useState("");
    

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response = await api.get(
                    "accounts/dashboard/"
                );

                setDashboardData(response.data);

            } catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );

                setMessage(
                    "Unable to load dashboard"
                );
            }
        };

        fetchDashboard();

    }, []);


    // Data for circle graph
    const graphData = dashboardData
        ? [
            {
                name: "Employees",
                value: dashboardData.total_employees ?? 0,
            },
            {
                name: "Present",
                value: dashboardData.present_today ?? 0,
            },
            {
                name: "On Leave",
                value: dashboardData.on_leave ?? 0,
            },
            {
                name: "Pending Leaves",
                value: dashboardData.pending_leaves ?? 0,
            },
        ]
        : [];


    // Circle graph sections
    const COLORS = [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#8b5cf6",
    ];


    return (

        <div className="dashboard-container">

            {/* =================================
                SIDEBAR
            ================================= */}

            <aside className="sidebar">

                <h2>HR Management</h2>

                <nav className="sidebar-nav">

                    <ul>

                        <li>Dashboard</li>

                        <li onClick={() => navigate("/employees")}>
                            Employees
                        </li>

                        <li onClick={() => navigate("/departments")}>
                            Departments
                        </li>

                        <li onClick={() => navigate("/attendance")}>
                            Attendance
                        </li>

                        <li onClick={() => navigate("/leave-management")}>
                            Leave Management
                        </li>

                    </ul>

                </nav>


                {/* Sidebar Footer */}

                <div className="sidebar-footer">

                    <div className="profile-item">
                        Profile
                    </div>

                </div>

            </aside>


            {/* =================================
                MAIN CONTENT
            ================================= */}

            <main className="dashboard-main">

                <h1>Dashboard</h1>

                <p>
                    Welcome to the HR Management System.
                </p>


                {/* =================================
                    ERROR MESSAGE
                ================================= */}

                {message && (
                    <p className="error-message">
                        {message}
                    </p>
                )}


                {/* =================================
                    WELCOME BOX
                ================================= */}

                {dashboardData && (

                    <div className="welcome-box">

                        <h2>
                            {dashboardData.message}
                        </h2>

                        <p>
                            <strong>Role:</strong>{" "}
                            {dashboardData.role}
                        </p>

                        <p>
                            {dashboardData.access}
                        </p>

                    </div>

                )}


                {/* =================================
                    DASHBOARD CARDS
                ================================= */}

                <div className="dashboard-cards">


                    {/* Total Employees */}

                    <div className="dashboard-card card-blue">

                        <h3>Total Employees</h3>

                        <p>
                            {dashboardData?.total_employees ?? 0}
                        </p>

                        <span>
                            Employees
                        </span>

                    </div>


                    {/* Present */}

                    <div className="dashboard-card card-green">

                        <h3>Present Today</h3>

                        <p>
                            {dashboardData?.present_today ?? 0}
                        </p>

                        <span>
                            Present
                        </span>

                    </div>


                    {/* On Leave */}

                    <div className="dashboard-card card-orange">

                        <h3>On Leave</h3>

                        <p>
                            {dashboardData?.on_leave ?? 0}
                        </p>

                        <span>
                            Employees on leave
                        </span>

                    </div>


                    {/* Pending Leaves */}

                    <div className="dashboard-card card-purple">

                        <h3>Pending Leaves</h3>

                        <p>
                            {dashboardData?.pending_leaves ?? 0}
                        </p>

                        <span>
                            Awaiting approval
                        </span>

                    </div>

                </div>


                {/* =================================
                    CIRCLE GRAPH
                ================================= */}

                <div className="dashboard-graph">

                    <div className="graph-header">

                        <div>

                            <h2>HR Overview</h2>

                            <p>
                                Employee and leave status overview
                            </p>

                        </div>

                    </div>


                    <div className="circle-chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={380}
                        >

                            <PieChart>

                                <Pie
                                    data={graphData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="48%"
                                    innerRadius={85}
                                    outerRadius={135}
                                    paddingAngle={4}
                                    cornerRadius={6}
                                >

                                    {graphData.map(
                                        (entry, index) => (

                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />

                                        )
                                    )}

                                </Pie>


                                {/* Hover Information */}

                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        boxShadow:
                                            "0 5px 15px rgba(0,0,0,0.08)",
                                    }}
                                />


                                {/* Graph Labels */}

                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;