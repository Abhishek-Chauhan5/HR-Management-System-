import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import LeaveManagement from "./pages/LeaveManagement";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute>
                    <Dashboard />
                    </ProtectedRoute>} />
                <Route path="/employees" element={<Employees />} />    
                <Route path="/departments" element={<Departments />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leave-management" element={<LeaveManagement />} />
            </Routes>
                
        </BrowserRouter>
    );
}

export default App;