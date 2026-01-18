//תפריט ניווט

import React, { useContext } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const { user, logout, isLoading } = useContext(UserContext);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <nav className="navbar">
            <Link to="/home" className="logo-link">
                <div className="logo">
                    Admin<span>X</span>
                </div>
            </Link>

            <div className="nav-links">
                <NavLink to="/home/todos" className={({ isActive }) => isActive ? "active-link" : ""}>todos</NavLink>
                <NavLink to="/home/posts" className={({ isActive }) => isActive ? "active-link" : ""}>Posts</NavLink>
                <NavLink to="/home/albums" className={({ isActive }) => isActive ? "active-link" : ""}>Albums</NavLink>
                <NavLink to="/home/info" className={({ isActive }) => isActive ? "active-link" : ""}>Personal information</NavLink>
            </div>

            {/* נציג את פרטי המשתמש רק אם הוא קיים וסיים להיטען */}
            {!isLoading && user && (
                <div className="user-profile">
                    <div className="user-avatar">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="welcome-msg">{user?.name}</span> 
                    <button onClick={handleLogout} className="logout-icon-btn" title="exit">
                        <span className="exit-symbol">➔</span>
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;