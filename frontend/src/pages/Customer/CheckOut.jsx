import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../../slices/cart-slice";
import { placeOrder } from "../../slices/order-slice";
import axios from "../../config/axios";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.cart);
  const { profile } = useSelector((state) => state.customer);
  const { loading } = useSelector((state) => state.order);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, []);

  if (!cart || cart.items.length === 0) {
    return (
      <h3 style={{ textAlign: "center", marginTop: "40px" }}>
        Cart is empty
      </h3>
    );
  }

  // Delivery Fee Logic
  const deliveryFee = cart.subtotal >= 200 ? 0 : 25;
  const total = cart.subtotal + deliveryFee;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "cod") {
      const resultAction = await dispatch(placeOrder({ paymentMethod: "cod", paymentInfo: null }));

      if (placeOrder.fulfilled.match(resultAction)) {
        alert("Order placed successfully ✅");
        navigate("/customer/profile?tab=orders");
      } else {
        alert("Order failed ❌");
      }
      return;
    }

    // Online payment (UPI / Razorpay)
    try {
      setPayLoading(true);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment SDK. Try again.");
        setPayLoading(false);
        return;
      }

      const createRes = await axios.post('/payments/createOrder', { amount: total, currency: 'INR' }, { headers: { Authorization: localStorage.getItem('token') } });
      if (!createRes.data || !createRes.data.order) {
        alert('Failed to create payment order');
        setPayLoading(false);
        return;
      }

      const { order, key } = createRes.data;

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Local Shop",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('/payments/verify', response);
            if (verifyRes.data && verifyRes.data.success) {
              // On successful verification, place the order in app DB
              const resultAction = await dispatch(placeOrder({ paymentMethod: 'online', paymentInfo: response }));
              if (placeOrder.fulfilled.match(resultAction)) {
                alert('Payment successful and order placed ✅');
                navigate('/customer/profile?tab=orders');
              } else {
                alert('Payment successful but order placement failed');
              }
            } else {
              alert('Payment verification failed');
            }
          } catch (err) {
            console.error('verify error', err);
            alert('Payment verification error');
          }
          setPayLoading(false);
        },
        prefill: {
          name: profile?.name || '',
          contact: profile?.phone || '',
        },
        theme: { color: '#ff4fa3' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('payment error', err);
      alert('Payment failed. Try again.');
      setPayLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "left" }}>Checkout</h2>

      {/* DELIVERY ADDRESS */}
      <div style={styles.box}>
        <h4>Delivering to:</h4>
        <p><strong>{profile?.name}</strong></p>
        <p>{profile?.address}</p>
        <p>Phone: {profile?.phone}</p>
      </div>

      {/* ITEMS */}
      <div style={styles.box}>
        {cart.items.map((item) => (
          <div key={item.productId?._id} style={styles.row}>
            <span>
              {item.productId?.name} × {item.quantity}
            </span>
            <span>₹{item.itemTotal}</span>
          </div>
        ))}

        <hr />

        <div style={styles.row}>
          <span>Subtotal:</span>
          <span>₹{cart.subtotal}</span>
        </div>

        <div style={styles.row}>
          <span>Delivery:</span>
          <span>
            {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
          </span>
        </div>

        <hr />

        <div style={styles.rowTotal}>
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* PAYMENT OPTIONS */}
      <div style={styles.box}>
        <h4>Select Payment Method</h4>

        <div style={styles.radioRow}>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label>Cash on Delivery</label>
        </div>

        <div style={styles.radioRow}>
          <input
            type="radio"
            value="online"
            checked={paymentMethod === "online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label>UPI / Online</label>
        </div>
      </div>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={styles.backBtn} onClick={() => navigate("/cart")}>
          Back
        </button>

        <button style={styles.placeBtn} onClick={handlePlaceOrder} disabled={loading}>
            {loading ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;

const styles = {
  container: {
    width: "500px",
    margin: "30px auto",
  },
  box: {
    background: "white",
    padding: "18px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  rowTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: "18px",
  },
  radioRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  placeBtn: {
    flex: 1,
    padding: "12px",
    background: "#ff4fa3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  backBtn: {
    flex: 1,
    padding: "12px",
    background: "#eee",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
