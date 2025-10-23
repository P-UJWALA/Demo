import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

// Example async function for backend login
// (Replace this with your real API call)
const loginUser = async (user) => {
  // simulate API response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: "fake-jwt-token",
        user: { email: user.email, role: "producer" } // sample role
      });
    }, 1000);
  });
};

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (user.email && user.password) {
      setIsLoading(true);
      try {
        const response = await loginUser(user);
        setIsLoading(false);

        // Save user details
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Navigate based on role
        const { role } = response.user;
        if (role === 'producer') navigate('/producer-dashboard');
        else if (role === 'market') navigate('/market-dashboard');
        else if (role === 'retail') navigate('/retail-dashboard');
        else if (role === 'consumer') navigate('/consumer-dashboard');
        else if (role === 'admin') navigate('/admin-dashboard');
        else alert('Invalid user role');
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        alert('Login failed');
      }
    } else {
      alert("⚠️ Please enter email and password");
    }
  };

  return (
    <div style={{
      padding: "2rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh"
    }}>
      <div className="glass-card bounce-in" style={{
        maxWidth: "400px",
        width: "100%",
        textAlign: "center"
      }}>
        <h2 style={{
          color: "white",
          marginBottom: "2rem",
          fontSize: "2rem"
        }}>🔐 Welcome Back</h2>

        <div style={{ marginBottom: "1.5rem" }}>
          <input
            className="modern-input"
            placeholder="📧 Email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <input
            className="modern-input"
            placeholder="🔒 Password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>

        <button
          className={`modern-btn ${isLoading ? 'loading' : ''}`}
          onClick={handleLogin}
          disabled={isLoading}
          style={{ width: "100%", fontSize: "1.1rem" }}
        >
          {isLoading ? "🔄 Logging in..." : "🚀 Login"}
        </button>

        <p style={{
          color: "rgba(255,255,255,0.8)",
          marginTop: "1rem"
        }}>
          Don't have an account?{" "}
          <a href="/register" style={{
            color: "#4ECDC4",
            textDecoration: "none"
          }}>Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
