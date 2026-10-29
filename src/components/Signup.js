import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Signup.css'              // 🔧 ADDED: import signup styles

const Signup = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);  
  const [image, setImage] = useState(null); // 🔧 REQUIRED: image preview state

  // 🔧 REQUIRED: actual file state
  const [imageFile, setImageFile] = useState(null);

  let navigate = useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", credentials.name);
  formData.append("email", credentials.email);
  formData.append("password", credentials.password);

  // 🔧 ADD IMAGE
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch("http://localhost:5000/api/auth/createuser", {
    method: "POST",
    body: formData
  });

  const json = await response.json();

  if (json.success) {
    localStorage.setItem("token", json.authtoken);
    props.showAlert("Account created successfully", "success");
    navigate("/login");
  } else {
    props.showAlert("Invalid credentials", "danger");
  }
};


  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  // 🔧 ADDED: image handler
 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(URL.createObjectURL(file)); // preview
    setImageFile(file);                 // 🔥 actual file
  }
};


  return (
    <div className="signup-body"> {/* 🔧 ADDED: full page background */}
      <div className={`signup-wrapper ${image ? "active" : ""}`}> {/* 🔧 ADDED */}
        <div className='form-container'>
          <h2 className='my-1'>Create an account </h2>
          <form onSubmit={handleSubmit}>
            {/* IMAGE INPUT */}
            <label className="custom-file-upload">
              <i className="fa-solid fa-cloud-arrow-up"></i>
              Upload Profile Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            <div className="mb-3 position-relative">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control custom-input" id="name" name='name' value={credentials.name} onChange={onChange} aria-describedby="emailHelp" />
              {/* ❌ Show only if something is typed */}
              {credentials.name && (
                <i
                  className="fa-solid fa-circle-xmark clear-icon"
                  onClick={() =>
                    setCredentials({ ...credentials, name: "" })
                  }
                />
              )}
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control custom-input" id="email" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
              {/* ❌ Show only if something is typed */}
              {credentials.email && (
                <i
                  className="fa-solid fa-circle-xmark clear-icon"
                  onClick={() =>
                    setCredentials({ ...credentials, email: "" })
                  }
                />
              )}
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">Password</label>
              <input type={showPassword ? "text" : "password"} className="form-control custom-input" id="password" name='password' onChange={onChange} minLength={5} required />
              {/* Eye icon */}
              <i
                className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  top: "70%",
                  right: "15px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6c757d"
                }}
              />
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="cpassword" className="form-label">Confirm Password</label>
              <input type={showCPassword ? "text" : "password"} className="form-control custom-input" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required />
              {/* Eye icon */}
              <i
                className={`fa-solid ${showCPassword ? "fa-eye-slash" : "fa-eye"}`}
                onClick={() => setShowCPassword(!showCPassword)}
                style={{
                  position: "absolute",
                  top: "70%",
                  right: "15px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6c757d"
                }}
              />
            </div>

            <button type="submit" className="submit-btn btn btn-primary">Submit</button>
          </form>
        </div>
        {/* ================= IMAGE PREVIEW ================= */}
        <div className="image-preview"> {/* 🔧 ADDED */}
          {image && <img src={image} alt="Preview" />}
        </div>
      </div>
    </div>
  )
}

export default Signup
