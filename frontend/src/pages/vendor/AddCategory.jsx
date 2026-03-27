import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  listCategories,
  updateCategory,
  deleteCategory,
} from "../../slices/category-slice";

export default function AddCategory() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { categories, loading } = useSelector((state) => state.category);
  const {vendor} = useSelector((state) => state.vendor)

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  // SUBMIT (Add / Update)
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);

    if (image) formData.append("image", image);

    if (isEditing) {
      dispatch(updateCategory({ id: editCategoryId, formData })).then((res) => {
        if (res.type.includes("fulfilled")) {
          alert("Category updated!");
          resetForm();
          dispatch(listCategories());
        }
      });
    } else {
      dispatch(addCategory({ formData })).then((res) => {
        if (res.type.includes("fulfilled")) {
          alert("Category added!");
          resetForm();
          dispatch(listCategories());
        }
      });
    }
  };

  // EDIT CLICK
  const handleEdit = (cat) => {
    setIsEditing(true);
    setEditCategoryId(cat._id);

    setName(cat.name);
    setPreviewImage(cat.image);
    setImage(null);
  };

  // DELETE CATEGORY
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    dispatch(deleteCategory(id)).then((res) => {
      if (res.type.includes("fulfilled")) {
        alert("Category deleted!");
        dispatch(listCategories());
      }
    });
  };

  // RESET FORM
  const resetForm = () => {
    setName("");
    setImage(null);
    setPreviewImage(null);
    setIsEditing(false);
    setEditCategoryId(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (vendor && !vendor.isApproved) {
  return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      <h2>Your shop is not approved yet</h2>
      <p>You can add categories only after admin approval.</p>
    </div>
  );
}

  return (
    <div className="category-container">
      {/* ================= STYLE ================= */}
      <style>{`
        .category-container {
          padding: 40px;
          background: #f5f6fa;
          min-height: 100vh;
        }
        .category-card {
          max-width: 550px;
          margin: auto;
          background: #fff;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0px 6px 18px rgba(0,0,0,0.08);
        }
        .category-title {
          font-size: 26px;
          font-weight: 800;
          margin-bottom: 25px;
          text-align: center;
        }
        .form-group { margin-bottom: 18px; }
        .form-label { font-weight: 600; font-size: 14px; margin-bottom: 6px; display:block; }
        .form-input {
          width: 100%; padding: 12px; border-radius: 10px;
          border: 1px solid #d1d5db; font-size: 15px;
        }
        .upload-box {
          border: 2px dashed #cbd5e1;
          padding: 18px; border-radius: 12px;
          text-align: center; cursor: pointer;
        }
        .btn-submit {
          width: 100%; padding: 12px;
          background: #4f46e5; color: white;
          border: none; border-radius: 10px;
          font-size: 16px; cursor: pointer;
          margin-top: 10px;
        }
        .categories-title {
          font-size: 22px; font-weight: 700;
          margin-top: 40px;
        }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          margin-top: 20px;
          justify-items: center;
        }
        .category-card-small {
          background: white;
          padding: 10px;
          border-radius: 14px;
          text-align: center;
          box-shadow: 0px 4px 10px rgba(0,0,0,0.06);
          transition: 0.2s;
          position: relative;
          width: 130px;
          height: 130px;
          margin: auto;
        }
        .category-card-small:hover {
          transform: translateY(-5px);
        }
        .cat-img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
          margin-top: 10px;
        }
        .cat-name {
          font-size: 14px;
          font-weight: 600;
          margin-top: 10px;
          color: #374151;
        }
        .category-actions {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 4px;
        }
        .icon-btn {
          background: white;
          border: none;
          font-size: 16px;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          box-shadow: 0px 2px 5px rgba(0,0,0,0.15);
          transition: 0.2s;
        }
        .icon-btn:hover {
          transform: scale(1.15);
        }
        .edit-btn { color: #2563eb; }
        .delete-btn { color: #dc2626; }
      `}</style>

      {/* ================= ADD / EDIT CATEGORY FORM ================= */}
      <div className="category-card">
        <h2 className="category-title">
          {isEditing ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              required
              placeholder="Enter category name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* IMAGE */}
          <div className="form-group">
            <label className="form-label">Category Image (optional)</label>

            <div
              className="upload-box"
              onClick={() => fileInputRef.current.click()}
            >
              Click to upload image
            </div>

            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                setPreviewImage(URL.createObjectURL(file));
              }}
            />

            {/* Show file name */}
            {image && (
              <p style={{ fontSize: "13px", marginTop: "6px" }}>
                Selected: {image.name}
              </p>
            )}

            {/* FIX: show preview only if it’s not empty */}
            {previewImage ? (
              <img
                src={previewImage}
                alt="preview"
                style={{ width: "70px", marginTop: "8px", borderRadius: "8px" }}
              />
            ) : null}
          </div>

          {/* BUTTON */}
          <button className="btn-submit" type="submit">
            {isEditing ? "Update Category" : "Add Category"}
          </button>
        </form>
      </div>

      {/* ================= CATEGORY LIST ================= */}
      <h3 className="categories-title">Existing Categories</h3>

      <div className="category-grid">
        {categories.map((cat) => (
          <div className="category-card-small" key={cat._id}>
            <div className="category-actions">
              <button className="icon-btn edit-btn" onClick={() => handleEdit(cat)}>
                ✏️
              </button>
              <button
                className="icon-btn delete-btn"
                onClick={() => handleDelete(cat._id)}
              >
                🗑️
              </button>
            </div>

            {/* FIX: prevent empty src error */}
            {cat.image ? (
              <img className="cat-img" src={cat.image} alt={cat.name} />
            ) : null}

            <div className="cat-name">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}