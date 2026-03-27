import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchCart, updateCartItem } from "../../slices/cart-slice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { profile, loading } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (!profile) return <Navigate to="/customer/createProfile" replace />;

  if (!cart || !cart.items || cart.items.length === 0) {
    return <h3 style={{ textAlign: "center", marginTop: "40px" }}>Your cart is empty.</h3>;
  }

  return (
    <div style={{ width: "50%", margin: "auto", marginTop: "25px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>My Cart</h2>

      {cart.items.map((item) => {
        const product = item.productId;
        const productId = product?._id;         // ALWAYS VALID ID
        const stock = product?.stock || 0;
        const qty = item.quantity;

        return (
          <div
            key={productId}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #eee",
              gap: "15px",
            }}
          >
            {/* IMAGE */}
            {product?.image && (
              <img
                src={product.image}
                alt={product.name}
                width="55"
                height="55"
                style={{ borderRadius: "8px", objectFit: "cover" }}
              />
            )}

            {/* NAME + PRICE */}
            <div style={{ flexGrow: 1 }}>
              <h4 style={{ margin: "0 0 3px 0", fontSize: "14px" }}>{product?.name}</h4>

              <p style={{ margin: 0, fontWeight: "600", fontSize: "13px" }}>₹{product?.price}</p>

              {/* STOCK INFO */}
              {stock === 0 ? (
                <p style={{ color: "red", fontSize: "12px", marginTop: "3px" }}>Out of stock</p>
              ) : qty >= stock ? (
                <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "3px" }}>
                  Only {stock} left
                </p>
              ) : null}
            </div>

            {/* QUANTITY CONTROLS */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#f3f4f6",
                borderRadius: "18px",
                height: "30px",
                overflow: "hidden",
              }}
            >
              {/* MINUS */}
              <button
                onClick={() =>
                  dispatch(updateCartItem({ productId: item.productId._id, quantity: qty - 1 }))
                }
                style={{
                  width: "30px",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                –
              </button>

              {/* QTY DISPLAY */}
              <div
                style={{
                  width: "30px",
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {qty}
              </div>

              {/* PLUS */}
              <button
                onClick={() =>
                  dispatch(updateCartItem({ productId: item.productId._id, quantity: qty + 1 }))
                }
                disabled={qty >= stock || stock === 0}
                style={{
                  width: "30px",
                  border: "none",
                  outline: "none",
                  background: qty >= stock ? "#e5e7eb" : "#0f9d58",
                  color: qty >= stock ? "#9ca3af" : "#fff",
                  fontSize: "16px",
                  cursor: qty >= stock ? "not-allowed" : "pointer",
                }}
              >
                +
              </button>
            </div>

            {/* ITEM TOTAL */}
            <strong style={{ fontSize: "14px" }}>₹{item.itemTotal}</strong>
          </div>
        );
      })}

      {/* SUBTOTAL */}
      <h3 style={{ textAlign: "right", marginTop: "20px" }}>Subtotal: ₹{cart.subtotal}</h3>

      {/* CHECKOUT */}
      <button
        onClick={() => navigate("/checkout")}
        disabled={cart.items.some((i) => i.productId?.stock === 0)}
        style={{
          width: "100%",
          padding: "12px",
          background: "#0f9d58",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "10px",
        }}
      >
        Checkout
      </button>
    </div>
  );
};

export default Cart;