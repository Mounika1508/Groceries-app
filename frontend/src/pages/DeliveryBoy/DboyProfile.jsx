import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeliveryBoyProfile,
  updateDeliveryBoy,
  deleteDeliveryBoy,
} from "../../slices/dboy-slice";

export default function DeliveryBoyProfile() {
  const dispatch = useDispatch();
  const { dboyProfile, loading } = useSelector((state) => state.deliveryBoy);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    address: "",
    city: "",
    vehicleNumber: "",
  });

  useEffect(() => {
    dispatch(fetchDeliveryBoyProfile());
  }, []);

  useEffect(() => {
    if (dboyProfile) {
      setForm({
        phone: dboyProfile.phone,
        address: dboyProfile.address,
        city: dboyProfile.city,
        vehicleNumber: dboyProfile.vehicleNumber,
      });
    }
  }, [dboyProfile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Save Updated Profile
  const handleSave = async () => {
    await dispatch(updateDeliveryBoy(form));
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  // ❌ Delete Account
  const handleDelete = async () => {
    if (window.confirm("Are you sure? This will delete your profile permanently.")) {
      await dispatch(deleteDeliveryBoy());
      alert("Profile deleted successfully!");
      window.location.href = "/deliveryboy/create";
    }
  };

  if (loading) {
    return <h2 style={styles.loading}>Loading...</h2>;
  }

  if (!dboyProfile) {
    return (
      <h2 style={styles.noProfile}>
        No profile found. Please create your profile first.
      </h2>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Profile</h2>

      <div style={styles.card}>
        {/* PROFILE HEADER */}
        <div style={styles.rowBetween}>
          <div>
            <h3 style={{ marginBottom: "5px" }}>
              {dboyProfile?.userId?.username}
            </h3>
            <p style={styles.email}>{dboyProfile?.userId?.email}</p>
          </div>

          <img
            src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
            style={styles.avatar}
          />
        </div>

        {/* INPUT FIELDS */}
        <div style={styles.form}>
          <label style={styles.label}>Phone</label>
          <input
            name="phone"
            value={form.phone}
            disabled={!isEditing}
            onChange={handleChange}
            style={isEditing ? styles.input : styles.inputDisabled}
          />

          <label style={styles.label}>Address</label>
          <input
            name="address"
            value={form.address}
            disabled={!isEditing}
            onChange={handleChange}
            style={isEditing ? styles.input : styles.inputDisabled}
          />

          <label style={styles.label}>City</label>
          <input
            name="city"
            value={form.city}
            disabled={!isEditing}
            onChange={handleChange}
            style={isEditing ? styles.input : styles.inputDisabled}
          />

          <label style={styles.label}>Vehicle Number</label>
          <input
            name="vehicleNumber"
            value={form.vehicleNumber}
            disabled={!isEditing}
            onChange={handleChange}
            style={isEditing ? styles.input : styles.inputDisabled}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div style={styles.buttonRow}>
          {!isEditing ? (
            <button style={styles.editBtn} onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <>
              <button style={styles.saveBtn} onClick={handleSave}>
                💾 Save
              </button>
              <button style={styles.cancelBtn} onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </>
          )}

          <button style={styles.deleteBtn} onClick={handleDelete}>
            🗑 Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   PROFESSIONAL UI STYLES (Swiggy / Zepto Style)
   ========================================================== */
const styles = {
  container: {
    maxWidth: "400px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "Inter, sans-serif",
  },

  title: {
    fontSize: "26px",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "20px",
    color: "#1e293b",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },

  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
  },

  email: {
    fontSize: "14px",
    color: "#64748b",
  },

  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  label: {
    fontSize: "14px",
    fontWeight: 600,
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #4f46e5",
    background: "white",
  },

  inputDisabled: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#f3f3f3",
  },

  buttonRow: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  editBtn: {
    padding: "12px",
    background: "#4f46e5",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    border: "none",
  },

  saveBtn: {
    padding: "12px",
    background: "#16a34a",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    border: "none",
    fontWeight: 600,
  },

  cancelBtn: {
    padding: "10px",
    background: "#e5e7eb",
    borderRadius: "10px",
    cursor: "pointer",
    border: "none",
    fontWeight: 600,
  },

  deleteBtn: {
    marginTop: "10px",
    padding: "12px",
    background: "#dc2626",
    color: "white",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },

  loading: {
    textAlign: "center",
    marginTop: "40px",
  },

  noProfile: {
    textAlign: "center",
    marginTop: "40px",
    color: "#b91c1c",
    fontWeight: 600,
  },
};