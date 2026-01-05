import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/register";
import Dashboard from "./Pages/Dashboard";
import Accounts from "./Pages/Accounts";
import Transfer from "./Pages/Transfer";
import ConcurrencyTest from "./Pages/ConcurrencyTest";
// import Ledger from "./Pages/Ledger";
// import SendMoney from "./Pages/SendMoney";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


  
function App() {
  const token = localStorage.getItem("token");

  return (
    
    <Router>
       <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
          
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/transfer" element={token ? <Transfer /> : <Navigate to="/login" />} />
          <Route path="/concurrencytest" element={token ? <ConcurrencyTest /> : <Navigate to="/login" />} />
        <Route path="/accounts" element={token ? <Accounts /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
