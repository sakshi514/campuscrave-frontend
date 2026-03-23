import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ items, isOpen, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true});
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(2px)",
            zIndex: 900,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: isOpen ? 0 : "-240px",
          width: "220px",
          height: "100%",
          background: "linear-gradient(180deg, #0f9d58, #128c7e)",
          color: "white",
          padding: "25px 18px",
          boxSizing: "border-box",
          transition: "left 0.3s ease",
          zIndex: 1000,
          borderTopLeftRadius: "22px",
          borderBottomLeftRadius: "22px",
          display: "flex",
          flexDirection: "column",
        }}
      >

        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <img
            src="/logo.png"
            alt="CampusCrave"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "contain",
              marginBottom: "8px",
              borderRadius: "12px",
              background: "white",
              padding: "5px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}
          />

          <div style={{ fontWeight: "700", fontSize: "16px" }}>
            CampusCrave
          </div>
        </div>

        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.2)",
            marginBottom: "15px",
          }}
        />

        {items.map((item) => (
          <div
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setOpen(false);
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.background = "transparent";
              }
            }}
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              marginBottom: "10px",
              cursor: "pointer",
              fontWeight: "500",
              background:
                location.pathname === item.path
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
              transition: "0.2s",
            }}
          >
            {item.label}
          </div>
        ))}

        <div style={{ marginTop: "auto" }}>
          <div
            onClick={logout}
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              cursor: "pointer",
              background: "rgba(255,255,255,0.15)",
              fontWeight: "500",
            }}
          >
            Logout
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;