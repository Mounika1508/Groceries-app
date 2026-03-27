import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listVendors } from "../../slices/vendor-slice";
import { fetchCustomerProfile } from "../../slices/customer-slice";
import { Link } from "react-router-dom";

const ShopsList = () => {
  const dispatch = useDispatch();
  const { vendors, loading, error } = useSelector((state) => state.vendor);
  const { profile } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(fetchCustomerProfile());
    dispatch(listVendors());
  }, [dispatch]);

  const filteredVendors = vendors.filter((shop) => {
    return (
      shop.isApproved === true &&
      shop.city?.toLowerCase().trim() === profile?.city?.toLowerCase().trim()
    );
  });

  return (
    <div
      style={{
        width: "100vw",
        marginLeft: "0",
        paddingLeft: "30px",
        textAlign: "left",
        marginTop: "70px",   
        paddingTop: "0" 
      }}
    >
      {/* TITLE */}
      <h2 style={{ marginBottom: "5px" }}>Shops Near You</h2>

      {profile && (
        <p style={{ marginBottom: "20px" }}>
          Delivering to: <strong>{profile.city}</strong>
        </p>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {filteredVendors.length === 0 ? (
        <p>No shops found in your area</p>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            marginTop: "10px",
          }}
        >
          {filteredVendors.map((shop) => (
            <Link
              key={shop._id}
              to={`/shop/${shop._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div
                style={{
                  width: "150px",
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #eee",
                  padding: "12px",
                  textAlign: "center",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                }}
              >
                <img
                  src={shop.image}
                  width="110"
                  height="110"
                  style={{
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />

                <h4
                  style={{
                    fontSize: "14px",
                    margin: 0,
                    fontWeight: "600",
                  }}
                >
                  {shop.shopName}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopsList;
