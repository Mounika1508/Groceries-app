import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "./config/axios";
import "./App.css";

import PublicHome from "./pages/PublicHome";
import Register from "./pages/Register";
import Home from "./pages/Customer/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import VendorsList from "./pages/Admin/VendorsList";
import UsersList from "./pages/Admin/UsersList";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorForm from "./pages/vendor/VendorForm";
import AddCategory from "./pages/vendor/AddCategory";
import AddProduct from "./pages/vendor/AddProduct";
import VendorProfile from "./pages/vendor/VendorProfile";
import ShopsList from "./pages/Customer/ShopsList";
import CreateCustomer from "./pages/Customer/CreateCustomer";
import Profile from "./pages/Customer/Profile";
import ShopPage from "./pages/Customer/shopPage";
import CartPage from "./pages/Customer/CartPage";
import DboyCreate from "./pages/DeliveryBoy/DboyCreate";
import DboyProfile from "./pages/DeliveryBoy/DboyProfile";
import Checkout from "./pages/Customer/CheckOut";
import OrdersList from "./pages/vendor/OrdersList";
import DboyOrders from "./pages/DeliveryBoy/DboyOrders";
import AdminHome from "./pages/Admin/AdminHome";
import AdminOrders from "./pages/Admin/AdminOrders";
import DboyHome from "./pages/DeliveryBoy/DboyHome";

import { fetchCustomerProfile } from "./slices/customer-slice";
import { fetchDeliveryBoyProfile } from "./slices/dboy-slice";
import { fetchMyVendorProfile } from "./slices/vendor-slice";

import UserContext from "./context/UserContext";

export default function App() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, handleLogout, user } = useContext(UserContext);

  const { profile } = useSelector((state) => state.customer);
  const { vendor } = useSelector((state) => state.vendor);
  const { dboyProfile } = useSelector((state) => state.deliveryBoy);

  useEffect(() => {
    if (user?.role === "customer" && profile === null) {
      dispatch(fetchCustomerProfile());
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "deliveryboy") {
      dispatch(fetchDeliveryBoyProfile());
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "vendor") {
      dispatch(fetchMyVendorProfile());
    }
  }, [user]);

  return (
    <div style={{ margin: 0, padding: 0 }}>

      {/* NAVBAR */}
      <header className="top-nav">

        {/* LOGO */}
        <div className="logo-box">
          <Link to="/">
            <img
              src="/images/localmart-logo.png"
              alt="LocalMart"
              className="logo-img"
            />
          </Link>
        </div>

        <ul className="nav-list">

          {(isLoggedIn || localStorage.getItem("token")) && (
            <>

              {/* ADMIN */}
              {user?.role === "admin" && (
                <>
                  <li><Link to="/admin/home">Home</Link></li>
                  <li><Link to="/admin/vendorsList">Shops</Link></li>
                  <li><Link to="/admin/users">All Users</Link></li>
                </>
              )}

              {/* VENDOR */}
              {user?.role === "vendor" && (
                <>
                  {!vendor && (
                    <li>
                      <Link to="/vendor/createShop">VendorForm</Link>
                    </li>
                  )}
                  <li><Link to="/vendor/dashboard">Dashboard</Link></li>
                  <li><Link to="/vendor/orders">Orders</Link></li>
                </>
              )}

              {/* CUSTOMER */}
              {user?.role === "customer" && (
                <>
                  {!profile && (
                    <li>
                      <Link to="/customer/createProfile">
                        Create Profile
                      </Link>
                    </li>
                  )}

                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shops">Shops Near You</Link></li>
                  <li><Link to="/cart">My Cart</Link></li>
                </>
              )}

              {/* DELIVERY BOY */}
              {user?.role === "deliveryboy" && (
                <>
                  <li><Link to="/deliveryboy/home">Home</Link></li>

                  {!dboyProfile && (
                    <li>
                      <Link to="/deliveryboy/create">
                        Create Profile
                      </Link>
                    </li>
                  )}

                  <li><Link to="/deliveryboy/profile">My Profile</Link></li>
                  <li><Link to="/deliveryboy/orders">My Orders</Link></li>
                </>
              )}

              <li>
                <Link to="/login" onClick={() => handleLogout()}>
                  Logout
                </Link>
              </li>

            </>
          )}

          {!isLoggedIn && !localStorage.getItem("token") && (
            <>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}

        </ul>
      </header>

      {/* MAIN CONTENT */}
      <div className="main-content">

        <Routes>

          <Route path="/home" element={<PublicHome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* ADMIN */}
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/approveVendors" element={<AdminDashboard />} />
          <Route path="/admin/vendorsList" element={<VendorsList />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/orders" element={<AdminOrders />} />

          {/* VENDOR */}
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/createShop" element={<VendorForm />} />
          <Route path="/vendor/addCategory" element={<AddCategory />} />
          <Route path="/vendor/addProduct" element={<AddProduct />} />
          <Route path="/vendor/orders" element={<OrdersList />} />
          <Route path="/vendor/profile" element={<VendorProfile />} />

          {/* CUSTOMER */}
          <Route path="/" element={<Home />} />
          <Route path="/customer/createProfile" element={<CreateCustomer />} />
          <Route path="/customer/profile" element={<Profile />} />
          <Route path="/shops" element={<ShopsList />} />
          <Route path="/shop/:vendorId" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* DELIVERY */}
          <Route path="/deliveryboy/home" element={<DboyHome />} />
          <Route path="/deliveryboy/create" element={<DboyCreate />} />
          <Route path="/deliveryboy/profile" element={<DboyProfile />} />
          <Route path="/deliveryboy/orders" element={<DboyOrders />} />

        </Routes>

      </div>

    </div>
  );
}