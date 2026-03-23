import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Login() {

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();
    setError("");

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    try {

      const res = await API.post("/auth/login", {
        userId,
        password
      });

      /* ROLE VALIDATION */

      if (res.data.role !== selectedRole) {
        setError("You selected the wrong role for this account");
        setPassword("");
        return;
      }

      
      /* SAVE AUTH DATA */

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("vendorId", res.data.vendorId || "");
      localStorage.setItem("name", res.data.name);

      const vendorMap = {
        V001: "Nithya Amirtham",
        V002: "Hot Breads",
        V003: "Quench",
      };

      const vendorName = vendorMap[res.data.vendorId] || "Vendor";

      localStorage.setItem("vendorName", vendorName);

      console.log("login response:", res.data);

      /* REDIRECT */

      if (res.data.role === "student") {
        navigate("/student", { replace: true });
      }

      else if (res.data.role === "vendor") {
        navigate("/vendor", { replace: true });
      }

      else if (res.data.role === "admin") {
        navigate("/admin", { replace: true });
      }

    }

    catch (err) {

      const message =
        err.response?.data?.message ||
        "Invalid credentials";

      setError(message);
      setPassword("");

    }

  };


  return (

  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f4fff9, #ffffff)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Segoe UI, sans-serif"
    }}
  >

    <div className="mobile-frame">

      {/* LOGO */}

      <div style={{ textAlign: "center", marginBottom: "20px" }}>

        <img
          src={logo}
          alt="CampusCrave"
          style={{ width: "90px", marginBottom: "8px" }}
        />

        <h2 style={{ margin: 0, color: "#0f9d58" }}>
          CampusCrave
        </h2>

        <p
          style={{
            margin: "4px 0",
            fontSize: "13px",
            color: "#555"
          }}
        >
          M.O.P Vaishnav College for Women
        </p>

      </div>


      {/* ROLE SELECT */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "18px"
        }}
      >

        {["student", "vendor", "admin"].map((role) => (

          <div
            key={role}
            className={`role-card ${
              selectedRole === role ? "active" : ""
            }`}
            onClick={() => setSelectedRole(role)}
            style={{ textTransform: "capitalize" }}
          >
            {role}
          </div>

        ))}

      </div>


      {/* LOGIN FORM */}

      <form onSubmit={handleLogin}>

        {/* ERROR MESSAGE */}

        {error && (

          <div
            style={{
              background: "#fdecea",
              color: "#b71c1c",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "12px",
              fontSize: "13px",
              textAlign: "center"
            }}
          >
            {error}
          </div>

        )}


        <input
          className="login-input"
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />


        <div style={{ height: "12px" }} />


        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />


        <div style={{ height: "18px" }} />


        <button type="submit" className="login-btn">
          Login
        </button>

      </form>

    </div>

  </div>

  );

}

export default Login;