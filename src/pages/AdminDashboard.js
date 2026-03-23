import { useState } from "react";
import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* top bar */}
      <div
        style={{
          height: "50px",
          background: "#0f9d58",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 15px",
        }}
      >
        <span
          style={{ fontSize: "22px", cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        >
          ☰
        </span>

        <span style={{ marginLeft: "12px", fontWeight: "600" }}>
          CampusCrave
        </span>
      </div>

      <div style={{ display: "flex" }}>
        <Sidebar
          title="CampusCrave"
          isOpen={open}
          items={[
            { label: "Dashboard", path: "/admin" },
          ]}
        />

        <div style={{ flex: 1 }}>
          <div className="container">
            <h2>Admin Dashboard</h2>
            <p>Admin module will be added in the next phase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
