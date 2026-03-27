import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyDeliveryOrders } from "../../slices/dboy-slice";

export default function DeliveryHistory() {
  const dispatch = useDispatch();
  const { myOrders } = useSelector((state) => state.deliveryBoy);

  const [viewOrder, setViewOrder] = useState(null);

  // Fetch orders (only delivered)
  useEffect(() => {
    dispatch(getMyDeliveryOrders());
  }, [dispatch]);

  const delivered = myOrders.filter(o => o.status === "delivered");

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Order History</h2>

      {/* ---- ORDER LIST ---- */}
      <div style={styles.list}>
        {delivered.length === 0 ? (
          <p style={{ color: "#64748b" }}>No completed deliveries yet.</p>
        ) : (
          delivered.map((order) => (
            <div
              key={order._id}
              style={styles.card}
              onClick={() => setViewOrder(order)}
            >
              <div>
                <h4 style={styles.orderId}>#{order._id.slice(-6)}</h4>
                <p style={styles.subText}>
                  Delivered on {new Date(order.deliveredAt).toLocaleString()}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={styles.amount}>₹{order.totalAmount}</p>
                <span style={styles.tag}>DELIVERED</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---- MODAL ---- */}
      {viewOrder && (
        <div style={styles.modalOverlay} onClick={() => setViewOrder(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Order #{viewOrder._id.slice(-6)}</h3>

            <h4 style={styles.modalTitle}>Customer</h4>
            <p>{viewOrder.customerId.username}</p>
            <p>{viewOrder.customerId.phone}</p>
            <p>{viewOrder.customerId.address}</p>

            <h4 style={styles.modalTitle}>Items</h4>
            {viewOrder.products.map((item, i) => (
              <p key={i}>• {item.productId.name} × {item.quantity}</p>
            ))}

            <p style={styles.modalAmount}>Total: ₹{viewOrder.totalAmount}</p>

            <button style={styles.closeBtn} onClick={() => setViewOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


const styles = {
  page: {
    padding: "20px",
    fontFamily: "Inter, sans-serif",
    background: "#f7f8fb",
    minHeight: "100vh",
  },

  heading: {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "15px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  card: {
    background: "white",
    padding: "12px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    transition: "0.2s",
  },

  orderId: {
    margin: 0,
    fontWeight: 700,
  },

  subText: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
  },

  amount: {
    margin: 0,
    fontWeight: 700,
    fontSize: "16px",
    color: "#4f46e5",
  },

  tag: {
    fontSize: "12px",
    background: "#d1fae5",
    color: "#059669",
    padding: "4px 8px",
    borderRadius: "6px",
    marginTop: "5px",
    display: "inline-block",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },

  modal: {
    background: "white",
    padding: "20px",
    width: "100%",
    maxWidth: "500px",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    boxShadow: "0 -2px 15px rgba(0,0,0,0.2)",
    animation: "slideUp 0.3s ease",
  },

  modalTitle: {
    marginTop: "15px",
    marginBottom: "5px",
    fontWeight: 700,
  },

  modalAmount: {
    marginTop: "15px",
    fontWeight: 700,
    fontSize: "18px",
  },

  closeBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#4f46e5",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
};