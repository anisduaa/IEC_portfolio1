// Logout.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any necessary actions for logging out (e.g., clearing tokens, etc.)
    // For example, if you're using JWT, you might clear the token from localStorage.

    // After performing logout actions, navigate to the homepage
    navigate('/');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
