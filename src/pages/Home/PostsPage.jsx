//:דף פוסטים
//שיתוף תוכן שבה המשתמש יכול לנהל את הפוסטים שלו
//לצפות בפוסטים של אחרים ולהוסיף תגובות

import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import useFetch from '../../hooks/useFetch';
import useFilterAndSort from '../../hooks/useFilterAndSort';
import PostItem from '../../components/Posts/PostItem';
import CustomAlert from '../../components/Common/CustomAlert'; 
import './PostsPage.css';

function PostsPage() {
    const { user } = useContext(UserContext);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const BASE_URL = 'http://localhost:3000';

    //שליפת נתונים ושימוש בפונקציות ה-Hook
    const { data: posts, updateItem, deleteItem, addItem, isLoading: postsLoading } =
        useFetch(`${BASE_URL}/posts`);

    const { data: allUsers, isLoading: usersLoading } =
        useFetch(`${BASE_URL}/posts/users`);

    //סינון ומיון הנתונים
    const {
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        filteredAndSortedData
    } = useFilterAndSort(posts, ['title', 'id'], 'id');

    // מצבים לניהול המודאל המעוצב
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info");
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [pendingPostData, setPendingPostData] = useState({ title: "", body: "" });
    const [step, setStep] = useState(0); 

    // פתיחת המודאל להוספת פוסט
    const handleAddPostRequest = () => {
        setStep(1);
        setAlertMessage("Step 1: Enter post title");
        setInputValue("");
        setShowInput(true);
        setAlertType("info");
        setIsAlertOpen(true);
    };

    // ניהול שלבי ההזנה והשמירה בתוך המודאל
    const handleConfirmModal = async () => {
        if (step === 1) {
            // שמירת הכותרת ומעבר לשלב הזנת התוכן
            if (!inputValue.trim()) return;
            setPendingPostData({ ...pendingPostData, title: inputValue.trim() });
            setStep(2);
            setAlertMessage("Step 2: Enter post content");
            setInputValue(""); 
        } else if (step === 2) {
            // שמירת התוכן וביצוע הוספת הפוסט לשרת
            if (!inputValue.trim()) return;
            try {
                await addItem({
                    userId: user.id,
                    title: pendingPostData.title,
                    body: inputValue.trim()
                });
                // הודעת הצלחה סופית
                setShowInput(false);
                setAlertMessage("Post added successfully!");
                setAlertType("success");
                setStep(0); 
            } catch (err) {
                setAlertMessage("Error adding post.");
                setAlertType("error");
                setShowInput(false);
                setStep(0);
            }
        } else {
            // סגירת המודאל בהודעות אישור רגילות
            setIsAlertOpen(false);
        }
    };

    // מחיקת פוסט ותגובות עם הודעת אישור בסיום
    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post and all its comments?")) return;

        try {
            const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);
            const commentsToDelete = await response.json();

            const deleteCommentPromises = commentsToDelete.map(comment =>
                fetch(`${BASE_URL}/comments/${comment.id}`, { method: 'DELETE' })
            );

            await Promise.all(deleteCommentPromises);
            await deleteItem(postId);

            // הצגת הודעת הצלחה במודאל 
            setAlertMessage("Post and its comments deleted successfully");
            setAlertType("success");
            setShowInput(false);
            setStep(0);
            setIsAlertOpen(true);
        } catch (err) {
            setAlertMessage("Something went wrong during deletion.");
            setAlertType("error");
            setShowInput(false);
            setIsAlertOpen(true);
        }
    };

    if (postsLoading || usersLoading) return <h2 className="loading-msg">Loading...</h2>;
    if (!user) return <h2 className="error-msg">Please log in</h2>;

    const getUserName = (id) => {
        const found = allUsers?.find(u => String(u.id) === String(id));
        return found ? found.username : "Unknown";
    };

    return (
        <div className="posts-page-wrapper">
            <div className="posts-container">
                <header className="posts-header">
                    <div className="controls">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                            <option value="id">Sort by ID</option>
                            <option value="title">Sort by Title</option>
                        </select>
                        <button className="add-btn" onClick={handleAddPostRequest}>
                            + New Post
                        </button>
                    </div>
                </header>

                <div className="posts-list">
                    {filteredAndSortedData.map(post => (
                        <PostItem
                            key={post.id}
                            post={post}
                            authorName={getUserName(post.userId)}
                            isSelected={selectedPostId === post.id}
                            onSelect={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                            onDelete={() => handleDeletePost(post.id)}
                            onUpdate={(fields) => updateItem(post.id, fields)} // עדכון Inline
                        />
                    ))}
                </div>
            </div>

            {/* רכיב המודאל המרכזי ששולט על כל הדיאלוגים בדף */}
            <CustomAlert
                isOpen={isAlertOpen}
                message={alertMessage}
                type={alertType}
                showInput={showInput}
                value={inputValue}
                setValue={setInputValue}
                onConfirm={handleConfirmModal}
                onClose={() => {
                    setIsAlertOpen(false);
                    setStep(0);
                }}
            />
        </div>
    );
}

export default PostsPage;