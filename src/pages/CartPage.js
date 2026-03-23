import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API from "../services/api";

function CartPage() {

  const navigate = useNavigate();
  const { cart, removeFromCart, addToCart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const increase = (item) => {

    addToCart(
      {
        _id: item.itemId,
        name: item.name,
        price: item.price,
        vendorId: item.vendorId,
        vendorName: item.vendorName
      },
      1
    );

  };

  const decrease = (item) => {

    if (item.quantity === 1) {

      removeFromCart(item.itemId);

    } else {

      addToCart(
        {
          _id: item.itemId,
          name: item.name,
          price: item.price,
          vendorId: item.vendorId,
          vendorName: item.vendorName
        },
        -1
      );

    }

  };

  const placeOrder = async () => {

    try {

      if (cart.length === 0) return;

      // group cart items by vendor
      const vendorOrders = {};

      cart.forEach((item) => {

        if (!vendorOrders[item.vendorId]) {
          vendorOrders[item.vendorId] = {
            vendorName: item.vendorName,
            items: []
          };
        }

        vendorOrders[item.vendorId].items.push({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          vendorName: item.vendorName
        });

      });

      // create order per vendor
      for (const vendorId in vendorOrders) {

        await API.post("/orders", {
          vendorId: vendorId,
          items: vendorOrders[vendorId].items
        });

      }

      clearCart();

      navigate("/student/orders");

    } catch (err) {

      console.log("Order failed", err.response?.data || err.message);
      alert("Order failed. Check console.");

    }

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
      style={{ cursor: "pointer", fontSize: "18px" }}
      onClick={() => navigate("/student")}
    >
      🏠
    </span>

    

  </div>

</div>

        {/* Cart Content */}

        <div className="app-content">

          <div className="container" style={{ background: "#f7f9fb" }}>

            <h2 style={{ marginBottom: "16px" }}>
              Your Cart
            </h2>

            {cart.length === 0 && (
              <p style={{ color: "#777" }}>
                Your cart is empty
              </p>
            )}

            {cart.map((item) => (

              <div
                key={item.itemId}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "12px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >

                  <div>

                    <h3 style={{ marginBottom: "4px" }}>
                      {item.name}
                    </h3>

                    <div style={{ color: "#777", fontSize: "14px" }}>
                      ₹{item.price} × {item.quantity}
                    </div>

                    <div
                      style={{
                        marginTop: "4px",
                        fontWeight: "600",
                        color: "#0f9d58",
                      }}
                    >
                      Subtotal: ₹{item.price * item.quantity}
                    </div>

                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >

                    <button
                      onClick={() => decrease(item)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>

                    <span style={{ fontWeight: "600" }}>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increase(item)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>

                  </div>

                </div>

                <div style={{ marginTop: "10px" }}>

                  <button
                    onClick={() => removeFromCart(item.itemId)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Bottom Order Button */}

        {cart.length > 0 && (

          <div
            style={{
              padding: "14px",
              borderTop: "1px solid #eee",
              background: "white",
            }}
          >

            <button
              onClick={placeOrder}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "#0f9d58",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Place Order • ₹{total}
            </button>

          </div>

        )}

      </div>

    </div>

  );

}


export default CartPage;