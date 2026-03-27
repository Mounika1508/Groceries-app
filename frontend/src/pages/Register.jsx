import { useContext } from "react";
import UserContext from "../context/UserContext";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

export default function Register(props) {
    const navigate = useNavigate();
    const { handleRegister } = useContext(UserContext);

    const formik = useFormik({
        initialValues: { username: '', email: '', password: '', role: "customer" },
        validate: (values) => {
            const errors = {};
            if (!values.username.trim()) {
        errors.username = "Username is required";
      } else if (values.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
      }

      if (!values.email.trim()) {
        errors.email = "Email is required";
      } else if (!values.email.includes("@")) {
        errors.email = "Invalid email format";
      }

      if (!values.password.trim()) {
        errors.password = "Password is required";
      } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }

      return errors;
    },
        onSubmit: async (values, { setFieldError, resetForm }) => {
            const success = await handleRegister(values, setFieldError);
            if (success) resetForm();
        },
    });

    const injectStyles = `
        @keyframes floatFar {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-25px) rotate(10deg); }
        }
        .moving-grocery {
            position: absolute;
            z-index: 1;
            filter: drop-shadow(0 12px 18px rgba(0,0,0,0.06));
            animation: floatFar 7s ease-in-out infinite;
        }
    `;

    const styles = {
        container: {
            height: "100vh", width: "100vw", display: "flex", justifyContent: "center",
            alignItems: "center", backgroundColor: "#f9fbff", position: "relative", overflow: "hidden", margin: 0
        },
        card: {
            backgroundColor: "#ffffff", padding: "30px", borderRadius: "25px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.04)", width: "300px", zIndex: 10, textAlign: "center",
            border: "1px solid #f0f4f8"
        },
        input: {
            width: "100%", padding: "12px", margin: "8px 0", borderRadius: "10px",
            border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box", outline: "none"
        },
        btn: {
            width: "100%", padding: "12px", backgroundColor: "#ff0040", color: "#fff",
            border: "none", borderRadius: "20px", fontWeight: "bold", cursor: "pointer", 
            marginTop: "12px", fontSize: "15px", boxShadow: "0 8px 16px rgba(255, 0, 64, 0.2)"
        }
    };

    return (
        <div style={styles.container}>
            <style>{injectStyles}</style>

            {/* --- TOP SECTION (Items pushed to far corners) --- */}
            <img src="https://pngimg.com/uploads/cookie/cookie_PNG13656.png" className="moving-grocery" style={{ top: '4%', left: '4%', width: '70px', animationDelay: '0s' }} alt="cookie"/>
            <img src="https://pngimg.com/uploads/tomato/tomato_PNG12589.png" className="moving-grocery" style={{ top: '2%', left: '45%', width: '65px', animationDelay: '2s' }} alt="tomato"/>
            <img src="https://pngimg.com/uploads/orange/orange_PNG780.png" className="moving-grocery" style={{ top: '4%', right: '4%', width: '75px', animationDelay: '4s' }} alt="orange"/>

            {/* --- MIDDLE SECTION (Items far left and right) --- */}
            <img src="https://pngimg.com/uploads/banana/banana_PNG842.png" className="moving-grocery" style={{ top: '45%', left: '3%', width: '80px', animationDelay: '1s' }} alt="banana"/>
            <img src="https://pngimg.com/uploads/pineapple/pineapple_PNG2731.png" className="moving-grocery" style={{ top: '40%', right: '3%', width: '80px', animationDelay: '3s' }} alt="pineapple"/>

            {/* --- BOTTOM SECTION (Distributed far across the base) --- */}
            <img src="https://pngimg.com/uploads/apple/apple_PNG12431.png" className="moving-grocery" style={{ bottom: '4%', left: '5%', width: '60px', animationDelay: '1.5s' }} alt="apple"/>
            <img src="https://pngimg.com/uploads/corn/corn_PNG5285.png" className="moving-grocery" style={{ bottom: '15%', left: '25%', width: '75px', animationDelay: '5s' }} alt="corn"/>
            <img src="https://pngimg.com/uploads/watermelon/watermelon_PNG2639.png" className="moving-grocery" style={{ bottom: '3%', right: '40%', width: '90px', animationDelay: '0.5s' }} alt="watermelon"/>
            <img src="https://pngimg.com/uploads/chocolate/chocolate_PNG97164.png" className="moving-grocery" style={{ bottom: '12%', right: '4%', width: '100px', animationDelay: '2.5s' }} alt="chocolate"/>
            <img src="https://pngimg.com/uploads/carrot/carrot_PNG4985.png" className="moving-grocery" style={{ top: '25%', right: '20%', width: '80px' }} alt="carrot"/>
            {/* --- SMALLER MIDDLE BOX --- */}
            <div style={styles.card}>
                <h2 style={{ fontSize: "24px", color: "#1a202c", marginBottom: "5px" }}>Sign Up</h2>
                <p style={{ color: "#718096", fontSize: "13px", marginBottom: "20px" }}>Quick & Fresh Delivery</p>

                <form onSubmit={formik.handleSubmit}>
                    <input type="text" placeholder="Username" style={styles.input} {...formik.getFieldProps('username')} />
                    {formik.touched.username && formik.errors.username && (<p style={{ color: "red", fontSize: "15px", margin: "0" }}>{formik.errors.username}</p>)}

                    <input type="email" placeholder="Email" style={styles.input} {...formik.getFieldProps('email')} />
                    {formik.touched.email && formik.errors.email && (<p style={{ color: "red", fontSize: "15px", margin: "0" }}>{formik.errors.email}</p>)}

                    <input type="password" placeholder="Password" style={styles.input} {...formik.getFieldProps('password')} />
                    {formik.touched.password && formik.errors.password && (<p style={{ color: "red", fontSize: "15px", margin: "0" }}>{formik.errors.password}</p>)}

                    <select style={styles.input} {...formik.getFieldProps('role')}>
                        <option value="customer">Customer</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                        <option value="deliveryboy">Delivery Boy</option>
                    </select>
                    {formik.touched.role && formik.errors.role && (<p style={{ color: "red", fontSize: "15px", margin: "0" }}>{formik.errors.role}</p>)}

                    <button type="submit" style={styles.btn}>REGISTER</button>

                    <p style={{ marginTop: "15px", fontSize: "13px", color: "#4a5568" }}>
                        Already have an account? 
                        <span onClick={() => navigate("/login")} style={{ color: "#ff0040", cursor: "pointer", fontWeight: "bold", marginLeft: "4px" }}>
                            Log In
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}