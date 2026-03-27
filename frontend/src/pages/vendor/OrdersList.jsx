import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getVendorOrders,
  startPacking,
  assignDeliveryBoy,
} from "../../slices/order-slice";

import { getDeliveryBoys } from "../../slices/dboy-slice";

const VendorOrders = () => {
  const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.order);
  const { deliveryBoys } = useSelector((state) => state.deliveryBoy);

  const [modalOrder, setModalOrder] = useState(null);
  const [selectedBoy, setSelectedBoy] = useState("");

  useEffect(() => {
    dispatch(getVendorOrders());
    dispatch(getDeliveryBoys());
  }, [dispatch]);

  // Start Packing — DO NOT CLOSE MODAL
  const handleStartPacking = async (order) => {
    await dispatch(startPacking(order._id));

    // Update modal order status without closing modal
    setModalOrder({
      ...order,
      status: "packing",
    });

    dispatch(getVendorOrders());
  };

  // Assign Delivery Boy
  const handleAssign = async (order) => {
    await dispatch(
      assignDeliveryBoy({
        orderId: order._id,
        deliveryBoyId: selectedBoy,
      })
    );

    setModalOrder({
      ...order,
      status: "on-the-way",
    });

    dispatch(getVendorOrders());
  };

  const statusStyles = {
    placed: { background: "#e0f2fe", color: "#0369a1" },         // Blue
    packing: { background: "#fff7ed", color: "#c2410c" },         // Orange
    "on-the-way": { background: "#ede9fe", color: "#5b21b6" },    // Purple
    delivered: { background: "#dcfce7", color: "#166534" },       // Green
    cancelled: { background: "#fee2e2", color: "#b91c1c" },       // Red
  };

  const getPaymentStatus = (order) => {
    if (order.paymentMethod === "cod") return "Cash on Delivery";
    if (order.paymentInfo) return "Paid Online";
    return "Online Payment";
  };

  return (
    <div className="orders-page">
      <style>{`
        .orders-page {
          padding: 30px;
          background: #f8f9fd;
          min-height: 100vh;
        }

        .title {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .order-card {
          background: #fff;
          padding: 15px 18px;
          border-radius: 12px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.05);
        }

        .order-left {
          font-weight: 600;
          font-size: 14px;
        }

        .order-status {
          text-transform: capitalize;
          font-weight: 600;
          color: #555;
        }

        .view-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          top:0; left:0;
          width:100%;
          height:100%;
          background: rgba(0,0,0,0.5);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index: 1000;
        }

        .modal-box {
          width: 400px;
          background:white;
          padding:25px;
          border-radius:18px;
          box-shadow:0 6px 20px rgba(0,0,0,0.2);
          animation: pop .2s ease-out;
        }

        @keyframes pop {
          from { transform: scale(0.95); opacity:0 }
          to { transform: scale(1); opacity:1 }
        }

        .modal-title {
          font-size:20px;
          font-weight:700;
          margin-bottom:15px;
        }

        .modal-section {
          margin-bottom:12px;
          font-size:15px;
        }

        .btn-primary {
          width:100%;
          padding:12px;
          background:#4f46e5;
          border:none;
          border-radius:10px;
          color:white;
          cursor:pointer;
          font-size:15px;
          font-weight:600;
          margin-top:10px;
        }

        .btn-secondary {
          width:100%;
          padding:12px;
          background: #e5e7eb;
          border:none;
          border-radius:10px;
          cursor:pointer;
          font-size:15px;
          margin-top:10px;
          font-weight:600;
        }

        .select-box {
          width:100%;
          padding:10px;
          border-radius:8px;
          border:1px solid #ccc;
          margin-top:8px;
        }
      `}</style>

      <h2 className="title">Vendor Orders</h2>

      {/* LIST OF ORDERS */}
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-left">
            #{order._id.slice(-6)} • ₹{order.totalAmount}
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              fontWeight: 600,
              textTransform: "capitalize",
              fontSize: "13px",
              ...statusStyles[order.status.toLowerCase()],
            }}
          >
            {order.status.replace("-", " ")}
          </div>

          <button className="view-btn" onClick={() => {
            setModalOrder(order);
            setSelectedBoy("");
          }}>
            View
          </button>
        </div>
      ))}
      {modalOrder && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">
              Order #{modalOrder._id.slice(-6)}
            </h3>

            <div className="modal-section">
              <strong>Items:</strong>
              <div style={{ marginTop: 6 }}>
                {modalOrder.products?.map((p) => (
                  <div
                    key={p._id}
                    style={{
                      background: "#f5f5f7",
                      padding: "8px",
                      borderRadius: "8px",
                      marginBottom: "5px",
                    }}
                  >
                    {p.productId?.name} × {p.quantity}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <strong>Total:</strong> ₹{modalOrder.totalAmount}
            </div>

            <div className="modal-section">
              <strong>Payment:</strong>{" "}
              {modalOrder.paymentMethod === "cod" ? (
                <span style={{ color: "#b45309", fontWeight: 600 }}>
                  Cash on Delivery
                </span>
              ) : (
                <span style={{ color: "#16a34a", fontWeight: 600 }}>
                  Paid Online
                </span>
              )}
            </div>

            {modalOrder.paymentInfo?.razorpay_payment_id && (
              <div className="modal-section">
                <strong>Payment ID:</strong>{" "}
                {modalOrder.paymentInfo.razorpay_payment_id}
              </div>
            )}

            <div className="modal-section">
              <strong>Status:</strong> {modalOrder.status}
            </div>

            {/* ================= ACTIONS ================= */}

            {/* START PACKING */}
            {modalOrder.status === "placed" && (
              <button
                className="btn-primary"
                onClick={() => handleStartPacking(modalOrder)}
              >
                Start Packing
              </button>
            )}

            {/* DELIVERY BOY SELECTION */}
            {modalOrder.status === "packing" && (
              <>
                <select
                  className="select-box"
                  value={selectedBoy}
                  onChange={(e) => setSelectedBoy(e.target.value)}
                >
                  <option value="">Select Delivery Boy</option>
                  {deliveryBoys
                    .filter((d) => d.isAvailable)
                    .map((boy) => (
                      <option value={boy._id} key={boy._id}>
                        {boy.userId?.username}
                      </option>
                    ))}
                </select>

                <button
                  className="btn-primary"
                  disabled={!selectedBoy}
                  onClick={() => handleAssign(modalOrder)}
                >
                  Assign Delivery Boy
                </button>
              </>
            )}

            {modalOrder.status === "on-the-way" && (
              <div style={{ fontWeight: "600", marginTop: "10px" }}>
                Delivery Assigned ✔
              </div>
            )}

            <button
              className="btn-secondary"
              onClick={() => setModalOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;