import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listCategories } from "../../slices/category-slice";
import { listProducts } from "../../slices/product-slice";
import { getVendorOrders } from "../../slices/order-slice";

import { Link, useNavigate } from "react-router-dom";

import {
  FaListAlt,
  FaBoxOpen,
  FaShoppingBag,
  FaClock,
  FaPlus,
  FaUserCircle,
  FaRupeeSign,
  FaCheckCircle,
} from "react-icons/fa";

export default function VendorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const vendor = JSON.parse(localStorage.getItem("vendor")) || {};

  const { categories } = useSelector((state) => state.category);
  const { products } = useSelector((state) => state.product);
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(listCategories());
    dispatch(listProducts());
    dispatch(getVendorOrders());
  }, [dispatch]);

  const pendingOrders = orders.filter(
    (o) => o.status === "placed" || o.status === "packing"
  ).length;

  const deliveredOrdersToday = orders.filter(
    (o) =>
      o.status === "delivered" &&
      new Date(o.deliveredAt).toDateString() === new Date().toDateString()
  ).length;

  const todayEarnings = orders
    .filter(
      (o) =>
        o.status === "delivered" &&
        new Date(o.deliveredAt).toDateString() === new Date().toDateString()
    )
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <>
      {/* ---------- INLINE CSS ---------- */}
      <style>{`
        .vendor-dashboard {
            padding: 35px;
            background: #F7F7F8; /* light grey modern */
            min-height: 100vh;
            }

            /* HEADER */
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 35px;    /* pushes profile to clean right edge */
                margin-top: -20px;      /* adjusts spacing visually */
            }

            .profile-icon {
                font-size: 28px;     /* smaller */
                color: #1A1A1A;
                cursor: pointer;
                transition: 0.2s;
            }

            .profile-icon:hover {
                transform: scale(1.1);
            }
            .actions-row {
            display: flex;
            gap: 20px;
            margin: 25px 0;
            }

            .action-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #2563EB; /* Blue Button */
            color: white;
            padding: 12px 22px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 15px;
            box-shadow: 0px 4px 10px rgba(37, 99, 235, 0.25);
            transition: 0.25s ease;
            }

            .action-btn:hover {
            background: #1D4ED8; /* Darker Blue */
            transform: translateY(-3px);
            }

            /* STATS CARDS */
            .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-top: 15px;
            }

            .stat-card {
            background: white;
            border-left: 6px solid #FC8019; /* orange border */
            padding: 22px;
            border-radius: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: 0.25s ease;
            box-shadow: 0px 8px 18px rgba(0,0,0,0.06);
            }

            .stat-card:hover {
            background: #FFF4E8;
            transform: translateY(-4px);
            }

            .stat-label {
            font-size: 15px;
            color: #4B5563; /* medium grey */
            }

            .stat-value {
            font-size: 34px;
            font-weight: 900;
            color: #1A1A1A;
            }

            .stat-icon {
            font-size: 32px; /* smaller */
            color: #475569; /* slate grey */
            }

            /* SUMMARY SECTION */
            .summary-title {
            font-size: 22px;
            font-weight: 900;
            margin-top: 40px;
            margin-bottom: 15px;
            color: #1A1A1A;
            }

            .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            }

            /* SUMMARY CARD 1 (ORANGE LIGHT) */
            .summary-card {
            padding: 20px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            gap: 20px;
            box-shadow: 0px 5px 15px rgba(0,0,0,0.06);
            }

            .summary-orange {
            background: #FFF2E5;
            }

            /* SUMMARY CARD 2 (PURPLE LIGHT) */
            .summary-purple {
            background: #F5E8FF;
            }

            .summary-icon {
            font-size: 28px;
            color: #475569; /* slate grey */
            }

            .summary-value {
            font-size: 26px;
            font-weight: 900;
            color: #1A1A1A;
            }

            .summary-label {
            font-size: 14px;
            font-weight: 600;
            color: #4B5563;
            }

            /* TABLE */
            table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0px 8px 20px rgba(0,0,0,0.06);
            }

            th {
            padding: 14px;
            background: #F3F4F6;
            color: #1A1A1A;
            text-align: left;
            font-weight: 700;
            }

            td {
            padding: 12px 14px;
            border-bottom: 1px solid #E5E7EB;
            color: #374151;
            }

            tr:hover {
            background: #F8FAFC;
            }

            .table-title {
  font-size: 20px !important;
  font-weight: 800 !important;
  color: #1A1A1A !important;   /* deep dark */
  margin: 18px 0 !important;
  letter-spacing: 0.3px;
}
            

      `}</style>

      <div className="vendor-dashboard">

        {/* HEADER */}
        <div className="dashboard-header">
          <h2 className="dashboard-title">Vendor Dashboard</h2>

          <FaUserCircle
            className="profile-icon"
            onClick={() => navigate(`/vendor/profile`)}
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="actions-row">
          <Link className="action-btn" to="/vendor/addCategory">
            <FaPlus /> Add Category
          </Link>

          <Link className="action-btn" to="/vendor/addProduct">
            <FaPlus /> Add Product
          </Link>

          <Link className="action-btn" to="/vendor/orders">
            <FaShoppingBag /> View Orders
          </Link>
        </div>

        {/* STATS CARDS */}
        <div className="cards-grid">

          <div className="stat-card">
            <div>
              <div className="stat-label">Total Categories</div>
              <div className="stat-value">{categories.length}</div>
            </div>
            <FaListAlt className="stat-icon" />
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Total Products</div>
              <div className="stat-value">{products.length}</div>
            </div>
            <FaBoxOpen className="stat-icon" />
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Total Orders</div>
              <div className="stat-value">{orders.length}</div>
            </div>
            <FaShoppingBag className="stat-icon" />
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Pending Orders</div>
              <div className="stat-value">{pendingOrders}</div>
            </div>
            <FaClock className="stat-icon" />
          </div>

        </div>

        {/* TODAY SUMMARY */}
        <div className="summary-section">
          <div className="summary-title">Today's Summary</div>

          <div className="summary-grid">

            <div className="summary-card summary-orange">
              <FaCheckCircle className="summary-icon" />
              <div>
                <div className="summary-value">{deliveredOrdersToday}</div>
                <div className="summary-label">Delivered Today</div>
              </div>
            </div>

            <div className="summary-card summary-purple">
              <FaRupeeSign className="summary-icon" />
              <div>
                <div className="summary-value">₹{todayEarnings}</div>
                <div className="summary-label">Earnings Today</div>
              </div>
            </div>

          </div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="recent-orders">
          <div className="table-title">Recent Orders</div>

          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-6).toUpperCase()}</td>
                  <td>₹{o.totalAmount}</td>
                  <td>{o.status}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
}