import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import vemdorImages from "../utils/vendorImages";
import vendorImages from "../utils/vendorImages";
 
function ItemsPage() {
  const { vendorId } = useParams();
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [vendor, setVendor] = useState(null);
  const bannerSrc = vendorImages[vendorId] || "/images/food-placeholder.png";

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
    const fetchItems = async () => {
      const res = await API.get(`/items/${vendorId}`);
      setItems(res.data);
    };
    fetchItems();
    const fetchVendor = async () => {
      try{
        const res = await API.get(`/vendors/${vendorId}`);
        setVendor(res.data);
      } catch (err) {
        console.log("Failed to load vendor");
      }
    };
    fetchVendor();
  }, [location.state, vendorId]);

  const categories = [
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ];

  const filteredItems =
    selectedCategory
      ? items.filter((item) => item.category === selectedCategory)
      : items;

  const categoryImages = {
    "Quick Bites": "/images/categories/quickbites.png",
    "Sandwiches": "/images/categories/sandwiches.png",
    "Fries": "/images/categories/fries.png",
    "Chaat": "/images/categories/chaat.png",
    "Rice Items": "/images/categories/rice.png",
    "Beverages": "/images/categories/beverages.png",
  };

  const vendorBanners = {
    V002: "/images/banners/hotbreads-banner.png",
    V003: "/images/banners/quench-banner.png",
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
            padding: "0 16px",
            fontWeight: "600",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <div
            style={{ width: "40px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          >
            ←
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            CampusCrave
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              minWidth: "90px",
              justifyContent: "flex-end"
            }}
          >
            <span onClick={() => navigate("/student")} style={{ cursor: "pointer" }}>
              🏠
            </span>

            <span onClick={() => navigate("/student/cart")} style={{ cursor: "pointer" }}>
              🛒 ({cartCount})
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="app-content">
          <div className="container" style={{ background: "#f7f9fb" }}>

            {/* BANNER */}
            {vendorId !== "V001" &&  (
              <div
                style={{
                  width: "100%",
                  height: "150px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  marginBottom: "20px",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={bannerSrc}
                  alt="Vendor Banner"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {/* CATEGORY VIEW */}
            {vendorId === "V001" && !selectedCategory && (
              <>
                <h2 style={{ marginBottom: "14px" }}>Categories</h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.04)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      style={{
                        borderRadius: "18px",
                        cursor: "pointer",
                        overflow: "hidden",
                        position: "relative",
                        height: "130px",
                        boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
                        transition: "transform 0.25s ease",
                      }}
                    >
                      {/* IMAGE */}
                      <img
                        src={categoryImages[cat]}
                        alt={cat}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />

                      {/* OVERLAY */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.1))",
                        }}
                      />

                      {/* TEXT */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "12px",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        {cat}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ITEM VIEW */}
            {(vendorId !== "V001" || selectedCategory) && (
              <>
                {selectedCategory && (
                  <div
                    onClick={() => setSelectedCategory(null)}
                    style={{
                      cursor: "pointer",
                      color: "#0f9d58",
                      fontWeight: "600",
                      marginBottom: "15px",
                    }}
                  >
                    ← Back to Categories
                  </div>
                )}

                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    onClick={() =>
                      navigate(`/student/item/${item._id}/${vendorId}`, {
                        state: { category: selectedCategory }
                      })
                    }
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    style={{
                      background: "#ffffff",
                      borderRadius: "18px",
                      padding: "16px",
                      marginBottom: "14px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                      cursor: "pointer",
                      transition: "transform 0.15s ease",
                    }}
                  >
                    <h3 style={{ marginBottom: "8px" }}>
                      {item.name}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: "700", color: "#0f9d58" }}>
                        ₹{item.price}
                      </span>

                      <span
                        style={{
                          fontSize: "13px",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          background: item.available
                            ? "rgba(15,157,88,0.1)"
                            : "rgba(255,0,0,0.1)",
                          color: item.available ? "#0f9d58" : "red",
                        }}
                      >
                        {item.available ? "Available" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
  console.log(vendor);
}

export default ItemsPage;