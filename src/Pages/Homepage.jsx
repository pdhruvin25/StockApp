import React from "react";
import "../CSS/homepage.css";
import { BsInfinity } from "react-icons/bs";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <header>
      <div className="container header__container">
        <div className="header__wrapper">
        <div className="box">
          <div className="text__container">
            <h1 className="part1">
              Stock <span className="part2">Z</span>
            </h1>
          </div>
          <h5 className="slogan">
            Shaping Infinity <br /> One Investment At A Time
          </h5>
          <Link to="/stocks" className="signup">
          Begin Your Journey
        </Link>
        </div>

        </div>
      </div>
    </header>
  );
};

export default Homepage;
