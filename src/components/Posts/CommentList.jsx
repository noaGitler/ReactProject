//רשימת תגובות
//מנהלת את כל מערך התגובות עבור פוסט ספציפי
//כולל שליפה מהשרת, ואפשרות להוספת תגובות חדשות בזמן אמת

import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import useFetch from '../../hooks/useFetch';
import './CommentList.css';

function CommentList({ postId }) {
    const { user } = useContext(UserContext);

    // שליפת תגובות לפי ה-postId
    const {
        data: comments,
        addItem: addComment,
        deleteItem: deleteComment,
        updateItem: updateComment,
        isLoading,
        error
    } = useFetch(`http://localhost:3000/comments?postId=${postId}`);

    // --- מצבים לעריכה במקום והוספת תגובה ---
    const [editingId, setEditingId] = useState(null);
    const [editBody, setEditBody] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [newCommentBody, setNewCommentBody] = useState("");

    if (isLoading) return <p className="loading-comments">Loading comments...</p>;
    if (error) return <p className="error-msg">Error loading comments.</p>;

    // פונקציית שמירת תגובה חדשה
    const handleSaveNewComment = async () => {
        if (!newCommentBody.trim()) return;
        try {
            await addComment({
                postId: postId,
                name: user.username,
                email: user.email,
                body: newCommentBody.trim()
            });
            setNewCommentBody("");
            setIsAdding(false);
        } catch (err) {
            console.error("Failed to add comment");
        }
    };

    // פונקציית שמירת עריכה
    const handleSaveUpdate = async (id) => {
        if (!editBody.trim()) return;
        try {
            await updateComment(id, { body: editBody.trim() });
            setEditingId(null);
        } catch (err) {
            console.error("Failed to update comment");
        }
    };

    return (
        <div className="comments-wrapper">
            <div className="comments-header-row">
                <h5>Community Comments</h5>
                {!isAdding && (
                    <button className="add-comment-mini-btn" onClick={() => setIsAdding(true)}>
                        + Add
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="inline-add-comment">
                    <textarea 
                        className="inline-edit-textarea"
                        placeholder="Write a comment..."
                        value={newCommentBody}
                        onChange={(e) => setNewCommentBody(e.target.value)}
                        autoFocus
                    />
                    <div className="inline-edit-actions">
                        <button onClick={handleSaveNewComment} className="save-link">Post</button>
                        <button onClick={() => setIsAdding(false)} className="cancel-link">Cancel</button>
                    </div>
                </div>
            )}

            <div className="comments-items-list">
                {comments && comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-bubble">
                                <div className="comment-meta">
                                    <div className="commenter-name-wrapper">
                                        <strong className="commenter-name">{comment.name}</strong>
                                        <div className="user-hover-card">
                                            <div className="hover-avatar">
                                                {comment.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="hover-name">{comment.name}</div>
                                            <div className="hover-email">{comment.email}</div>
                                        </div>
                                    </div>
                                    <span className="comment-email">({comment.email})</span>
                                </div>

                                {editingId === comment.id ? (
                                    <div className="inline-edit-box">
                                        <textarea 
                                            className="inline-edit-textarea"
                                            value={editBody}
                                            onChange={(e) => setEditBody(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="inline-edit-actions">
                                            <button onClick={() => handleSaveUpdate(comment.id)} className="save-link">Save</button>
                                            <button onClick={() => setEditingId(null)} className="cancel-link">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="comment-text">{comment.body}</p>
                                )}
                            </div>

                            {comment.email === user.email && editingId !== comment.id && (
                                <div className="comment-item-actions">
                                    <button onClick={() => { 
                                        setEditingId(comment.id); 
                                        setEditBody(comment.body); 
                                    }}>Edit</button>
                                    <button className="delete-small" onClick={() => deleteComment(comment.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
}

export default CommentList;