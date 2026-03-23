import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function VendorHistory() {

  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);

  const vendorName = localStorage.getItem("vendorName") || "Vendor";

  const fetchOrders = async () => {

    try {

      const res = await API.get("/orders/vendor");

      const completedOrders = res.data.filter(
        (order) => order.status === "Completed"
      );

      setOrders(completedOrders);

    } catch (err) {
      console.log("Failed loading history");
    }

  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

        {/* TOP BAR */}

        <div
          style={{
            height: "55px",
            background: "linear-gradient(90deg,#0f9d58,#128c7e)",
            color: "white",
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            justifyContent: "space-between",
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

          <span>
            {vendorName} History
          </span>

          <span
            style={{ cursor: "pointer" }}
            onClick={() => window.location.href="/vendor"}
          >
            🏠
          </span>

        </div>


        {/* MAIN AREA */}

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          <Sidebar
            title="CampusCrave"
            isOpen={open}
            setOpen={setOpen}
            items={[
              { label: "Dashboard", path: "/vendor" },
              { label: "Orders", path: "/vendor/orders" },
              { label: "Menu", path: "/vendor/menu" },
              { label: "Order History", path: "/vendor/history" }
            ]}
          />

          <div className="app-content">

            <div
              className="container"
              style={{ background: "#f7f9fb", minHeight: "100%" }}
            >

              <h2 style={{ marginBottom: "18px" }}>
                Completed Orders
              </h2>

              {orders.length === 0 && (
                <p style={{ color: "#777" }}>
                  No completed orders yet
                </p>
              )}

              {orders.map((order) => (

                <div
                  key={order._id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "16px",
                    marginBottom: "12px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.06)"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >

                    <strong>
                      Order #{order.orderId?.slice(-5)}
                    </strong>

                    <span
                      style={{
                        background: "#e8f5e9",
                        color: "#0f9d58",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "12px"
                      }}
                    >
                      Completed
                    </span>

                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#777",
                      marginTop: "4px"
                    }}
                  >
                    {formatDate(order.createdAt)}
                  </div>
                  <div
                    style={{
                        marginTop: "6px",
                        fontSize: "14px",
                        color: "#555"
                    }}
                        >
                     <div>
                        <strong>Student:</strong> {order.studentName || "Student"}
                     </div>

                    
                        </div>

                  <div style={{ marginTop: "10px" }}>

                    {order.items.map((item, index) => (

                      <div
                        key={index}
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

                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      marginTop: "10px",
                      fontWeight: "600",
                      color: "#0f9d58"
                    }}
                  >
                    Total ₹{
                      order.items.reduce(
                        (sum,i)=>sum+i.price*i.quantity,
                        0
                      )
                    }
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

export default VendorHistory;