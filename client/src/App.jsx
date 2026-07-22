import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Signup from "./pages/Signup.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import TwoFactorAuth from "./pages/TwoFactorAuth.jsx";
import Budgets from "./pages/Budgets.jsx";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path='/' element={<Login/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/two-factor" element={<TwoFactorAuth />} />

        {/* PROTECTED ROUTES */}
        <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/Transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/Reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />

        {/* ADMIN ROUTES */}
        <Route path="/adminDashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      </Routes>
    </Router>
  );
}

export default App;