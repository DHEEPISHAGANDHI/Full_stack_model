// import React from 'react';
// import './styles.css';

// const Login = () => {
//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         <h2>Login</h2>
//         <input type="email" placeholder="Email" />
//         <input type="password" placeholder="Password" />
//         <button>Login</button>
//         <p>
//           Don't have an account? <a href="/signup">Sign Up</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    alert('Login functionality would be implemented here!');
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
          <button type="submit">Login</button>
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