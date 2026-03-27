import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCustomer } from "../../slices/customer-slice";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

const CreateCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const { profile, loading, error } = useSelector((state) => state.customer);

  useEffect(() => {
    if (profile) {
      navigate("/", {replace: true});
    } 
  }, [profile]);


  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        username: user.username, 
        email: user.email,       
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      phone: form.phone,
      address: form.address,
      city: form.city,
      username: form.username, 
    };

    dispatch(createCustomer({ formData: data, navigate }));
  };

  return (
  <div
    style={{
      maxWidth: "320px",
      margin: "60px auto",   // centers + pushes below navbar
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    <h2 style={{ marginBottom: "20px" }}>Create Customer Profile</h2>

    {error && <p style={{ color: "red" }}>{error}</p>}

    <form onSubmit={handleSubmit}>

      <label>Username</label><br />
      <input
        type="text"
        name="username"
        value={form.username}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "6px", marginBottom: "12px" }}
      />

      <label>Email</label><br />
      <input
        type="text"
        value={form.email}
        disabled
        style={{ width: "100%", padding: "6px", marginBottom: "12px" }}
      />

      <label>Phone</label><br />
      <input
        type="text"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "6px", marginBottom: "12px" }}
      />

      <label>Address</label><br />
      <input
        type="text"
        name="address"
        value={form.address}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "6px", marginBottom: "12px" }}
      />

      <label>City</label><br />
      <input
        type="text"
        name="city"
        value={form.city}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "6px", marginBottom: "12px" }}
      />

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "8px",
          backgroundColor: "#ff2e83",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Saving..." : "Create Profile"}
      </button>

    </form>
  </div>
);

};

export default CreateCustomer;
