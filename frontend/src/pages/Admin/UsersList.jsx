import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "../../slices/admin-slice";
import { FiTrash2 } from "react-icons/fi";

export default function UsersList() {
  const dispatch = useDispatch();
  const { allUsers = [], loading } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortType, setSortType] = useState("az");
  const [page, setPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (loading) return <h3>Loading users...</h3>;

  /* ---------- SEARCH ---------- */
  const searchFiltered = allUsers.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- FILTER BY ROLE ---------- */
  const filteredByRole =
    filterRole === "all"
      ? searchFiltered
      : searchFiltered.filter((u) => u.role === filterRole);

  /* ---------- SORTING ---------- */
  const sorted = [...filteredByRole].sort((a, b) => {
    if (sortType === "az") return a.username.localeCompare(b.username);
    if (sortType === "za") return b.username.localeCompare(a.username);
    return 0;
  });

  /* ---------- PAGINATION ---------- */
  const startIndex = (page - 1) * usersPerPage;
  const paginatedUsers = sorted.slice(startIndex, startIndex + usersPerPage);

  const totalPages = Math.ceil(sorted.length / usersPerPage);

  /* ---------- ROLE BADGE COLORS ---------- */
  const roleColors = {
    admin: { bg: "#2563eb20", color: "#2563eb" },
    vendor: { bg: "#f59e0b20", color: "#d97706" },
    customer: { bg: "#22c55e20", color: "#16a34a" },
    deliveryboy: { bg: "#a855f720", color: "#9333ea" },
  };

  /* ---------- DELETE USER ---------- */
  const handleDelete = async (userId, name, role) => {
  if (role === "admin") {
    return alert("Cannot delete admin accounts!");
  }

  if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

  try {
    const res = await fetch(`http://localhost:4050/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("token") },
    });

    const data = await res.json();
    alert(data.message || "User deleted successfully");

    dispatch(fetchAllUsers());
  } catch (err) {
    alert("Something went wrong");
  }
};

  return (
    <div style={styles.container}>

      {/* Title */}
      <h2 style={styles.title}>All Users</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* Filter Buttons */}
      <div style={styles.filterRow}>
        {["all", "admin", "vendor", "customer", "deliveryboy"].map((role) => (
          <button
            key={role}
            onClick={() => {
              setFilterRole(role);
              setPage(1);
            }}
            style={{
              ...styles.filterBtn,
              backgroundColor: filterRole === role ? "#2563eb" : "#e5e7eb",
              color: filterRole === role ? "white" : "#374151",
            }}
          >
            {role.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Sorting */}
      <div style={{ marginBottom: "15px" }}>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          style={styles.select}
        >
          <option value="az">Sort A–Z</option>
          <option value="za">Sort Z–A</option>
        </select>
      </div>

      {/* Users List */}
      {paginatedUsers.map((user) => (
        <div key={user._id} style={styles.userCard}>
          <div>
            <p style={styles.username}>{user.username}</p>
            <p style={styles.email}>{user.email}</p>
            <p style={styles.joinDate}>
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* ROLE BADGE */}
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "12px",
                backgroundColor: roleColors[user.role]?.bg,
                color: roleColors[user.role]?.color,
              }}
            >
              {user.role.toUpperCase()}
            </span>

            {/* DELETE BUTTON ONLY FOR CUSTOMERS */}
            {user.role !== "admin" && (
              <button
                style={styles.deleteBtn}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#fee2e2")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
                onClick={() => handleDelete(user._id, user.username, user.role)}
              >
                <FiTrash2 size={18} />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={styles.pageBtn}
        >
          Prev
        </button>

        <span style={styles.pageNumber}>{page} / {totalPages}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          style={styles.pageBtn}
        >
          Next
        </button>
      </div>

    </div>
  );
}

/* ---------------------------------------
   STYLES
--------------------------------------- */

const styles = {
  container: {
    padding: "25px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  search: {
    padding: "10px",
    width: "300px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    marginBottom: "15px",
  },
  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  filterBtn: {
    padding: "6px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
  select: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },
  userCard: {
    border: "1px solid #e5e7eb",
    background: "white",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  username: {
    fontWeight: "600",
    margin: 0,
  },
  email: {
    margin: "4px 0",
    color: "#6b7280",
  },
  joinDate: {
    fontSize: "12px",
    color: "#9ca3af",
  },

  /* DELETE BUTTON */
  deleteBtn: {
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "6px",
  borderRadius: "6px",
  color: "#dc2626", // red
  transition: "0.2s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
},

  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    alignItems: "center",
  },
  pageBtn: {
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "white",
    cursor: "pointer",
  },
  pageNumber: {
    fontWeight: "600",
  },
};