//:עמוד רישום ראשוני
//תהליך דו-שלבי להקמת חשבון חדש הכולל 
//בחירת פרטי גישה והזנת פרטים אישיים שנשמרים בבסיס הנתונים

import React, { useState, useContext } from "react"; // הוספת useContext
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext"; // ייבוא הקונטקסט
import "../Login/Login.css";

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // שליפת פונקציית הבדיקה מהקונטקסט
    const { checkUsernameAvailability } = useContext(UserContext);

    const cleanUsername = username.trim();

    const handleNextStep = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError("Password is too short - minimum 6 characters");
            return;
        }

        if (password !== verifyPassword) {
            setError("The passwords do not match");
            return;
        }

        try {
            const isAvailable = await checkUsernameAvailability(cleanUsername);

            if (!isAvailable) {
                setError("The username already exists in the system");
            } else {
                const newUserFirstStep = { username: cleanUsername, password };

                // הסרה של נתונים ישנים אם היו קיימים
                localStorage.removeItem('tempUser');

                localStorage.setItem('tempUser', JSON.stringify(newUserFirstStep));
                navigate('/register-info');
            }
        } catch (error) {
            setError("Error connecting to server. Please try again later.");
        }
    };

    return (
        <div className="login-container">
            <h2>New User Registration</h2>
            <p className="step-indicator">Step 1 of 2: Account details</p>

            <form onSubmit={handleNextStep}>
                <input
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    required
                />

                {error && <p className="error-msg" style={{ color: '#800020' }}>{error}</p>}

                <button className="login-btn" type="submit">
                    Continue to personal details
                </button>
            </form>

            <p className="register-link">
                Already registered? <Link to="/login">Click here to login</Link>
            </p>
        </div>
    );
}

export default Register;

