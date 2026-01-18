//:עמוד כניסה
//מאפשר למשתמשים קיימים להתחבר למערכת על 
//ידי אימות שם משתמש וסיסמה מול השרת

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.success) {
            navigate('/home');
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="login-container"> 
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button className="login-btn" type="submit">Enter</button>
            </form>
            <p className="register-link"> Not registered? <Link to="/register">Click here</Link></p>
        </div>
    );
}
export default Login;
