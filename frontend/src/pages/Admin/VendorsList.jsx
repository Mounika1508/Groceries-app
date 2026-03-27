import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllVendors, fetchVendorDetails } from "../../slices/admin-slice";

export default function VendorsList() {
  const dispatch = useDispatch();

  const { allVendors = [], vendorDetails = {}, loading } = useSelector(
    (state) => state.admin
  );

  const [visibleVendors, setVisibleVendors] = useState({}); // toggle for each vendor

  useEffect(() => {
    if(!localStorage.getItem("token")) return;
    dispatch(fetchAllVendors());
  }, [dispatch]);

  const handleView = (vendorId) => {
    if (!vendorDetails[vendorId]) {
      dispatch(fetchVendorDetails(vendorId)); // fetch details only first time
    }

    // toggle show/hide
    setVisibleVendors((prev) => ({
      ...prev,
      [vendorId]: !prev[vendorId],
    }));
  };

  if (loading) return <h3 style={styles.loading}>Loading vendors...</h3>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Vendors</h2>

      {allVendors.length === 0 ? (
        <p>No vendors found.</p>
      ) : (
        allVendors.map((vendor) => (
          <div key={vendor._id} style={styles.vendorCard}>
            {/* VENDOR HEADER */}
            <div style={styles.headerRow}>
              <h3 style={styles.vendorName}>🏪 {vendor.shopName}</h3>

              <button
                style={styles.viewBtn}
                onClick={() => handleView(vendor._id)}
              >
                {visibleVendors[vendor._id] ? "Hide Details" : "View Details"}
              </button>
            </div>

            {/* DETAILS SECTION */}
            {visibleVendors[vendor._id] && vendorDetails[vendor._id] && (
              <div style={styles.detailsBox}>
                <div style={styles.infoRow}>
                  <div>
                    <p style={styles.infoText}>
                      <strong>City:</strong> {vendorDetails[vendor._id].city}
                    </p>

                    <p style={styles.infoText}>
                      <strong>Phone:</strong> {vendorDetails[vendor._id].phone}
                    </p>

                    <p style={styles.infoText}>
                      <strong>Email:</strong>{" "}
                      {vendorDetails[vendor._id].userId?.email}
                    </p>

                    <p style={styles.infoText}>
                      <strong>Username:</strong>{" "}
                      {vendorDetails[vendor._id].userId?.username}
                    </p>
                  </div>

                  {/* SHOP IMAGE */}
                  <img
                    src={
                      vendorDetails[vendor._id].image ||
                      "https://cdn-icons-png.flaticon.com/512/868/868786.png"
                    }
                    alt="shop"
                    style={styles.shopImage}
                  />
                </div>

                {/* STATUS BADGE */}
                <div style={styles.statusRow}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: vendorDetails[vendor._id].isApproved
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(234,179,8,0.15)",
                      color: vendorDetails[vendor._id].isApproved
                        ? "#16a34a"
                        : "#b45309",
                    }}
                  >
                    {vendorDetails[vendor._id].isApproved
                      ? "Approved"
                      : "Pending"}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))
      )}
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
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  loading: {
    padding: "20px",
    fontSize: "18px",
    color: "#555",
  },

  vendorCard: {
    background: "white",
    marginBottom: "18px",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  vendorName: {
    fontSize: "18px",
    margin: 0,
  },

  viewBtn: {
    padding: "6px 14px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
  },

  detailsBox: {
    marginTop: "15px",
    padding: "18px",
    background: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
  },

  infoText: {
    margin: "6px 0",
    fontSize: "14px",
    color: "#374151",
  },

  shopImage: {
    width: "110px",
    height: "110px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  statusRow: {
    marginTop: "15px",
  },

  statusBadge: {
    padding: "6px 14px",
    fontSize: "13px",
    borderRadius: "8px",
    fontWeight: "600",
  },
};