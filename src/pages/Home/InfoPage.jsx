//דף מידע אישי

import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import './InfoPage.css';

function InfoPage() {
    const { user } = useContext(UserContext);

    if (!user) return <div className="loading">Loading...</div>;

    return (
        <div className="info-container">
            <div className="info-layout">
                <div className="info-card profile-card">
                    <div className="avatar-circle">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h2 className="display-name">{user.name}</h2>
                    <span className="username-badge">@{user.username}</span>
                </div>

                <div className="info-card details-card">
                    <h3 className="card-title">Personal Details</h3>
                    
                    <div className="details-list">
                        <div className="info-pill">
                            <span className="pill-label">EMAIL</span>
                            <span className="pill-value">{user.email}</span>
                        </div>

                        <div className="info-pill">
                            <span className="pill-label">PHONE</span>
                            <span className="pill-value">{user.phone}</span>
                        </div>

                        <div className="info-pill">
                            <span className="pill-label">LOCATION</span>
                            <span className="pill-value">{user.address?.city}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoPage;