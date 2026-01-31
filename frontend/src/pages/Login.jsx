import { useFormik } from "formik";
import { useContext } from "react";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
    const navigate = useNavigate();
    const { handleLogin } = useContext(UserContext);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validate: (values) => {
            const errors = {};
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
            const success = await handleLogin(values, setFieldError);
            if (success) {
               resetForm();
            }
}
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

            {/* --- SPACED GROCERIES --- */}
            {/* Top Left: Cookie */}
            <img src="https://pngimg.com/uploads/cookie/cookie_PNG13656.png" className="moving-grocery" style={{ top: '5%', left: '5%', width: '70px', animationDelay: '0s' }} alt="cookie"/>
            
            {/* Top Right: Orange */}
            <img src="https://pngimg.com/uploads/orange/orange_PNG780.png" className="moving-grocery" style={{ top: '5%', right: '5%', width: '75px', animationDelay: '2s' }} alt="orange"/>

            {/* Middle Left: Tomato */}
            <img src="https://pngimg.com/uploads/tomato/tomato_PNG12589.png" className="moving-grocery" style={{ top: '35%', left: '4%', width: '65px', animationDelay: '4s' }} alt="tomato"/> 

            {/* Middle Right: Pineapple */}
            <img src="https://pngimg.com/uploads/pineapple/pineapple_PNG2731.png" className="moving-grocery" style={{ top: '35%', right: '4%', width: '80px', animationDelay: '3s' }} alt="pineapple"/>

            {/* Bottom Left: Apple */}
            <img src="https://pngimg.com/uploads/apple/apple_PNG12431.png" className="moving-grocery" style={{ bottom: '6%', left: '6%', width: '65px', animationDelay: '4s' }} alt="apple"/>

            {/* Bottom Right: Chocolate */}
            <img src="https://pngimg.com/uploads/chocolate/chocolate_PNG97164.png" className="moving-grocery" style={{ bottom: '8%', right: '6%', width: '100px', animationDelay: '0.5s' }} alt="chocolate"/>

            {/* Bottom Center: Watermelon */}
            <img src="https://pngimg.com/uploads/watermelon/watermelon_PNG2639.png" className="moving-grocery" style={{ bottom: '4%', left: '45%', width: '90px', animationDelay: '5s' }} alt="watermelon"/>

            {/* --- COMPACT LOGIN BOX --- */}
            <div style={styles.card}>
                <h2 style={{ fontSize: "24px", color: "#1a202c", marginBottom: "5px" }}>Welcome Back</h2>
                <p style={{ color: "#718096", fontSize: "13px", marginBottom: "20px" }}>Login to your account</p>

                <form onSubmit={formik.handleSubmit}>
                    <input 
                        type="text" 
                        name="email"
                        placeholder="Email Address" 
                        style={styles.input} 
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    { formik.touched.email && formik.errors.email && (
                        <p style={{ color: "red", fontSize: "15px", margin: "0" }}>{formik.errors.email}</p>
                    )}

                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        style={styles.input} 
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p style={{ color: "red", fontSize: "15px", margin: "0" }}>{formik.errors.password}</p>
                    )}

                    <button type="submit" style={styles.btn}>LOGIN</button>

                    <p style={{ marginTop: "15px", fontSize: "13px", color: "#4a5568" }}>
                        New here? 
                        <span onClick={() => navigate("/register")} style={{ color: "#ff0040", cursor: "pointer", fontWeight: "bold", marginLeft: "4px" }}>
                            Create Account
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}