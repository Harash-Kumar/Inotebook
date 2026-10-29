// frontend/src/App.js

import "./App.css";
import About from "./components/About";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useState } from "react";

function App() {
  const [alert, setAlert] = useState(null);

  // 🔹 Global alert
  const showAlert = (message, type) => {
    setAlert({ msg: message, type });
    setTimeout(() => setAlert(null), 1500);
  };

  // 🔹 AUTH CHECK (single source of truth)
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <NoteState>
      <Router>
        <Navbar />
        {/* 
        🔹 Render Alert ONLY when alert exists
         This prevents empty space above Login page
        */}
        {alert && <Alert alert={alert} />}
        <Routes>
          {/* 🔒 PROTECTED ROUTES */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Home showAlert={showAlert} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/about"
            element={
              isLoggedIn ? (
                <About showAlert={showAlert} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 🌍 PUBLIC ROUTES */}
          <Route path="/login" element={<Login showAlert={showAlert} />} />
          <Route path="/signup" element={<Signup showAlert={showAlert} />} />
        </Routes>
      </Router>
    </NoteState>
  );
}

export default App;
