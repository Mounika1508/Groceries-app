import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerProfile } from "../../slices/customer-slice";
import { getMyOrders } from "../../slices/order-slice";
import { listVendors } from "../../slices/vendor-slice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
const [loading, setLoading] = useState(false);

  const { profile } = useSelector((state) => state.customer);
  const { vendors } = useSelector((state) => state.vendor);

  useEffect(() => {
    if(!localStorage.getItem("token")) return;
    dispatch(fetchCustomerProfile());
    dispatch(getMyOrders());
    dispatch(listVendors());
  }, [dispatch]);

  useEffect(() => {
  const delaySearch = setTimeout(async () => {

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:4050/products/search?q=${searchQuery}`
      );

      setSearchResults(res.data);
      setShowDropdown(true);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  }, 400);

  return () => clearTimeout(delaySearch);

}, [searchQuery]);


  return (
  <div
    style={{
      background: "#fafafa",
      minHeight: "100vh",
      padding: "28px 20px",
    }}
  >
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",   // ✅ THIS CENTERS THE PAGE
        position: "relative",
      }}
    >

        <div
      style={{
        position: "fixed",
        top: "80px",
        right: "30px",
        zIndex: 1000,
      }}
    >
      <div
        onClick={() => navigate("/customer/profile")}
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          background: "#16a34a",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px"
        }}
      >
        {profile?.username?.charAt(0).toUpperCase()}
      </div>
    </div>
    

      {/* 🔹 LOCATION + GREETING */}
      <div style={{ marginBottom: "25px" }}>
        <p style={{ margin: 0, fontSize: "14px", color: "gray" }}>
          📍 Delivering to
        </p>
        <h4 style={{ margin: "5px 0" }}>
          {profile?.city}, {profile?.address}
        </h4>
        <p style={{ marginTop: "12px", fontSize: "15px", fontWeight: 600, color: "#163a5f" }}>
          Hi {profile?.username} 👋
        </p>

        <p style={{ color: "gray", marginTop: "5px" }}>
          What would you like to order today?
        </p>
      </div>

      {/* 🔍 SMALL SEARCH BOX */}
      <div style={{ marginBottom: "35px", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "560px" }}>
          <input
            type="text"
            placeholder="Search for groceries or shops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
              outline: "none",
              background: "#fff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          />
          {showDropdown && (
      <div
        style={{
          position: "absolute",
          top: "50px",
          left: 0,
          width: "100%",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          maxHeight: "300px",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >

        {loading && (
          <div style={{ padding: "12px" }}>Searching...</div>
        )}

        {!loading && searchResults.length === 0 && (
          <div style={{ padding: "12px", color: "gray" }}>
            No results found
          </div>
        )}

        {!loading && searchResults.map((shop) => (
          <div
            key={shop._id}
            onClick={() => {
              navigate(`/shop/${shop._id}`);
              setShowDropdown(false);
              setSearchQuery("");
            }}
            style={{
              padding: "12px",
              cursor: "pointer",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <img
              src={shop.image}
              alt={shop.shopName}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "6px",
                objectFit: "cover"
              }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>
                {shop.shopName}
              </div>
              <div style={{ fontSize: "12px", color: "gray" }}>
                {shop.city}
              </div>
            </div>
          </div>
        ))}

      </div>
    )}
          {/* <button
            onClick={() => {}}
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(22,163,74,0.2)",
              fontWeight: 600,
            }}
          >
            Search
          </button> */}
        </div>
      </div>

      <div
      style={{
        width: "100%",
        height: "300px",
        backgroundImage: "url('/images/banner1.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />

    {/* 🔥 CENTER CONTENT BELOW */}
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "30px 20px",
      }}
    > 
    </div>


      {/* 🏪 SHOPS SECTION */}
      <div>
        <h3 style={{ marginBottom: "15px" }}>Shops Near You</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "20px",
            alignItems: "start",
          }}
        >

          {vendors?.map((shop) => (
            <div
              key={shop._id}
              onClick={() => navigate(`/shop/${shop._id}`)}
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                cursor: "pointer",
                overflow: "hidden",
                flexShrink: 0,
                padding: "10px",
                transition: "transform 160ms ease, box-shadow 160ms ease",
                maxWidth: "220px",
              }}
            >
              {/* IMAGE */}
              <img
                src={shop.image}
                alt={shop.shopName}
                style={{
                  width: "100%",
                  height: "110px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              {/* NAME */}
              <div style={{ padding: "10px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", color: "#163a5f" }}>
                  {shop.shopName}
                </h4>
                <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
                  {shop.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

    </div>
  );
};

export default Home;
