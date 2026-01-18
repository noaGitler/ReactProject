//:דף אלבומים
//גלריה אישית המציגה אלבומים לפי משתמש
// עם אפשרות לחיפוש מהיר ויצירת אלבומים חדשים

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import useFetch from '../../hooks/useFetch';
import useFilterAndSort from '../../hooks/useFilterAndSort';
import CustomAlert from '../../components/Cmmon/CustomAlert';
import './AlbumsPage.css';

const AlbumsPage = () => {
    const { user } = useContext(UserContext);
    const BASE_URL = 'http://localhost:3000';

    // שליפת אלבומים לפי המשתמש המחובר
    const { data: albums, isLoading: loading, error, addItem } = useFetch(`${BASE_URL}/albums?userId=${user?.id}`);

    // שימוש ב-Hook הסינון והמיון
    const {
        filteredAndSortedData,
        setSearchQuery,
        setSortBy
    } = useFilterAndSort(albums || []);

    // ניהול מצב המודאל (אלרט וקלט)
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info");
    const [showInput, setShowInput] = useState(false); // האם להציג שדה קלט במודאל
    const [inputValue, setInputValue] = useState(""); // ערך הטקסט שהוזן במודאל

    // פתיחת המודאל להזנת שם אלבום חדש
    const handleOpenAddModal = () => {
        setAlertMessage("Enter Album's Name");
        setInputValue(""); 
        setShowInput(true); // מציין למודאל להציג input
        setAlertType("info");
        setIsAlertOpen(true);
    };

    // ביצוע ההוספה בפועל לאחר אישור במודאל
    const handleConfirmAdd = async () => {
        if (!inputValue || !inputValue.trim()) return;

        try {
            await addItem({
                userId: user.id,
                title: inputValue.trim()
            });
            
            // שינוי מצב המודאל להודעת הצלחה
            setShowInput(false);
            setAlertMessage("The album was created successfully!");
            setAlertType("success");
            // המודאל נשאר פתוח עם הודעת ההצלחה
        } catch (err) {
            console.error("Add failed:", err);
            setShowInput(false);
            setAlertMessage("Oops! We couldn't create the album.");
            setAlertType("error");
        }
    };

    if (loading) return <div className="loading">Loading Albums...</div>;
    if (error) return <div className="error">Error loading albums from server.</div>;
    if (!user) return <div className="error">Please log in to view albums.</div>;

    return (
        <div className="albums-container">
            <header className="page-header">
                <h2>My Albums</h2>

                <div className="controls-card">
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />

                    <select onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                        <option value="id">ID</option>
                        <option value="title">Title</option>
                    </select>

                    <button className="add-btn" onClick={handleOpenAddModal}>
                        + New Album
                    </button>
                </div>
            </header>

            <div className="albums-grid">
                {filteredAndSortedData?.map(album => (
                    <Link to={`${album.id}/photos`} key={album.id} className="album-card">
                        <div className="album-id-badge">
                            {album.id.toString().includes('-') ? album.id.split('-').pop() : album.id}
                        </div>
                        <h3 className="album-title">{album.title}</h3>
                    </Link>
                ))}
            </div>

            {/* הקומפוננטה הגנרית שתומכת גם בהודעות וגם בקלט */}
            <CustomAlert
                isOpen={isAlertOpen}
                message={alertMessage}
                type={alertType}
                showInput={showInput}
                value={inputValue}
                setValue={setInputValue}
                onConfirm={showInput ? handleConfirmAdd : null}
                onClose={() => setIsAlertOpen(false)}
            />
        </div>
    );
};

export default AlbumsPage;
