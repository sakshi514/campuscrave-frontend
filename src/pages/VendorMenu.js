import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function VendorMenu() {

  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  const vendorId = localStorage.getItem("vendorId");
  const vendorName = localStorage.getItem("vendorName") || "Vendor";

  const fetchMenu = async () => {
    try {

      const res = await API.get(`/items/${vendorId}`);
      setItems(res.data);

    } catch (err) {
      console.log("Failed to load menu");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const toggleAvailability = async (item) => {
    try {

      await API.put(`/items/${itemId}/toggle`, {
        available: !item.available
      });
      fetchMenu();

    } catch (err) {
      console.log("Toggle failed");
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setNewPrice(item.price);
  };

  const updatePrice = async () => {

    try {

      await API.put(`/items/${editingItem._id}/price`, {
        price: Number(newPrice)
      });

      setEditingItem(null);

      fetchMenu();

    } catch (err) {
      console.log("Price update failed");
    }

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

          <span>{vendorName} Menu</span>

          <span
            style={{ cursor: "pointer" }}
            onClick={() => window.location.href = "/vendor"}
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
              { label: "History", path: "/vendor/history" }
            ]}
          />

          <div className="app-content">

            <div
              className="container"
              style={{
                background: "#f7f9fb",
                minHeight: "100%"
              }}
            >

              <h2 style={{ marginBottom: "18px" }}>
                Menu Items
              </h2>

              {items.map((item) => (

                <div
                  key={item._id}
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
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >

                    <div>

                      <strong>{item.name}</strong>

                      <div
                        style={{
                          fontSize: "14px",
                          color: "#777"
                        }}
                      >
                        ₹{item.price}
                      </div>

                      {!item.available && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                          Unavailable
                        </div>
                      )}

                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>

                      <button
                        onClick={() => openEditModal(item)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          cursor: "pointer"
                        }}
                      >
                        Edit Price
                      </button>

                      <button
                        onClick={() => toggleAvailability(item)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "none",
                          background: item.available ? "#ff4d4d" : "#0f9d58",
                          color: "white",
                          cursor: "pointer"
                        }}
                      >
                        {item.available ? "Disable" : "Enable"}
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

      {/* SLIDE UP PRICE EDITOR */}

      {editingItem && (

  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}
  >

    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        width: "320px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}
    >

      <h3 style={{ marginBottom: "15px" }}>
        Edit Price
      </h3>

      <input
        type="number"
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "18px"
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px"
        }}
      >

        <button
          onClick={() => setEditingItem(null)}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>

        <button
          onClick={updatePrice}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#0f9d58",
            color: "white",
            cursor: "pointer"
          }}
        >
          Update
        </button>

      </div>

    </div>

  </div>

)}

    </div>
  );
}

export default VendorMenu;