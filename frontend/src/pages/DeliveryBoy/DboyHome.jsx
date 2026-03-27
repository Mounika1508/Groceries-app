import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeliveryBoyProfile, getMyDeliveryOrders } from "../../slices/dboy-slice";
import { markAsDelivered } from "../../slices/order-slice";
import { useNavigate } from "react-router-dom";

export default function DboyHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dboyProfile, myOrders=[]} = useSelector((state) => state.deliveryBoy);

  const [isOnline, setIsOnline] = useState(
    localStorage.getItem("dboyOnline") === "true"
  );

  const [viewOrder, setViewOrder] = useState(null);

  // Stats (optional demo values)
  // Calculate stats dynamically
const today = new Date().toDateString();

// Orders delivered today
const deliveredToday = myOrders.filter(
  order =>
    order.status === "delivered" &&
    new Date(order.createdAt).toDateString() === today
);

const activeOrders = myOrders.filter(o => o.status !== "delivered");
const earnings = activeOrders.length * 20;

const stats = {
  today: deliveredToday.length,
  completed: myOrders.filter(o => o.status === "delivered").length,
  earnings
};

  useEffect(() => {
    dispatch(fetchDeliveryBoyProfile());
    dispatch(getMyDeliveryOrders());
  }, [dispatch]);

  // Toggle Online / Offline
  const handleToggle = async () => {
    const newState = !isOnline;
    setIsOnline(newState);
    localStorage.setItem("dboyOnline", newState);

    await axios.put(
      "/deliveryboy/toggle",
      { isAvailable: newState },
      { headers: { Authorization: localStorage.getItem("token") } }
    );
  };

  // Mark Delivered
  const markAsDone = async (id) => {
    await dispatch(markAsDelivered(id));
    setViewOrder(null);
    dispatch(getMyDeliveryOrders());
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>Delivery Partner</h2>

        <div style={styles.headerRight}>
          {/* Toggle */}
          <button
            onClick={handleToggle}
            style={{
              ...styles.toggleBtn,
              background: isOnline ? "#22c55e" : "#dc2626",
            }}
          >
            {isOnline ? "🟢 Online" : "🔴 Offline"}
          </button>

          {/* Profile */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
            alt="profile"
            style={styles.profileIcon}
            onClick={() => navigate("/deliveryboy/profile")}
          />
        </div>
      </div>

      {/* OFFLINE BANNER */}
      {!isOnline && (
        <div style={styles.offlineBanner}>
          You are offline — turn online to receive orders.
        </div>
      )}

      {/* STATS ROW */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <p style={styles.statLabel}>Orders Today</p>
          <h3 style={styles.statValue}>{stats.today}</h3>
        </div>

        <div style={styles.statBox}>
          <p style={styles.statLabel}>Completed</p>
          <h3 style={styles.statValue}>{stats.completed}</h3>
        </div>

        <div style={styles.statBox}>
          <p style={styles.statLabel}>Earnings</p>
          <h3 style={styles.statValue}>₹{stats.earnings}</h3>
        </div>
      </div>

      {/* ORDERS LIST */}
      <h3 style={styles.sectionTitle}>Assigned Deliveries</h3>

      <div style={styles.orderList}>
        {activeOrders.length === 0 ? (
          <div style={styles.emptyContainer}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076507.png"
              style={{ width: "120px", opacity: 0.8 }}
            />
            <p style={styles.noOrders}>No active deliveries assigned.</p>
          </div>
        ) : (
          activeOrders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <div>
                <h4 style={styles.orderId}>Order #{order._id.slice(-6)}</h4>
                <p style={styles.cardText}>
                  Customer: <strong>{order.customerId?.username}</strong>
                </p>
                <p style={styles.amount}>₹{order.totalAmount}</p>
                <p style={styles.status}>Status: {order.status}</p>
              </div>

              <button
                style={styles.viewBtn}
                onClick={() => setViewOrder(order)}
              >
                View
              </button>
            </div>
          ))
        )}
      </div>

      {/* VIEW ORDER MODAL */}
      {viewOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Order #{viewOrder._id.slice(-6)}</h3>

            <h4 style={styles.modalHeading}>Customer</h4>
            <p>{viewOrder.customerId?.username}</p>
            <p>{viewOrder.customerId?.phone}</p>
            <p>{viewOrder.customerId?.address}</p>
            <p>{viewOrder.customerId?.city}</p>

            <h4 style={styles.modalHeading}>Items</h4>
            {viewOrder.products.map((p, i) => (
              <p key={i}>• {p.productId?.name} × {p.quantity}</p>
            ))}

            <div style={styles.modalBtnBox}>
              <button
                style={styles.completeBtn}
                onClick={() => markAsDone(viewOrder._id)}
              >
                Mark Delivered
              </button>

              <button
                style={styles.closeBtn}
                onClick={() => setViewOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: "14px",
    background: "#f6f7fb",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  logo: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#1e293b",
  },

  profileIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
  },

  toggleBtn: {
    padding: "8px 18px",
    borderRadius: "20px",
    border: "none",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },

  offlineBanner: {
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "8px",
    color: "#b91c1c",
    marginTop: "12px",
    fontWeight: 600,
    textAlign: "center",
  },

  statsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    gap: "10px",
  },

  statBox: {
    flex: 1,
    background: "white",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  statValue: {
    margin: 0,
    marginTop: "4px",
    fontWeight: 700,
    fontSize: "20px",
    color: "#1e293b",
  },

  sectionTitle: {
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#1e293b",
  },

  orderList: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  emptyContainer: {
    marginTop: "25px",
    textAlign: "center",
  },

  noOrders: {
    color: "#6b7280",
    marginTop: "10px",
    fontSize: "15px",
  },

  orderCard: {
    background: "white",
    padding: "14px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  orderId: { margin: 0, fontWeight: 700 },
  cardText: { margin: "4px 0" },
  amount: { fontWeight: 700, color: "#4f46e5" },
  status: { fontSize: "13px", color: "#64748b" },

  viewBtn: {
    background: "#4f46e5",
    color: "white",
    padding: "9px 14px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    alignSelf: "center",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
  },

  modalHeading: {
    marginTop: "12px",
    fontWeight: 700,
  },

  modalBtnBox: {
    marginTop: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  completeBtn: {
    background: "#16a34a",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },

  closeBtn: {
    background: "#e5e7eb",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
};