import React from "react";

import "./Home.scss";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <div className="title-container">
        <h1 className="title">
          Harry Potter's <br />
          The Invisible Cloak
        </h1>
      </div>
      <Link to="/app" style={{ textDecoration: "none" }}>
        <h3 className="animated-try">Try it</h3>
      </Link>
    </div>
  );
};

export default Home;
