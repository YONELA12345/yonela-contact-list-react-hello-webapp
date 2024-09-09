import React from "react";
import "../../styles/navbar.css";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar custom-navbar mb-3">
            <Link to="/">
                <span className="navbar-brand mb-0 h1">Contact List</span>
            </Link>
        </nav>
    );
};
