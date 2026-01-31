import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "../config/axios";
import UserContext from "../context/UserContext";

export default function Admin() {
	const { user, isLoggedIn } = useContext(UserContext);
	const [vendors, setVendors] = useState([]);
	const [loading, setLoading] = useState(true);
	const token = localStorage.getItem("token");

	useEffect(() => {
		if (!token) {
			setLoading(false);
			return;
		}
		fetchVendors();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function fetchVendors() {
		setLoading(true);
		try {
			const res = await axios.get("/admin/pendingVendors", { headers: { Authorization: token } });
			setVendors(res.data || []);
		} catch (err) {
			console.error(err);
			alert(err?.response?.data?.error || "Failed to load vendors.");
		} finally {
			setLoading(false);
		}
	}

	async function approveVendor(vendorId) {
		if (!confirm("Approve this vendor?")) return;
		try {
			const res = await axios.put(`/admin/approveVendor/${vendorId}`, {}, { headers: { Authorization: token } });
			setVendors((prev) => prev.map((v) => (v._id === vendorId ? { ...v, isApproved: true } : v)));
			alert(res?.data?.error || "Vendor approved");
		} catch (err) {
			console.error(err);
			alert(err?.response?.data?.error || "Approve failed");
		}
	}

	if (!isLoggedIn && !token) return <Navigate to="/login" />;
	if (!user) return <p>Loading user...</p>;
	if (user.role !== "admin") return <Navigate to="/" />;

	return (
		<div style={{ padding: 16 }}>
			<h2>Admin — Vendor Approvals</h2>
			{loading ? (
				<p>Loading vendors...</p>
			) : vendors.length === 0 ? (
				<p>No vendors found.</p>
			) : (
				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr>
							<th style={{ textAlign: "left", padding: 8 }}>Name</th>
							<th style={{ textAlign: "left", padding: 8 }}>Email</th>
							<th style={{ textAlign: "left", padding: 8 }}>Approved</th>
							<th style={{ textAlign: "left", padding: 8 }}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{vendors.map((v) => (
							<tr key={v._id}>
								<td style={{ padding: 8 }}>{v.username || v.name || "-"}</td>
								<td style={{ padding: 8 }}>{v.email || "-"}</td>
								<td style={{ padding: 8 }}>{v.isApproved ? "Yes" : "No"}</td>
								<td style={{ padding: 8 }}>
									{!v.isApproved && <button onClick={() => approveVendor(v._id)}>Approve</button>}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
