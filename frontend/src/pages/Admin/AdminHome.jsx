import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiShoppingBag, FiClock, FiPackage } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingVendors,
  fetchAllUsers,
  fetchAllVendors,
  fetchAllOrders
} from "../../slices/admin-slice";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    pendingVendors = [],
    allUsers = [],
    allVendors = [],
    allOrders = [],
    loading,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) return;
    dispatch(fetchPendingVendors());
    dispatch(fetchAllUsers());
    dispatch(fetchAllVendors());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  if (loading)
    return (
      <h2 style={{ padding: "30px", fontSize: "20px", color: "#555" }}>
        Loading dashboard...
      </h2>
    );

  return (
    <div style={styles.container}>

      {/* Title */}
      <h1 style={styles.title}>Admin Dashboard</h1>

      {/* Stats Cards */}
      <div style={styles.grid}>
        
        {/* USERS */}
        <div style={{ ...styles.card, borderLeft: "6px solid #4f46e5" }}
        onClick={()=> navigate("/admin/users")}>
          <div style={styles.cardHeader}>
            <div style={styles.iconBox}>
              <FiUsers size={26} color="#4f46e5" />
            </div>
            <p style={styles.cardLabel}>Total Users</p>
          </div>
          <p style={styles.cardValue}>{allUsers.length}</p>
        </div>

        {/* VENDORS */}
        <div style={{ ...styles.card, borderLeft: "6px solid #0ea5e9" }}
        onClick={()=> navigate("/admin/vendorsList")}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.iconBox, backgroundColor: "#e0f7ff" }}>
              <FiShoppingBag size={26} color="#0ea5e9" />
            </div>
            <p style={styles.cardLabel}>Total Vendors</p>
          </div>
          <p style={styles.cardValue}>{allVendors.length}</p>
        </div>

        {/* PENDING VENDORS */}
        <div style={{ ...styles.card, borderLeft: "6px solid #f59e0b" }}
        onClick={()=> navigate("/admin/approveVendors")}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.iconBox, backgroundColor: "#fff4d6" }}>
              <FiClock size={26} color="#f59e0b" />
            </div>
            <p style={styles.cardLabel}>Pending Vendor Approvals</p>
          </div>
          <p style={styles.cardValue}>{pendingVendors.length}</p>
        </div>

        {/* TOTAL ORDERS */}
        <div style={{ ...styles.card, borderLeft: "6px solid #10b981" }}
        onClick={()=> navigate("/admin/orders")}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.iconBox, backgroundColor: "#d9ffee" }}>
              <FiPackage size={26} color="#10b981" />
            </div>
            <p style={styles.cardLabel}>Total Orders</p>
          </div>
          <p style={styles.cardValue}>{allOrders.length}</p>
        </div>

      </div>

      {/* Recent Orders Section */}
      {/* Recent Orders Section */}
<div style={styles.ordersBox}>
  <h2 style={styles.recentTitle}>Recent Orders</h2>

  {allOrders.length === 0 ? (
    <p style={{ padding: "10px 0", color: "#555" }}>No orders found.</p>
  ) : (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Order ID</th>
          <th style={styles.th}>Customer</th>
          <th style={styles.th}>Vendor</th>
          <th style={styles.th}>Amount</th>
          <th style={styles.th}>Status</th>
        </tr>
      </thead>

      <tbody>
        {allOrders.slice(0, 5).map((order) => (
          <tr key={order._id} style={styles.tr}>
            {/* Only last 6 characters */}
            <td style={styles.td}>#{order._id.slice(-6)}</td>

            <td style={styles.td}>{order.customerId?.username}</td>

            <td style={styles.td}>{order.vendorId?.shopName}</td>

            <td style={styles.td}>₹{order.totalAmount}</td>

            {/* Same status style as Admin Orders Page */}
            <td style={styles.statusCell}>
              <span style={styles.status(order.status)}>
                {order.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

    </div>
  );
}

/* ===========================
    PROFESSIONAL STYLES
=========================== */
const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "25px",
    color: "#1f2937",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    transition: "0.3s",
    cursor: "pointer",
  },

  cardLabel: {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
  },

  cardValue: {
    fontSize: "34px",
    fontWeight: "700",
    marginTop: "10px",
    color: "#111827",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  iconBox: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    backgroundColor: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Recent Orders Styles */
  ordersBox: {
    marginTop: "40px",
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  recentTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "15px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    background: "#f3f4f6",
    fontWeight: "600",
    fontSize: "14px",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#374151",
  },

  tr: {
    transition: "0.2s",
  },

  statusCell: {
  textAlign: "center",
  verticalAlign: "middle",
  width: "120px",
},

status: (value) => ({
  fontWeight: "700",
  fontSize: "14px",
  textTransform: "capitalize",
  color:
    value === "delivered"
      ? "#0D8A27"   // green
      : value === "cancelled"
      ? "#D0342C"   // red
      : value === "on-the-way"
      ? "#6D28D9"   // purple
      : value === "packing"
      ? "#EA580C"   // orange
      : "#2563EB",  // placed = blue
}),
};