import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchPendingVendors, approveVendor, rejectVendor} from "../../slices/admin-slice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { pendingVendors, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPendingVendors());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveVendor(id));
    alert("Vendor approved successfully!");
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this vendor?")) {
      dispatch(rejectVendor(id));
    }
  };

  if (loading) {
    return <h3>Loading pending vendors...</h3>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pending Vendor Approvals</h2>

      {pendingVendors.length === 0 ? (
        <p>No pending vendors 🎉</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>City</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingVendors.map((vendor) => (
              <tr key={vendor._id}>
                <td>{vendor.shopName}</td>
                <td>{vendor.city}</td>
                <td>{vendor.phone}</td>
                <td>{vendor.userId?.email}</td>
                <td>
                  {vendor.image ? (
                    <img
                      src={vendor.image}
                      alt="shop"
                      width="80"
                      height="60"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <button onClick={() => handleApprove(vendor._id)}>
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(vendor._id)}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
