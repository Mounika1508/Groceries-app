import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchPublicCategories } from "../../slices/category-slice";
import { fetchPublicProducts } from "../../slices/product-slice";
import { addToCart, updateCartItem, fetchCart, clearCart } from "../../slices/cart-slice";
import { getVendorById } from "../../slices/vendor-slice";

const ShopPage = () => {
  const { vendorId } = useParams();
  const dispatch = useDispatch();

  const { publicCategories } = useSelector((state) => state.category);
  const { publicProducts } = useSelector((state) => state.product);
  const { cart } = useSelector((state) => state.cart);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const { error } = useSelector((state) => state.cart);

  const [showVendorPopup, setShowVendorPopup] = useState(false);
  const [pendingProductId, setPendingProductId] = useState(null);


  useEffect(() => {
    dispatch(fetchPublicCategories(vendorId));
    dispatch(fetchPublicProducts());
    dispatch(fetchCart());
    // dispatch(getVendorById(vendorId));

    window.scrollTo(0, 0);
  }, [vendorId]);

  useEffect(() => {
    if (publicCategories.length > 0) {
      setSelectedCategory(publicCategories[0]._id);
    }
  }, [publicCategories]);

  const filteredProducts = publicProducts.filter(
    (p) => p.categoryId?._id === selectedCategory
  );

  // Get quantity of each product in cart
  const getQty = (id) => {
    const item = cart?.items?.find((i) => i.productId?._id === id);
    return item ? item.quantity : 0;
  };

  const handleIncrease = async (id, qty) => {
  const product = publicProducts.find(p => p._id === id);
  if (!product) return;
  if (product.stock === 0) {
    alert("Product is out of stock");
    return;
  }
  if (qty >= product.stock) {
    alert(`Only ${product.stock} item(s) available`);
    return;
  }
  if (qty === 0) {
    try {
      await dispatch(addToCart({ productId: id })).unwrap();
    } catch (err) {
      console.log(err);

      if (err === "Cannot mix vendor products") {
        setPendingProductId(id);
        setShowVendorPopup(true);
      }
    }
  } else {
    await dispatch(updateCartItem({
      productId: id,
      quantity: qty + 1
    }));
  }
};


  const handleDecrease = (id, qty) => {
    if (qty > 1) {
      dispatch(updateCartItem({ productId: id, quantity: qty - 1 }));
    } else if (qty === 1) {
      dispatch(updateCartItem({ productId: id, quantity: 0 }));
    }
  };

  return (
  <>
    <div
      style={{
        display: "flex",
        padding: "18px",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* LEFT - CATEGORIES */}
      <div
        style={{
          width: "170px",
          paddingRight: "15px",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        <h4
          style={{
            fontSize: "14px",
            fontWeight: 600,
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          Categories
        </h4>

        {publicCategories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            style={{
              padding: "7px 8px",
              marginBottom: "8px",
              borderRadius: "6px",
              fontSize: "15px",
              cursor: "pointer",
              background:
                selectedCategory === cat._id ? "#0f9d58" : "#ffffff",
              color:
                selectedCategory === cat._id ? "#ffffff" : "#374151",
              border: "1px solid #e5e7eb",
              textAlign: "center",
              fontWeight: 500,
              transition: "0.2s",
            }}
          >
            <b>{cat.name}</b>
          </div>
        ))}
      </div>

      {/* RIGHT - PRODUCTS */}
      <div style={{ flex: 1, paddingLeft: "20px" }}>
        <h4
          style={{
            fontSize: "14px",
            fontWeight: 600,
            marginBottom: "12px",
            color: "#111827",
          }}
        >
          Products
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(130px, 1fr))",
            gap: "12px",
          }}
        >
          {filteredProducts.map((prod) => {
            const qty = getQty(prod._id);

            return (
              <div
  key={prod._id}
  style={{
    background: "#ffffff",
    borderRadius: "10px",
    padding: "10px",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: "4px",
    padding: "8px",
    transition: "all 0.25s ease",
    cursor: "pointer",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(0,0,0,0.08)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0px)";
    e.currentTarget.style.boxShadow =
      "0 1px 3px rgba(0,0,0,0.05)";
  }}
>
  <div
    style={{
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "4px",
    }}
  >
    {prod.image ? (
      <img
        src={prod.image}
        alt={prod.name}
        style={{
          maxHeight: "65px",
          maxWidth: "65px",
          objectFit: "contain",
        }}
      />
    ) : (
      <div
        style={{
          width: "65px",
          height: "65px",
          background: "#f3f4f6",
          borderRadius: "6px",
        }}
      />
    )}
  </div>
  {/* PRODUCT NAME */}
  <div
    style={{
      fontSize: "13px",
      fontWeight: 500,
      color: "#111827",
      textAlign: "center",
      marginBottom: "4px",
      minHeight: "32px",
    }}
  >
    {prod.name}
  </div>

  <div
    style={{
      fontSize: "13px",
      fontWeight: 500,
      color: "#111827",
      textAlign: "center",
      marginBottom: "6px",
    }}
  >
    {prod.netQnty}

  </div>

  {/* PRICE */}
  <div
    style={{
      fontSize: "12px",
      fontWeight: 600,
      color: "#0f9d58",
      textAlign: "center",
      marginBottom: "8px",
    }}
  >
    ₹{prod.price}
  </div>

  {prod.stock === 0 ? (
    <div
    style={{
      textAlign: "center",
      fontSize: "12px",
      fontWeight: 600,
      color: "#ef4444",
      padding: "6px 0",
      background: "#fee2e2",
      borderRadius: "18px",
    }}
  >
    SOLD OUT
  </div>
  ) : qty === 0 ? (
    <button
      onClick={() => handleIncrease(prod._id, qty)}
      style={{
        borderRadius: "18px",
        border: "1px solid #0f9d58",
        background: "#ffffff",
        color: "#0f9d58",
        fontSize: "12px",
        padding: "5px 0",
        cursor: "pointer",
        fontWeight: 600,
        transition: "0.2s",
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "#0f9d58";
        e.target.style.color = "#ffffff";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "#ffffff";
        e.target.style.color = "#0f9d58";
      }}
    >
      ADD
    </button>
  ) : (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "18px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        height: "28px",
        background: "#f3f4f6",
      }}
    >
      <button
        onClick={() => handleDecrease(prod._id, qty)}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        –
      </button>

      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: "13px",
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {qty}
      </div>

      <button
        onClick={() => {
          if(qty , prod.stock){
              handleIncrease(prod._id, qty)
          }
        }}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "#0f9d58",
          color: "#ffffff",
          fontSize: "14px",
          cursor: "pointer",
          opacity: qty >= prod.stock ? 0.5 : 1,
        }}
        disabled={qty >= prod.stock}
      >
        +
      </button>
    </div>
  )}
</div>

            );
          })}
        </div>
      </div>
    </div>



    {showVendorPopup && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        width: "350px",
        textAlign: "center",
      }}
    >
      <h3>Replace cart items?</h3>
      <p style={{ fontSize: "14px", color: "gray" }}>
        Your cart contains items from another store.
        Do you want to clear the cart and add this item?
      </p>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setShowVendorPopup(false)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            background: "#f5f5f5",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          onClick={async () => {
  try {
    if (cart?.items?.length > 0) {
        await dispatch(clearCart()).unwrap();
    }
    await dispatch(addToCart({ productId: pendingProductId })).unwrap();
    await dispatch(fetchCart()); // Refresh cart state
    // 3️⃣ Close popup
    setShowVendorPopup(false);
  } catch (err) {
    console.log("Replace error:", err);
  }
}}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            background: "#16a34a",
            color: "white",
            cursor: "pointer",
          }}
        >
          Yes, Replace
        </button>
      </div>
    </div>
  </div>
)}
</>
  );
};

export default ShopPage;
