//משמש את המערכת להצגת הודעות אישור, שגיאה, או קבלת קלט מהמשתמש
import React from 'react';
import './CustomAlert.css';

const CustomAlert = ({ isOpen, message, onClose, onConfirm, showInput, value, setValue, type = 'info' }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-accent"></div>
                <div className="modal-content-wrapper">
                    <p className="modal-message">{message}</p>
                    
                    {showInput && (
                        <input 
                            type="text" 
                            className="modal-input" 
                            value={value} 
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Type here..."
                            autoFocus
                        />
                    )}

                    <div className="modal-actions">
                        {showInput ? (
                            <>
                                <button className="modal-btn primary" onClick={onConfirm}>Confirm</button>
                                <button className="modal-btn secondary" onClick={onClose}>Cancel</button>
                            </>
                        ) : (
                            <button className="modal-btn primary" onClick={onClose}>I Understand</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;