import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import socket from "../socket";

function VendorOrders() {

  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);

  const vendorName = localStorage.getItem("vendorName") || "Vendor";

  const fetchOrders = async () => {
    try {

      const res = await API.get("/orders/vendor");

      const activeOrders = res.data.filter(
        (order) => order.status !== "Completed"
      );

      setOrders(activeOrders);

    } catch (err) {

      console.log("Error loading orders");

    }
  };

  useEffect(() => {

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/vendor");

      setOrders(res.data.filter(order => order.isActive));

    } catch (err) {
      console.log("Failed to load vendor orders");
    }
  };

  fetchOrders();

  // 🔥 NEW ORDER ALERT
  socket.on("newOrder", (data) => {

    // only for this vendor
    if (data.vendorId !== localStorage.getItem("vendorId")) return;

    

    // refresh list
    fetchOrders();

  });

  // 🔥 STATUS UPDATE
  socket.on("orderUpdated", (data) => {

    setOrders((prevOrders) =>
      prevOrders
        .map((order) =>
          order.orderId === data.orderId
            ? {
                ...order,
                status: data.status,
                isActive: data.status === "Completed" ? false : true
              }
            : order
        )
        .filter((order) => order.isActive)
    );

  });

  // 🔥 CLEANUP
  return () => {
    socket.off("newOrder");
    socket.off("orderUpdated");
  };

}, []);


  const updateStatus = async (orderId, newStatus) => {

    try {

      await API.put(`/orders/${orderId}/status`, {
        status: newStatus
      });

      // refresh orders after update
      fetchOrders();

    } catch (err) {

      console.log("Status update failed", err);

    }
  };


  const shortId = (id) => {
    return "#" + id.slice(-5);
  };


  const formatDate = (date) => {

    const d = new Date(date);

    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });

  };


  const statusColor = (status) => {

    if (status === "Pending") return "#fff8e1";       // light yellow
    if (status === "In Process") return "#e3f2fd";    // light blue
    if (status === "Ready") return "#e8f5e9";         // light green

    return "#ffffff";

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
            padding: "0 18px",
            fontWeight: "600",
            justifyContent: "space-between",
            flexShrink: 0
          }}
        >

          <span
            style={{ fontSize: "22px", cursor: "pointer" }}
            onClick={() => setOpen(!open)}
          >
            ☰
          </span>

          <span>{vendorName} Orders</span>

          <span
            style={{ cursor: "pointer", fontSize: "18px" }}
            onClick={() => window.location.href = "/vendor"}
          >
            🏠
          </span>

        </div>


        {/* MAIN AREA */}

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* SIDEBAR */}

          <Sidebar
            title="CampusCrave"
            isOpen={open}
            setOpen={setOpen}
            items={[
              { label: "Dashboard", path: "/vendor" },
              { label: "Orders", path: "/vendor/orders" },
              { label: "Menu", path: "/vendor/menu" },
              { label: "History", path: "/vendor/history" }
            ]}
          />


          {/* CONTENT */}

          <div className="app-content">

            <div
              className="container"
              style={{
                background: "#f7f9fb",
                minHeight: "100%"
              }}
            >

              <h2 style={{ marginBottom: "16px" }}>
                Incoming Orders
              </h2>

              {orders.length === 0 && (
                <p>No incoming orders</p>
              )}

              {orders.map((order) => (

                <div
                  key={order._id}
                  style={{
                    background: statusColor(order.status),
                    borderRadius: "16px",
                    padding: "16px",
                    marginBottom: "14px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.06)"
                  }}
                >

                  {/* HEADER */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px"
                    }}
                  >

                    <div>

                      <strong>
                        Order {shortId(order.orderId)}
                      </strong>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#555"
                        }}
                      >
                        {formatDate(order.createdAt)}
                      </div>

                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        padding: "5px 12px",
                        borderRadius: "14px",
                        background: "#0f9d58",
                        color: "white",
                        fontWeight: "600"
                      }}
                    >
                      {order.status}
                    </div>

                  </div>


                  {/* STUDENT */}

                  <div style={{ marginBottom: "8px" }}>
                    Student: {order.studentName || order.studentId}
                  </div>


                  {/* ITEMS */}

                  {order.items.map((item, i) => (

                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >

                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <span>
                        ₹{item.price * item.quantity}
                      </span>

                    </div>

                  ))}


                  {/* TOTAL */}

                  <div
                    style={{
                      marginTop: "8px",
                      fontWeight: "600",
                      textAlign: "right",
                      color: "#0f9d58"
                    }}
                  >
                    Total ₹{order.totalAmount}
                  </div>


                  {/* STATUS BUTTONS */}

                  <div style={{ marginTop: "12px" }}>

                    {order.status === "Pending" && (
                      <button
                        className="primary-btn"
                        onClick={() => updateStatus(order._id, "In Process")}
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === "In Process" && (
                      <button
                        className="primary-btn"
                        onClick={() => updateStatus(order._id, "Ready")}
                      >
                        Mark Ready
                      </button>
                    )}

                    {order.status === "Ready" && (
                      <button
                        className="primary-btn"
                        onClick={() => updateStatus(order._id, "Completed")}
                      >
                        Complete Order
                      </button>
                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default VendorOrders;