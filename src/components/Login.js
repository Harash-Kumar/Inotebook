import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  // 🔹 Controls password visibility (eye icon)
  const [showPassword, setShowPassword] = useState(false);

  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {``
      //Save the auth token and redirect
      localStorage.setItem("token", json.authtoken);
      props.showAlert("Logged in successfully", "success");
      // ✅ STORE LOGGED-IN USER DATA (IMPORTANT)
      localStorage.setItem("user", JSON.stringify(json.user));
      navigate("/");
    } else {
      props.showAlert("Invalid Details", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    // 🔹 Full screen container (used to center login card)
    <div className="login-container">
      {/* 🔹 White card box */}
      <div className="login-card">
        {/* 🔹 Page heading */}
        <h2>
          Login to <span>iNotebook</span>
        </h2>

        {/* 🔹 Login form */}
        <form onSubmit={handleSubmit}>
          {/* 🔹 Email input */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>

            <input
              type="email"
              className="form-control" // Bootstrap input styling
              value={credentials.email}
              onChange={onChange} // updates state
              id="email"
              name="email"
              required
            />

            {/* 🔹 Small helper text */}
            <div className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>

          {/* 🔹 Password input */}
          <div className="mb-3 position-relative">
            {/* 🔹 Password label */}
            <label htmlFor="password" className="form-label">
              Password
            </label>

            {/* 🔹 Password input */}
            <input
              type={showPassword ? "text" : "password"} // toggle type
              className="form-control"
              value={credentials.password}
              onChange={onChange}
              id="password"
              name="password"
              required
            />

            {/* 🔹 Eye icon (uses existing App.css styles) */}
            <i
              className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} eye-icon`}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
            ></i>
          </div>

          {/* 🔹 Submit button */}
          <button type="submit" className="btn login-btn">
            Login
          </button>
        </form>

        {/* 🔹 Footer text */}
        <div className="login-footer">
          Don’t have an account? <a href="/signup">Sign up here</a>
        </div>
      </div>
    </div>
  );
};
export default Login;