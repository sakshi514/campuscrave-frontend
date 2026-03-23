import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import itemImages from "../utils/itemImages";

function ItemDetailPage() {
  const { itemId, vendorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;

  const { cart, addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await API.get(`/items/${vendorId}`);
      const found = res.data.find((i) => i._id === itemId);
      console.log("item name:", found?.name);
      setItem(found);
    };
    fetchItem();
  }, [itemId, vendorId]);

  const increaseQty = () => setQuantity((q) => q + 1);

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const total = item ? item.price * quantity : 0;

  const handleAddToCart = () => {
    const itemWithVendor = { ...item, vendorId };
    addToCart(itemWithVendor, quantity);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };
  

  if (!item) return <p>Loading...</p>;

  const imageSrc =
    item.image || "/images/food-placeholder.png";
  

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
          }}
        >
          <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
            ←
          </div>

          <div>CampusCrave</div>

          <div onClick={() => navigate("/student/cart")} style={{ cursor: "pointer" }}>
            🛒 ({cartCount})
          </div>
        </div>

        {/* BACK TO ITEMS */}
        <div
          onClick={() => navigate(`/student/vendor/${vendorId}`, {
            state: { category }
          })}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
            color: "#0f9d58",
            fontWeight: "600",
          }}
        >
          ← Back to Items
        </div>

        {/* CONTENT */}
        <div className="app-content">
          <div className="container" style={{ background: "#f7f9fb" }}>

            {/* IMAGE */}
            <div
              style={{
                width: "100%",
                height: "180px",
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "20px",
              }}
            >
              <img
                src={imageSrc}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* ITEM CARD */}
            <div
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "18px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              }}
            >
              <h2>{item.name}</h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontWeight: "700", color: "#0f9d58" }}>
                  ₹{item.price}
                </span>

                <span
                  style={{
                    fontSize: "13px",
                    padding: "4px 10px",
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

              {/* QUANTITY */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "600" }}>Quantity</span>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={decreaseQty}>-</button>
                  <span>{quantity}</span>
                  <button onClick={increaseQty}>+</button>
                </div>
              </div>

              {/* TOTAL */}
              <div style={{ marginTop: "18px", fontWeight: "700" }}>
                Total: ₹{total}
              </div>
            </div>
          </div>
        </div>

        {/* ADD TO CART */}
        <div style={{ padding: "12px", background: "white" }}>
          <button
            disabled={!item.available}
            onClick={handleAddToCart}
            style={{
              width: "100%",
              padding: "14px",
              background: item.available ? "#0f9d58" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: item.available ? "pointer" : "not-allowed",
            }}
          >
            {item.available ? `Add to Cart ₹${total}` : "Not Available"}
          </button>
        </div>

        {/* TOAST */}
        {showToast && (
          <div
            style={{
              position: "fixed",
              bottom: "90px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#0f9d58",
              color: "white",
              padding: "10px 18px",
              borderRadius: "20px",
            }}
          >
            ✔ Added to cart
          </div>
        )}

      </div>
    </div>
  );
}

export default ItemDetailPage;