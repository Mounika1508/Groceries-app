import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addProduct,
  listProducts,
  updateProduct,
  deleteProduct,
} from "../../slices/product-slice";

import { listCategories } from "../../slices/category-slice";

export default function AddProduct() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const { categories } = useSelector((state) => state.category);
  const { products, loading } = useSelector((state) => state.product);

  const [form, setForm] = useState({
    name: "",
    price: "",
    netQnty: "",
    description: "",
    stock: "",
    categoryId: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(listCategories());
    dispatch(listProducts());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      netQnty: "",
      description: "",
      stock: "",
      categoryId: "",
      image: null,
    });
    setPreview(null);
    setIsEditing(false);
    setEditId(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));

    if (isEditing) {
      dispatch(updateProduct({ id: editId, formData: fd })).then((res) => {
        if (res.type.includes("fulfilled")) {
          alert("Product updated!");
          resetForm();
          dispatch(listProducts());
        }
      });
    } else {
      dispatch(addProduct({ formData: fd, resetForm })).then((res) => {
        if (res.type.includes("fulfilled")) {
          dispatch(listProducts());
        }
      });
    }
  };

  const handleEdit = (p) => {
    setIsEditing(true);
    setEditId(p._id);

    setForm({
      name: p.name,
      price: p.price,
      netQnty: p.netQnty,
      description: p.description,
      stock: p.stock,
      categoryId: p.categoryId?._id,
      image: null,
    });

    setPreview(p.image);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;

    dispatch(deleteProduct(id)).then((res) => {
      if (res.type.includes("fulfilled")) {
        dispatch(listProducts());
      }
    });
  };

  return (
    <div className="two-col-page">
      <style>{`
        .two-col-page {
          display: flex;
          gap: 30px;
          padding: 30px;
          background: #f5f6fa;
          min-height: 100vh;
        }

        /* LEFT SIDE FORM (Sticky) */
        .form-card {
          width: 340px;
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0px 6px 18px rgba(0,0,0,0.08);
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .form-title {
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 15px;
          text-align: center;
        }

        .inputBox { margin-bottom: 12px; font-size:14px; }
        .input {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
        }

        .uploadBox {
          border: 2px dashed #cbd5e1;
          padding: 12px;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          color: #6b7280;
          font-size: 14px;
        }

        .btn-submit {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: #4f46e5;
          color: white;
          border: none;
          font-size: 16px;
          cursor: pointer;
          margin-top: 8px;
        }

        /* RIGHT SIDE PRODUCTS GRID */
        .products-section {
          flex: 1;
        }

        .section-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 15px;
        }

        .productCard {
          background: white;
          padding: 10px;
          border-radius: 14px;
          text-align: center;
          box-shadow: 0px 4px 10px rgba(0,0,0,0.06);
          position: relative;
        }

        .productImg {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 5px;
        }

        .noImgBox {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background: #f3f4f6;
          display: flex;
          align-items:center;
          justify-content:center;
          margin: 0 auto 5px;
        }
        .noImgIcon { font-size:26px; color:#9ca3af; }

        .actionBtns {
          position: absolute;
          top: 6px;
          right: 6px;
          display: flex;
          gap: 5px;
        }

        .icon-btn {
          background: white;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          box-shadow: 0px 2px 5px rgba(0,0,0,0.15);
        }
      `}</style>

      {/* LEFT — FORM */}
      <div className="form-card">
        <h2 className="form-title">{isEditing ? "Edit Product" : "Add Product"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <label>Name</label>
            <input className="input" name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="inputBox">
            <label>Price</label>
            <input className="input" name="price" value={form.price} onChange={handleChange} />
          </div>

          <div className="inputBox">
            <label>Net Quantity</label>
            <input className="input" name="netQnty" value={form.netQnty} onChange={handleChange} />
          </div>

          <div className="inputBox">
            <label>Description</label>
            <input className="input" name="description" value={form.description} onChange={handleChange} />
          </div>

          <div className="inputBox">
            <label>Stock</label>
            <input className="input" name="stock" value={form.stock} onChange={handleChange} />
          </div>

          <div className="inputBox">
            <label>Category</label>
            <select className="input" name="categoryId" value={form.categoryId} onChange={handleChange}>
              <option value="">Select...</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="inputBox">
            <label>Product Image</label>

            <div className="uploadBox" onClick={() => fileRef.current.click()}>
              Click to upload
            </div>

            <input
              type="file"
              ref={fileRef}
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                setForm({ ...form, image: file });
                setPreview(URL.createObjectURL(file));
              }}
            />

            {preview && <img src={preview} style={{ width: "70px", marginTop: "8px" }} />}
          </div>

          {/* BUTTON */}
          <button className="btn-submit" type="submit">
            {isEditing ? "Update Product" : loading ? "Adding..." : "Add Product"}
          </button>

          {/* CANCEL EDIT */}
          {isEditing && (
            <button
              type="button"
              className="btn-cancel"
              onClick={resetForm}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                borderRadius: "10px",
                background: "#e5e7eb",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                color: "#374151",
                fontWeight: 600,
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* RIGHT — PRODUCTS */}
      <div className="products-section">
        <h3 className="section-title">Existing Products</h3>

        <div className="products-grid">
          {products.map((p) => (
            <div className="productCard" key={p._id}>
              <button
                className="icon-btn edit-btn"
                onClick={() => handleEdit(p)}
                style={{ position: "absolute", top: "6px", left: "6px" }}
              >
                ✏️
              </button>

              <button
                className="icon-btn delete-btn"
                onClick={() => handleDelete(p._id)}
                style={{ position: "absolute", top: "6px", right: "6px" }}
              >
                🗑️
              </button>
              {p.image ? (
                <img src={p.image} className="productImg" />
              ) : (
                <div className="noImgBox">
                  <span className="noImgIcon">🛍️</span>
                </div>
              )}

              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div>₹{p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}