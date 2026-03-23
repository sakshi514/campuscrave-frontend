import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function StudentHistory() {

  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const res = await API.get("/orders/student");

        const historyOrders = res.data.filter(
          order => !order.isActive
        );

        setOrders(historyOrders);

      } catch (err) {

        console.log("Failed to load order history");

      }

    };

    fetchOrders();

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
    CampusCrave
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
            style={{ background: "#f7f9fb" }}
          >

            <h2 style={{ marginBottom: "16px" }}>
              Order History
            </h2>

            {orders.length === 0 && (
              <p>No past orders</p>
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

                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "13px"
                  }}
                >
                  Vendor: {order.vendorName}
                </div>

                {order.items.map((item, i) => (

                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px"
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

                <div
                  style={{
                    marginTop: "8px",
                    textAlign: "right",
                    fontWeight: "600",
                    color: "#0f9d58"
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

export default StudentHistory;