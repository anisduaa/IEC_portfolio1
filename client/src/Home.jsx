// Homepage.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div>
      <h2>Welcome to the Homepage</h2>
      {/* Add any content you want to display on the homepage */}
      <Link to="/logout">Logout</Link>
    </div>
  );
}

export default Homepage;
