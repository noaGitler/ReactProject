//דף תמונות

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import CustomAlert from '../Common/CustomAlert';
import './PhotoGallery.css';

const PhotoGallery = () => {
    const { albumId } = useParams();
    const { data: allPhotos, isLoading, error, deleteItem, addItem, updateItem } =
        useFetch(`http://localhost:3000/photos?albumId=${albumId}`);

    const [visibleCount, setVisibleCount] = useState(3);
    const [newPhotoTitle, setNewPhotoTitle] = useState('');
    const [newPhotoUrl, setNewPhotoUrl] = useState('');

    // --- מצבים לניהול המודאל והעריכה ---
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info");
    const [editingId, setEditingId] = useState(null);
    const [tempTitle, setTempTitle] = useState("");

    const loadMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    if (isLoading) return <div className="loading">Loading Gallery...</div>;
    if (error) return <div className="error">{error}</div>;

    // מחיקת תמונה
    const handleDelete = async (photoId) => {
        if (window.confirm("Are you sure you want to delete this photo?")) {
            try {
                await deleteItem(photoId);
                setAlertMessage("Photo deleted successfully");
                setAlertType("success");
                setIsAlertOpen(true);
            } catch (err) {
                setAlertMessage("Failed to delete photo");
                setAlertType("error");
                setIsAlertOpen(true);
            }
        }
    };

    // הוספת תמונה חדשה
    const handleAddPhoto = async (e) => {
        e.preventDefault();
        if (!newPhotoTitle.trim() || !newPhotoUrl.trim()) {
            setAlertMessage("Please fill in both title and image URL");
            setAlertType("info");
            setIsAlertOpen(true);
            return;
        }

        try {
            await addItem({
                albumId: albumId,
                title: newPhotoTitle.trim(),
                url: newPhotoUrl.trim(),
                thumbnailUrl: newPhotoUrl.trim()
            });
            setNewPhotoTitle('');
            setNewPhotoUrl('');
            setAlertMessage("Photo added successfully!");
            setAlertType("success");
            setIsAlertOpen(true);
        } catch (err) {
            setAlertMessage("Failed to add photo");
            setAlertType("error");
            setIsAlertOpen(true);
        }
    };

    // עריכה במקום
    const startEditing = (photo) => {
        setEditingId(photo.id);
        setTempTitle(photo.title);
    };

    //עדכון ושמירה
    const handleSaveUpdate = async (photoId) => {
        if (!tempTitle.trim()) {
            setEditingId(null);
            return;
        }
        try {
            await updateItem(photoId, { title: tempTitle.trim() });
            setEditingId(null);
        } catch (err) {
            setAlertMessage("Failed to update title");
            setAlertType("error");
            setIsAlertOpen(true);
        }
    };

    return (
        <div className="photos-container">
            <header className="page-header">
                <div className="controls-card">
                    <form onSubmit={handleAddPhoto} className="add-photo-inline-form">
                        <input
                            type="text"
                            placeholder="Photo Title"
                            value={newPhotoTitle}
                            onChange={(e) => setNewPhotoTitle(e.target.value)}
                            className="search-input"
                        />
                        <input
                            type="text"
                            placeholder="Image URL..."
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="add-btn">Add Photo</button>
                    </form>
                </div>
            </header>

            <div className="photos-grid">
                {allPhotos?.slice(0, visibleCount).map(photo => (
                    <div key={photo.id} className="photo-card">
                        <div className="photo-wrapper">
                            <img src={photo.url} alt={photo.title} />
                        </div>
                        <div className="photo-info">
                            {editingId === photo.id ? (
                                <div className="inline-edit-box">
                                    <input
                                        className="inline-edit-input"
                                        value={tempTitle}
                                        onChange={(e) => setTempTitle(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="inline-edit-actions">
                                        <button onClick={() => handleSaveUpdate(photo.id)} className="save-link">Save</button>
                                        <button onClick={() => setEditingId(null)} className="cancel-link">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="photo-title">{photo.title}</p>
                                    <div className="photo-actions">
                                        <button onClick={() => startEditing(photo)} className="action-link edit">edit title</button>
                                        <button onClick={() => handleDelete(photo.id)} className="action-link delete">delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {allPhotos && visibleCount < allPhotos.length && (
                <button onClick={loadMore} className="load-more-btn">
                    Show More Photos
                </button>
            )}
            <CustomAlert
                isOpen={isAlertOpen}
                message={alertMessage}
                type={alertType}
                onConfirm={() => setIsAlertOpen(false)}
                onClose={() => setIsAlertOpen(false)}
            />
        </div>
    );
}

export default PhotoGallery;