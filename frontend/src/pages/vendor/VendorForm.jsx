import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createVendor, fetchMyVendorProfile } from "../../slices/vendor-slice";
import { useNavigate } from "react-router-dom";

export default function CreateVendor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { vendor } = useSelector((state) => state.vendor);

  const [form, setForm] = useState({
    shopName: "",
    phone: "",
    address: "",
    city: "",
    image: null,
  });

  // ---------- CHECK IF VENDOR ALREADY CREATED PROFILE ----------
  useEffect(() => {
    dispatch(fetchMyVendorProfile());
  }, [dispatch]);

  useEffect(() => {
    if (vendor && vendor._id) {
      alert("You have already created a vendor profile. Redirecting to dashboard...");
      navigate("/vendor/dashboard");
    }
  }, [vendor, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("shopName", form.shopName);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("city", form.city);

    if (form.image) {
      formData.append("image", form.image);
    }

    const resetForm = () => {
      setForm({
        shopName: "",
        phone: "",
        address: "",
        city: "",
        image: null,
      });
    };

    dispatch(createVendor({ formData, resetForm })).then((res) => {
      if (res.type === "vendor/createVendor/fulfilled") {
        navigate("/vendor/addCategory");
      }
    });
  };

  return (
    <>
      {/* ---------- INLINE CSS ---------- */}
      <style>{`
        .vendor-container {
          display: flex;
          justify-content: center;
          padding: 40px;
          background: #f5f6f8;
          min-height: 100vh;
        }

        .vendor-card {
          width: 430px;
          background: #ffffff;
          padding: 30px;
          border-radius: 14px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
          border: 1px solid #e6e6e6;
        }

        .vendor-card h2 {
          text-align: center;
          margin-bottom: 25px;
          color: #0a8f3c;
          font-size: 24px;
          font-weight: 700;
        }

        .form-group {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 6px;
          font-weight: 600;
          font-size: 14px;
          color: #333;
        }

        .form-group input {
          padding: 12px;
          border: 1.5px solid #dcdcdc;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          transition: 0.25s;
        }

        .form-group input:focus {
          border-color: #0a8f3c;
          box-shadow: 0 0 6px rgba(0, 128, 0, 0.2);
        }

        .btn-submit {
          width: 100%;
          padding: 12px;
          background: #0a8f3c;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 8px;
          font-weight: bold;
          transition: 0.2s ease-in-out;
        }

        .btn-submit:hover {
          background: #0b7a36;
        }
      `}</style>

      <div className="vendor-container">
        <div className="vendor-card">
          <h2>Create Vendor</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                required
                placeholder="Enter shop name"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="Enter address"
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="Enter city"
              />
            </div>

            <div className="form-group">
              <label>Shop Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files[0] })
                }
              />
            </div>

            <button className="btn-submit" type="submit">
              Create Vendor
            </button>
          </form>
        </div>
      </div>
    </>
  );
}