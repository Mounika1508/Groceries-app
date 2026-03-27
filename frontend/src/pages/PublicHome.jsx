import { Link } from "react-router-dom";

export default function PublicHome() {
  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        textAlign: "center",
        background: "#f8fafc",
        fontFamily: "Inter, sans-serif"
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "10px" }}>
        Welcome to LocalMart 🛒
      </h1>

      <p style={{ fontSize: "16px", maxWidth: "450px", color: "#555", marginBottom: "30px" }}>
        Order groceries from nearby shops and get fast delivery to your home.
      </p>

      <Link
        to="/register"
        style={{
          padding: "12px 30px",
          background: "green",
          color: "white",
          fontSize: "16px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        Get Started →
      </Link>

      <p style={{ marginTop: "15px", fontSize: "14px" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "red", fontWeight: "600" }}>
          Login
        </Link>
      </p>
    </div>
  );
}
