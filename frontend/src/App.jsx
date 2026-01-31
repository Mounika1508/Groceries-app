import {Routes, Route, Link} from "react-router-dom";
import axios from "./config/axios";
import "./App.css"
import Register from "./pages/Register";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import { useContext } from "react";
import UserContext from "./context/UserContext";

export default function App(){
  const {isLoggedIn, handleLogout, user} = useContext(UserContext);
  return (
    <div>
      <header className="top-nav">
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>

          {(isLoggedIn || localStorage.getItem('token')) && (
            <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            
            {user?.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
            <li><Link to='/' onClick={()=> { handleLogout() }}>Logout</Link></li>
            </>
          )}

          {(!isLoggedIn && !localStorage.getItem('token') && (
            <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            </>
          ))}
        </ul>
      </header>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        
      </Routes>
    </div>
  )
}