import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ added useNavigate

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ navigation hook

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.message}`);
        console.log('Logged in:', data.user);

        // Optional: Store user in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Clear form
        setFormData({ email: '', password: '' });

        // ✅ Redirect to homepage
        navigate('/');
      } else {
        alert(`⚠️ ${data.message}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('❌ Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        <p>
          <Link to="/">🏠 Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
