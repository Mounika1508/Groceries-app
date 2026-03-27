import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateVendor, fetchMyVendorProfile } from "../../slices/vendor-slice";

export default function VendorProfile() {
  const dispatch = useDispatch();
  const { vendor, loading } = useSelector((state) => state.vendor);

  const [form, setForm] = useState({
    shopName: "",
    phone: "",
    address: "",
    city: "",
    email: "",
    image: null
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    dispatch(fetchMyVendorProfile());
  }, [dispatch]);

  useEffect(() => {
    if (vendor) {
      setForm({
        shopName: vendor.shopName || "",
        phone: vendor.phone || "",
        address: vendor.address || "",
        city: vendor.city || "",
        email: vendor.userId?.email || "",
        image: null
      });

      setPreview(vendor.image); // existing image
    }
  }, [vendor]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });

    if (file) {
      setPreview(URL.createObjectURL(file)); // instant preview
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("shopName", form.shopName);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("city", form.city);

    if (form.image) {
      formData.append("image", form.image); // Cloudinary will update
    }

    dispatch(updateVendor({ vendorId: vendor._id, formData }))
      .then(() => alert("Profile updated successfully!"));
  };

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "auto" }}>
      <h2 style={{ fontWeight: "900", marginBottom: "20px" }}>
        Vendor Profile
      </h2>

      <form onSubmit={handleSubmit}>
        <style>{`
          .input-box {
            width: 100%;
            padding: 10px;
            margin-bottom: 14px;
            border: 1px solid #d1d5db;
            border-radius: 10px;
            background: #fff;
            font-size: 14px;
          }

          .label {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
            display: block;
          }

          .btn-save {
            background: #4F46E5;
            padding: 12px 18px;
            color: white;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
          }

          .btn-save:hover {
            background: #4338CA;
          }

          .disabled {
            background: #f3f4f6;
          }

          .image-container {
            margin: 10px 0;
            text-align: center;
          }

          .preview-img {
            width: 120px;
            height: 120px;
            border-radius: 12px;
            object-fit: cover;
            box-shadow: 0px 4px 12px rgba(0,0,0,0.12);
            margin-bottom: 10px;
          }
        `}</style>

        {/* IMAGE PREVIEW */}
        <div className="image-container">
          {preview && <img src={preview} alt="Shop" className="preview-img" />}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: "10px" }}
          />
        </div>

        <label className="label">Shop Name</label>
        <input
          className="input-box"
          name="shopName"
          value={form.shopName}
          onChange={handleChange}
        />

        <label className="label">Phone</label>
        <input
          className="input-box"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <label className="label">Address</label>
        <input
          className="input-box"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <label className="label">City</label>
        <input
          className="input-box"
          name="city"
          value={form.city}
          onChange={handleChange}
        />

        <label className="label">Email</label>
        <input
          className="input-box disabled"
          value={form.email}
          disabled
        />

        <button className="btn-save" type="submit">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}