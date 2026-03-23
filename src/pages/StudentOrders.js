import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import socket from "../socket";
import toast from "react-hot-toast";

function StudentOrders() {

  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);


 useEffect(() => {
  if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/student");

      // only active orders
      setOrders(res.data.filter(order => order.isActive));

    } catch (err) {
      console.log("Failed to load orders");
    }
  };

  fetchOrders();

  // 🔥 LISTEN FOR STATUS UPDATES
  socket.on("orderUpdated", (data) => {
    const currentUserId = localStorage.getItem("userId");

    console.log("backend userId:", data.userId);
    console.log("frontend:", currentUserId);
    console.log("current user:", localStorage.getItem("userId"));

    if(String(data.userId) !== String(currentUserId)) return;

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === data.orderId
          ? {
              ...order,
              status: data.status,
              isActive: data.status === "Completed" ? false : true
            }
          : order
      ).filter(order => order.isActive) // remove completed automatically
    );

    toast.success(`🍽️ Order #${data.orderId} is now ${data.status}`);

    if (Notification.permission === "granted") {
      new Notification("CampusCrave", {
        body: `Your order is ${data.status}`,
        icon: "/logo192.png",
      });
    }

  });

  // 🔥 CLEANUP
  return () => {
    socket.off("orderUpdated");
  };

}, []);

    

  const shortOrderId = (id) => {
    return "#" + id.slice(-5);
  };


  const formatDate = (date) => {

    const d = new Date(date);

    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  };


  // 🎨 Status Colors
  const statusStyle = (status) => {

    if (status === "Pending") {
      return {
        background: "#fff3cd",
        color: "#856404"
      };
    }

    if (status === "In Process") {
      return {
        background: "#e3f2fd",
        color: "#1565c0"
      };
    }

    if (status === "Ready") {
      return {
        background: "#e8f5e9",
        color: "#2e7d32"
      };
    }

    if (status === "Completed") {
      return {
        background: "#d1fae5",
        color: "#065f46"
      };
    }

    return {
      background: "#f1f1f1",
      color: "#333"
    };

  };


  return (

    <div className="app-wrapper">

      <div className="app-container">

        {/* Top Bar */}
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
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  }}
>

  {/* Left - Back */}
  <div
    style={{ width: "40px", cursor: "pointer" }}
    onClick={() => navigate(-1)}
  >
    ← 
  </div>

  {/* Center - Title */}
  <div
    style={{
      fontSize: "16px",
      fontWeight: "600",
      textAlign: "center",
      flex: 1
    }}
  >
    My Orders
  </div>

  {/* Right - Icons */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
      minWidth: "90px",
      justifyContent: "flex-end"
    }}
  >


    <span
      style={{ cursor: "pointer", whiteSpace: "nowrap" }}
      onClick={() => navigate("/student/cart")}
    >
      🛒 ({cartCount})
    </span>

  </div>

</div>

        <div className="app-content">

          <div
            className="container"
            style={{
              background: "#f7f9fb",
              minHeight: "100%"
            }}
          >

            {orders.length === 0 && (
              <p style={{ color: "#777" }}>No orders yet</p>
            )}


            {orders.map((order) => (

              <div
                key={order._id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "14px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)"
                }}
              >

                {/* Header */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px"
                  }}
                >

                  <div>

                    <strong>
                      Order {shortOrderId(order.orderId)}
                    </strong>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "#777"
                      }}
                    >
                      {formatDate(order.createdAt)}
                    </div>

                  </div>

                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: "600",
                      ...statusStyle(order.status)
                    }}
                  >
                    {order.status}
                  </div>

                </div>


                {/* Vendor */}

                <div
                  style={{
                    fontSize: "13px",
                    color: "#555",
                    marginBottom: "8px"
                  }}
                >
                  Vendor: {order.vendorName || "Vendor"}
                </div>


                {/* Items */}

                {order.items.map((item, index) => (

                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px",
                      marginBottom: "4px"
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


                {/* Total */}

                <div
                  style={{
                    marginTop: "8px",
                    fontWeight: "600",
                    color: "#0f9d58",
                    textAlign: "right"
                  }}
                >
                  Total ₹{order.totalAmount}
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}

export default StudentOrders;