//תצוגת פוסט
//קומפוננטה המציגה תקציר של פוסט בודד
//ומאפשרת להרחיב אותו לצפייה בתוכן מלא

import React, { useContext, useState } from 'react'; 
import { UserContext } from '../../context/UserContext'; 
import CommentList from './CommentList';

function PostItem({ post, authorName, isSelected, onSelect, onDelete, onUpdate }) {

    const { user } = useContext(UserContext);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post.title);
    const [editBody, setEditBody] = useState(post.body);

    const handleSave = async (e) => {
        e.stopPropagation(); 
        if (!editTitle.trim() || !editBody.trim()) return;
        
        try {
            await onUpdate({ title: editTitle.trim(), body: editBody.trim() });
            setIsEditing(false);
        } catch (err) {
            console.error("Update failed");
        }
    };

    const handleCancel = (e) => {
        e.stopPropagation();
        setEditTitle(post.title);
        setEditBody(post.body);
        setIsEditing(false);
    };

    return (
        <div className={`post-card ${isSelected ? 'selected' : ''}`}>
            <div className="post-summary" onClick={onSelect}>
                <div className="post-info-left">
                    <span className="post-id">#{post.id.split('-').pop()}</span>
                    <span className="post-author">@{authorName}</span>
                    
                    {isEditing ? (
                        <input 
                            className="inline-edit-input"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    ) : (
                        <span className="post-title">{post.title}</span>
                    )}
                </div>
                <button className={`view-btn ${isSelected ? 'active' : ''}`}>
                    {isSelected ? 'Close' : 'View'}
                </button>
            </div>

            {/* רק אם הפוסט נבחר, נציג את הפרטים המורחבים */}
            {isSelected && (
                <div className="post-details">
                    
                    {isEditing ? (
                        /* מצב עריכה לתוכן הפוסט */
                        <div className="post-inline-edit" onClick={(e) => e.stopPropagation()}>
                            <textarea 
                                className="inline-edit-textarea"
                                value={editBody}
                                onChange={(e) => setEditBody(e.target.value)}
                            />
                            <div className="inline-edit-actions">
                                <button onClick={handleSave} className="save-link">Save Changes</button>
                                <button onClick={handleCancel} className="cancel-link">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="post-body">
                                {post.body ? post.body : "No content available for this post."}
                            </p>

                            <div className="post-actions">
                                {String(post.userId) === String(user.id) && (
                                    <>
                                        <button className="edit-post-btn" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
                                            Edit Post
                                        </button>
                                        <button className="delete-btn" onClick={onDelete}>Delete Post</button>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    <div className="comments-section">
                        <CommentList postId={post.id} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostItem;