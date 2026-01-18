//המשך התחברות

import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "../Login/Login.css"; 

function RegisterInfo() {
    const [details, setDetails] = useState({ fullName: '', email: '', city: '', street: '', phone: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useContext(UserContext);

    // הגנה: אם משתמש מגיע לדף הזה ישירות בלי tempUser, נחזיר אותו להתחלה
    useEffect(() => {
        const tempUser = localStorage.getItem('tempUser');
        if (!tempUser) {
            navigate('/register');
        }
    }, [navigate]);

    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        setError('');

        // אימות שם מלא
        if (!details.fullName.trim().includes(' ')) {
            setError("Full name must include first and last name");
            return;
        }

        try {
            const tempUser = JSON.parse(localStorage.getItem('tempUser'));
            const result = await register(tempUser, details);
            
            if (result.success) { 
                // ניקוי הנתונים הזמניים לאחר הצלחה
                localStorage.removeItem('tempUser');
                navigate('/home');
            } else {
                setError(result.message || "Registration failed");
            }
        } catch (err) {
            setError("Connection error. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <h2>Completing Registration</h2>
            <p className="step-indicator">Step 2 of 2: Personal details</p>
            
            <form onSubmit={handleCompleteRegistration}>
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={details.fullName}
                    onChange={(e) => setDetails({...details, fullName: e.target.value})} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={details.email}
                    onChange={(e) => setDetails({...details, email: e.target.value})} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="City" 
                    value={details.city}
                    onChange={(e) => setDetails({...details, city: e.target.value})} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Street" 
                    value={details.street}
                    onChange={(e) => setDetails({...details, street: e.target.value})} 
                    required 
                />
                <input 
                    type="tel" 
                    placeholder="Phone" 
                    value={details.phone}
                    onChange={(e) => setDetails({...details, phone: e.target.value})} 
                    required 
                />
                
                {error && <p className="error-msg" style={{ color: '#800020' }}>{error}</p>}
                
                <button className="login-btn" type="submit">
                    Complete and Login
                </button>
            </form>
        </div>
    );
}

export default RegisterInfo;

