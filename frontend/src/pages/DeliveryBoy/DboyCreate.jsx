import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import {
  createDeliveryBoy,
  fetchDeliveryBoyProfile,
} from "../../slices/dboy-slice";

const CreateDeliveryBoy = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dboyProfile, loading } = useSelector((state) => state.deliveryBoy);
  const { user } = useContext(UserContext);

  const [form, setForm] = useState({
    phone: "",
    address: "",
    city: "",
    vehicleNumber: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    dispatch(fetchDeliveryBoyProfile());
  }, [dispatch]);

  // If existing profile → redirect with message
  // useEffect(() => {
  //   if (dboyProfile) {
  //     alert("You already created your profile.");
  //     navigate("/deliveryboy/home");
  //   }
  // }, [dboyProfile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = (e) => {
  e.preventDefault();
  dispatch(createDeliveryBoy(form)).then((res) => {
    if (!res.error) {
      alert("Profile created successfully!");
      navigate("/deliveryboy/home");
    } else {
      alert("Something went wrong. Try again!");
    }
  });
};

  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <h2 style={styles.title}>Create Delivery Partner Profile</h2>

        <form style={styles.form} onSubmit={handleSubmit}>
          {/* Auto-filled fields */}
          <input
            type="text"
            value={user?.username || ""}
            disabled
            style={styles.disabled}
          />

          <input
            type="text"
            value={user?.email || ""}
            disabled
            style={styles.disabled}
          />

          {/* Editable fields */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number (e.g. MH12 AB 1234)"
            value={form.vehicleNumber}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button style={styles.btn} disabled={loading}>
            {loading ? "Saving..." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDeliveryBoy;

/* ---------------------- STYLES ---------------------- */

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f6fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  box: {
    width: "380px",
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
    animation: "fadeIn 0.3s ease",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e293b",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    transition: "0.2s",
  },

  disabled: {
    padding: "12px",
    borderRadius: "10px",
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    color: "#64748b",
  },

  btn: {
    padding: "14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "5px",
    transition: "0.2s",
  },
};