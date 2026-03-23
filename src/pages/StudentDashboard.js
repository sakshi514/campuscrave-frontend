import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useCart } from "../context/CartContext";

function StudentDashboard() {

  const [vendors, setVendors] = useState([]);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { cart } = useCart();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const userName = localStorage.getItem("name") || "Student";

  useEffect(() => {
    const fetchVendors = async () => {
      try {

        const res = await API.get("/vendors");
        setVendors(res.data);

      } catch (err) {

        console.log("Error loading vendors");

      }
    };

    fetchVendors();
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
            justifyContent: "space-between",
            padding: "0 18px",
            fontWeight: "600",
            flexShrink: 0
          }}
        >

          {/* MENU BUTTON */}

          <span
            style={{ cursor: "pointer", fontSize: "20px" }}
            onClick={() => setOpen(!open)}
          >
            ☰
          </span>

          <span>CampusCrave</span>

          {/* CART */}

          <span
            onClick={() => navigate("/student/cart")}
            style={{ cursor: "pointer" }}
          >
            🛒 ({cartCount})
          </span>

        </div>


        {/* MAIN AREA */}

        <div style={{ position: "relative", height: "100%" }}>

          {/* SIDEBAR */}

          <Sidebar
            isOpen={open}
            setOpen={setOpen}
            items={[
              { label: "Home", path: "/student" },
              { label: "My Orders", path: "/student/orders" },
              { label: "Order History", path: "/student/history" },
              { label: "Profile", path: "/student/profile" },
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

              {/* WELCOME SECTION */}

              <div style={{ marginBottom: "22px" }}>

                <h2 style={{ marginBottom: "4px" }}>
                  Welcome, {userName} 👋
                </h2>

                <p
                  style={{
                    color: "#777",
                    fontSize: "14px"
                  }}
                >
                  Explore campus vendors and order your favourites
                </p>

              </div>


              {/* VENDOR GRID */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "16px",
                }}
              >

                {vendors.map((vendor) => (

                  <div
                    key={vendor._id}
                    onClick={() =>
                      navigate(`/student/vendor/${vendor.vendorId}`)
                    }
                    style={{
                      background: "#fff",
                      borderRadius: "16px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "transform 0.15s ease",
                    }}
                  >

                    {/* IMAGE */}

                    <div
                      style={{
                        height: "120px",
                        overflow: "hidden",
                        background: "#f2f4f7"
                      }}
                    >

                      <img
                        src={vendor.logo}
                        alt={vendor.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />

                    </div>


                    {/* VENDOR NAME */}

                    <div
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#333",
                      }}
                    >
                      {vendor.name}
                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;