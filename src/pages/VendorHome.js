import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import socket from "../socket";

function VendorHome() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const vendorName = localStorage.getItem("vendorName") || "Vendor";
  const vendorId = localStorage.getItem("vendorId");

  const vendorLogos = {
    V001: "/images/vendors/nithya.png",
    V002: "/images/vendors/hotbreads.png",
    V003: "/images/vendors/quench.png",
  };

  const vendorLogo = vendorLogos[vendorId] || "/images/vendors/default.png";


  const [stats, setStats] = useState({ orders: 0, revenue: 0 });
  console.log("vendor name:",localStorage.getItem("vendorName") );

  const fetchStats = async () => {
    try {
      const res = await API.get("/orders/vendor");
      const orders = res.data;

      const today = new Date().toDateString();

      const todayOrders = orders.filter(
        (o) => new Date(o.createdAt).toDateString() === today
      );
      const completedOrders = todayOrders.filter(
        (o) => o.status === "Completed"
      );

      const revenue = completedOrders.reduce(
        (sum, o) => sum + o.totalAmount,
        0
      );

      setStats({
        orders: todayOrders.length,
        revenue,
      });
    } catch (err) {
      console.log("Stats fetch failed");
    }
  };

  useEffect(() => {
    fetchStats();

    socket.on("connect", ()=> {
      console.log("connectedddd:", socket.id)
    });

    const handleOrderUpdate = (data) => {
      console.log("socket receievd:", data);
      fetchStats();
    }

    socket.on("orderUpdated", handleOrderUpdate);

    return () => {
      socket.off("orderUpdated", handleOrderUpdate);
    };
  }, []);

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
            padding: "0 18px",
            fontWeight: "600",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{ fontSize: "22px", cursor: "pointer" }}
            onClick={() => setOpen(!open)}
          >
            ☰
          </span>

          <span>Dashboard</span>
          <span></span>
        </div>

        {/* MAIN */}
        <div style={{ display: "flex", flex: 1 }}>

          <Sidebar
            title="CampusCrave"
            isOpen={open}
            setOpen={setOpen}
            items={[
              { label: "Dashboard", path: "/vendor" },
              { label: "Orders", path: "/vendor/orders" },
              { label: "Menu", path: "/vendor/menu" },
              { label: "History", path: "/vendor/history" },
            ]}
          />

          <div className="app-content">
            <div className="container" style={{ background: "#f7f9fb" }}>

              {/* BANNER */}
              <div
                style={{
                  background: "linear-gradient(135deg,#0f9d58,#128c7e)",
                  borderRadius: "20px",
                  padding: "20px",
                  color: "white",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px"
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    color: "#0f9d58",
                    fontSize: "22px"
                  }}
                >
                  <div
  style={{
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "white",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px, solid white"
  }}
>
  <img
    src={vendorLogo}
    alt="Vendor"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
    }}
  />
</div>
                </div>

                <div>
                  <h2 style={{ margin: 0 }}>{vendorName}</h2>
                  <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
                    Manage your orders & menu efficiently 🚀
                  </p>
                </div>
              </div>

              {/* NAV CARDS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: "16px",
                  marginBottom: "20px"
                }}
              >

                <div
                  onClick={() => navigate("/vendor/orders")}
                  style={{ ...cardStyle, borderLeft: "5px solid #0f9d58" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  📦 Incoming Orders
                </div>

                <div
                  onClick={() => navigate("/vendor/menu")}
                  style={{ ...cardStyle, borderLeft: "5px solid #ff9800" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  🍽 Manage Menu
                </div>

                <div
                  onClick={() => navigate("/vendor/history")}
                  style={{ ...cardStyle, borderLeft: "5px solid #2196f3" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  📜 Order History
                </div>

              </div>

              {/* STATS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px"
                }}
              >
                <div className="card">
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    Today's Orders
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: "700" }}>
                    {stats.orders}
                  </div>
                </div>

                <div className="card">
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    Revenue
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: "700" }}>
                    ₹{stats.revenue}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "linear-gradient(135deg,#ffffff,#f1f8f5)",
  borderRadius: "18px",
  padding: "22px",
  textAlign: "center",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  transition: "0.2s",
};

export default VendorHome;