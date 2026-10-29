// frontend/src/components/Navbar.js

import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NoteContext from "../context/notes/noteContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setNotes } = useContext(NoteContext);

  // 🔹 Holds logged-in user data
  const [user, setUser] = useState(null);

  // 🔹 Sync user from localStorage on refresh / route change
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]); // runs after login / logout navigation

  // 🔹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);       // update UI immediately
    setNotes([]);        // clear notes
    navigate("/login");
  };

  // 🔹 Auth state (DO NOT directly use localStorage in JSX)
  const isLoggedIn = Boolean(user);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">

        <Link className="navbar-brand" to="/">
          iNotebook
        </Link>

        <div className="collapse navbar-collapse">
        
          {/* 🔹 SHOW LINKS ONLY WHEN LOGGED IN */}
          {isLoggedIn && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                  to="/"
                >
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
                  to="/about"
                >
                  About
                </Link>
              </li>
            </ul>
          )}

          {/* 🔹 RIGHT SIDE */}
          {isLoggedIn ? (
            <div className="d-flex align-items-center gap-3">
              {/* Profile image */}
              {user?.profileImage && (
                <img
                  src={`http://localhost:5000/${user.profileImage}`}
                  alt="profile"
                  className="navbar-profile-img"
                />
              )}

              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            </div>
          ) : (
            <div className="d-flex">
              <Link className="btn btn-primary mx-1" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary mx-1" to="/signup">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
