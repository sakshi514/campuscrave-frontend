import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function AdminHome() {
  const [open, setOpen] = useState(false);

  const [stats, setStats] = useState({
    users: 0,
    students: 0,
    vendors: 0,
    admins: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRes = await API.get("/admin/users");
        const users = usersRes.data;

        const students = users.filter(u => u.role === "student").length;
        const vendors = users.filter(u => u.role === "vendor").length;
        const admins = users.filter(u => u.role === "admin").length;

        setStats({
          users: users.length,
          students,
          vendors,
          admins
        });

      } catch (err) {
        console.log("Failed loading stats");
      }
    };

    fetchStats();
  }, []);

  const cardStyle = {
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
    color: "white"
  };

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
            padding: "0 18px",
            fontWeight: "600",
            flexShrink: 0
          }}
        >
          <span
            style={{ fontSize: "22px", cursor: "pointer" }}
            onClick={() => setOpen(!open)}
          >
            ☰
          </span>

          <span>Admin Dashboard</span>

          <span></span>
        </div>

        {/* MAIN AREA */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          <Sidebar
            isOpen={open}
            setOpen={setOpen}
            items={[
              { label: "Dashboard", path: "/admin" },
              { label: "Users", path: "/admin/users" },
              { label: "Analytics", path: "/admin/analytics" }
            ]}
          />

          {/* CONTENT */}
          <div className="app-content">
            <div
              className="container"
              style={{ background: "#f7f9fb", minHeight: "100%" }}
            >

              {/* HEADER */}
              <div
                style={{
                  background: "linear-gradient(135deg,#0f9d58,#128c7e)",
                  borderRadius: "18px",
                  padding: "20px",
                  color: "white",
                  marginBottom: "20px",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.1)"
                }}
              >
                <h2 style={{ marginBottom: "5px" }}>Welcome Admin 👋</h2>
                <p style={{ fontSize: "13px", opacity: 0.9 }}>
                  Manage users and monitor system performance
                </p>
              </div>

              {/* STATS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
                  gap: "16px"
                }}
              >

                <div style={{ ...cardStyle, background: "linear-gradient(135deg,#4facfe,#00f2fe)" }}>
                  <div>Total Users</div>
                  <div style={{ fontSize: "26px", fontWeight: "700" }}>{stats.users}</div>
                </div>

                <div style={{ ...cardStyle, background: "linear-gradient(135deg,#43e97b,#38f9d7)" }}>
                  <div>Students</div>
                  <div style={{ fontSize: "26px", fontWeight: "700" }}>{stats.students}</div>
                </div>

                <div style={{ ...cardStyle, background: "linear-gradient(135deg,#fa709a,#fee140)" }}>
                  <div>Vendors</div>
                  <div style={{ fontSize: "26px", fontWeight: "700" }}>{stats.vendors}</div>
                </div>

                <div style={{ ...cardStyle, background: "linear-gradient(135deg,#667eea,#764ba2)" }}>
                  <div>Admins</div>
                  <div style={{ fontSize: "26px", fontWeight: "700" }}>{stats.admins}</div>
                </div>

              </div>

              {/* QUICK ACTIONS */}
              <h3 style={{ marginTop: "25px", marginBottom: "10px" }}>
                Quick Actions
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
                  gap: "16px"
                }}
              >
                <div className="card" style={{ cursor: "pointer" }} onClick={() => window.location.href = "/admin/users"}>
                  Manage Users
                </div>

                <div className="card" style={{ cursor: "pointer" }} onClick={() => window.location.href = "/admin/analytics"}>
                  View Analytics
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminHome;