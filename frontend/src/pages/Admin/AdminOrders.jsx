import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../slices/admin-slice";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { allOrders = [], loading } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const filteredOrders = allOrders.filter((o) => {
    const text = search.toLowerCase();
    return (
      o._id.toLowerCase().includes(text) ||
      o.customerId?.username?.toLowerCase().includes(text) ||
      o.vendorId?.shopName?.toLowerCase().includes(text) ||
      o.status?.toLowerCase().includes(text)
    );
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Orders Management</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by customer, vendor, or status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {loading ? (
        <p style={styles.loading}>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p style={styles.noData}>No orders found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Vendor</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} style={styles.tr}>
                <td style={styles.td}>#{order._id.slice(-6)}</td>

                <td style={styles.td}>
                  <strong>{order.customerId?.username}</strong>
                  <br />
                  <span style={styles.subText}>{order.customerId?.phone}</span>
                </td>

                <td style={styles.td}>
                  <strong>{order.vendorId?.shopName}</strong>
                  <br />
                  <span style={styles.subText}>{order.vendorId?.city}</span>
                </td>

                <td style={styles.td}>₹{order.totalAmount}</td>

                <td style={styles.statusCell}>
                  <span style={styles.status(order.status)}>{order.status}</span>
                </td>

                <td style={styles.td}>
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ====================
    PROFESSIONAL STYLES
==================== */

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#1f2937",
  },

  search: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    width: "350px",
    fontSize: "15px",
    marginBottom: "20px",
    outline: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "0.2s",
  },

  loading: {
    padding: "20px",
    color: "#555",
    fontSize: "18px",
  },

  noData: {
    padding: "20px",
    fontSize: "18px",
    color: "#777",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  th: {
    background: "#eef2ff",
    padding: "14px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
    borderBottom: "2px solid #e5e7eb",
    color: "#374151",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#374151",
    verticalAlign: "middle"
  },

  tr: {
    transition: "0.2s",
  },

  subText: {
    fontSize: "12px",
    color: "#6b7280",
  },

  status: (value) => ({
  padding: "3px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "600",
  display: "inline-block",
  textTransform: "capitalize",
  backgroundColor:
    value === "delivered"
      ? "rgba(22,163,74,0.12)"
      : value === "cancelled"
      ? "rgba(239,68,68,0.12)"
      : value === "on-the-way"
      ? "rgba(14,165,233,0.12)"
      : value === "packing"
      ? "rgba(234,179,8,0.12)"
      : "rgba(107,114,128,0.12)", // placed default
  color:
    value === "delivered"
      ? "#16a34a"
      : value === "cancelled"
      ? "#ef4444"
      : value === "on-the-way"
      ? "#0ea5e9"
      : value === "packing"
      ? "#eab308"
      : "#6b7280",
  border: "none",
  outline: "none",
  boxShadow: "none",
}),
};