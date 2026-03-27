import { useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomerProfile,
  updateCustomer,
  deleteCustomer
} from "../../slices/customer-slice";
import { getMyOrders } from "../../slices/order-slice";

const CustomerProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useContext(UserContext);

  const { profile, loading } = useSelector((state) => state.customer);
  const { orders } = useSelector((state) => state.order);

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    address: "",
    city: ""
  });

  useEffect(() => {
    if(!localStorage.getItem("token")) return;
    dispatch(fetchCustomerProfile());
    dispatch(getMyOrders());
  }, [dispatch]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    setActiveTab(query.get("tab") === "orders" ? "orders" : "profile");
  }, [location.search]);

  useEffect(() => {
    if (profile) {
      setForm({
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || ""
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await dispatch(updateCustomer({ id: profile._id, formData: form }));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete your account permanently?")) {
      await dispatch(deleteCustomer(profile._id));
      handleLogout();
      navigate("/");
    }
  };

  if (loading || !profile) return <p>Loading...</p>;

  return (
    <div
      style={{
        display: "flex",
        padding: "30px",
        background: "#f5f7fa",
        minHeight: "100vh",
        gap: "30px",
        fontFamily: "Inter, sans-serif"
      }}
    >
      {/* ================= SIDEBAR ================= */}
      <div
        style={{
          width: "220px",
          background: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
        }}
      >
        <SidebarButton
          label="My Profile"
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        />
        <SidebarButton
          label="My Orders"
          active={activeTab === "orders"}
          onClick={() => setActiveTab("orders")}
        />
        <SidebarButton
          label="Logout"
          onClick={() => {
            handleLogout();
            navigate("/login");
          }}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div
        style={{
          flex: 1,
          background: "#ffffff",
          borderRadius: "14px",
          padding: "30px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
        }}
      >
        {activeTab === "profile" && (
          <>
            <h2 style={{ marginBottom: "25px" }}>Profile Details</h2>

            <ProfileRow label="Username" value={profile.username} />
            <ProfileRow label="Email" value={profile.email} />

            {!isEditing ? (
              <>
                <ProfileRow label="Phone" value={profile.phone} />
                <ProfileRow label="Address" value={profile.address} />
                <ProfileRow label="City" value={profile.city} />

                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                  <ActionButton
                    label="Edit Profile"
                    color="#0f9d58"
                    onClick={() => setIsEditing(true)}
                  />
                  <ActionButton
                    label="Delete Account"
                    color="#ef4444"
                    onClick={handleDelete}
                  />
                </div>
              </>
            ) : (
              <>
                <InputField
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
                <InputField
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
                <InputField
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />

                <div style={{ display: "flex", gap: "10px" }}>
                  <ActionButton label="Save" color="#0f9d58" onClick={handleSave} />
                  <ActionButton
                    label="Cancel"
                    color="#6b7280"
                    onClick={() => setIsEditing(false)}
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* ================= ORDERS ================= */}
        {activeTab === "orders" && (
          <>
            <h2 style={{ marginBottom: "25px" }}>My Orders</h2>

            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    background: "#f9fafb",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "18px",
                    border: "1px solid #e5e7eb"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px"
                    }}
                  >
                    <strong>Order #{order._id.slice(-6)}</strong>
                    <StatusBadge status={order.status} />
                  </div>

                  <div style={{ fontSize: "14px", marginBottom: "10px" }}>
                    Total: ₹{order.totalAmount}
                  </div>

                  <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

                  {order.products.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        marginTop: "8px"
                      }}
                    >
                      <span>
                        {item.productId?.name} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const SidebarButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      padding: "10px",
      marginBottom: "12px",
      borderRadius: "8px",
      border: "none",
      textAlign: "left",
      cursor: "pointer",
      fontWeight: 500,
      background: active ? "#0f9d58" : "#f3f4f6",
      color: active ? "#ffffff" : "#374151"
    }}
  >
    {label}
  </button>
);

const ProfileRow = ({ label, value }) => (
  <p style={{ marginBottom: "12px", fontSize: "15px" }}>
    <strong>{label}:</strong> {value}
  </p>
);

const InputField = ({ label, ...props }) => (
  <div style={{ marginBottom: "12px" }}>
    <label style={{ fontSize: "14px", fontWeight: 500 }}>{label}</label>
    <input
      {...props}
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
        marginTop: "4px"
      }}
    />
  </div>
);

const ActionButton = ({ label, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      background: color,
      color: "#fff",
      cursor: "pointer",
      fontSize: "14px"
    }}
  >
    {label}
  </button>
);

const StatusBadge = ({ status }) => {
  const colors = {
    placed: "#fef3c7",
    packing: "#dbeafe",
    "on-the-way": "#e0f2fe",
    delivered: "#dcfce7",
    cancelled: "#fee2e2"
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
        background: colors[status] || "#f3f4f6"
      }}
    >
      {status}
    </span>
  );
};

export default CustomerProfile;
