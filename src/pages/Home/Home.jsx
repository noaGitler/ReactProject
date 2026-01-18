// :דף הבית
// משמש כמרכז בקרה אישי המציג הודעת וולקם דינמית
// ומנווט לשאר חלקי המערכת
import React, { useEffect, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Navbar from "../../components/Cmmon/Navbar";
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoading } = useContext(UserContext);
    const isDefaultPage = location.pathname === '/home' || location.pathname === '/home/';

    useEffect(() => {
        // רק אם סיימנו לטעון ואין משתמש, נעביר ללוגין
        if (!isLoading && !user) {
            navigate('/login');
        }
    }, [user, isLoading, navigate]);

    // בזמן שה-ID נשלח לשרת לקבלת פרטי המשתמש המלאים, נציג מסך טעינה קצר
    if (isLoading) {
        return <div className="loading-screen">Verifying session...</div>;
    }

    return (
        <div className="home-page">
            <Navbar />
            <main className="content-area">
                {isDefaultPage ? (
                    <div className="welcome-hero">
                        <div className="hero-content">
                            <div className="hero-logo">
                                Admin<span>X</span>
                            </div>
                             {/* הצגת שם המשתמש העדכני שהגיע מהשרת */}
                            <h1>Welcome back, {user?.name || 'Guest'}</h1>
                            <p>
                                Welcome to your personal control center. Manage your tasks, albums, and
                                publications through a single smart, sleek, and fast interface. We believe that data
                                management should be simple, intuitive, and engaging.
                            </p>
                            <div className="hero-divider"></div>
                            <p className="hero-footer">Select an option from the top menu to get started</p>
                        </div>
                    </div>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
}

export default Home;