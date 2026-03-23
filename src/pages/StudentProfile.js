import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function StudentProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    orders: 0,
    spent: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Get user from localStorage instead of API
        const userData = {
          userId: localStorage.getItem("userId"),
          name: localStorage.getItem("userName"),
          role: localStorage.getItem("role"),
          department: localStorage.getItem("department") || "BCA",
          year: localStorage.getItem("year") || "3",
        };

        setUser(userData);

        // ✅ Fetch orders
        const ordersRes = await API.get("/orders/student");
        const orders = ordersRes.data;

        const totalSpent = orders.reduce(
          (sum, o) => sum + o.totalAmount,
          0
        );

        setStats({
          orders: orders.length,
          spent: totalSpent,
        });

      } catch (err) {
        console.log("Profile load failed", err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <div className="app-wrapper">
      <div className="app-container">

        {/* TOP BAR */}
        <div
          style={{
            height: "55px",
            background: "linear-gradient(90deg,#0f9d58,#128c7e)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            fontWeight: "600",
          }}
        >
          <span style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>←</span>
          <span>My Profile</span>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/student")}>🏠</span>
        </div>

        {/* CONTENT */}
        <div className="app-content">
          <div className="container" style={{ background: "#f7f9fb", minHeight: "100%" }}>

            {/* PROFILE CARD */}
            <div
              style={{
                background: "linear-gradient(135deg,#0f9d58,#128c7e)",
                borderRadius: "20px",
                padding: "20px",
                color: "white",
                textAlign: "center",
                marginBottom: "20px",
                boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "white",
                  margin: "0 auto 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  color: "#0f9d58",
                  fontWeight: "700",
                }}
              >
                {user.name ? user.name[0] : "S"}
              </div>

              <h3>{user.name || "Student"}</h3>
              <p>ID: {user.userId}</p>
              <p>{user.department} • Year {user.year}</p>
            </div>

            {/* STATS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div className="card">
                <div style={{ fontSize: "12px", color: "#777" }}>Orders</div>
                <div style={{ fontSize: "22px", fontWeight: "700" }}>{stats.orders}</div>
              </div>

              <div className="card">
                <div style={{ fontSize: "12px", color: "#777" }}>Total Spent</div>
                <div style={{ fontSize: "22px", fontWeight: "700" }}>₹{stats.spent}</div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="card" style={{ marginBottom: "12px" }}>

  <div style={{ padding: "12px", fontWeight: "600" }}>
    🆘 Support
  </div>

  {/* EMAIL */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 12px",
      borderTop: "1px solid #eee"
    }}
  >
    <span>📧</span>
    <a
      href="mailto:campuscrave@gmail.com"
      style={{ textDecoration: "none", color: "#333", fontSize: "14px" }}
    >
      campuscrave@gmail.com
    </a>
  </div>

  {/* PHONE */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 12px",
      borderTop: "1px solid #eee"
    }}
  >
    <span>📞</span>
    <span style={{ fontSize: "14px", color: "#333" }}>
      +91 98765 43210
    </span>
  </div>

  {/* LOGOUT */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px",
      borderTop: "1px solid #eee",
      color: "red",
      fontWeight: "600",
      cursor: "pointer"
    }}
    onClick={handleLogout}
  >
    <span>🚪</span>
    Logout
  </div>

</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentProfile;