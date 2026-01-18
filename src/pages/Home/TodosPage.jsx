//:ניהול משימות
//ממשק לניהול מטלות אישיות המאפשר
//הוספה, עריכה, סינון לפי סטטוס ומחיקה

import React, { useContext, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import useFilterAndSort from '../../hooks/useFilterAndSort';
import { UserContext } from '../../context/UserContext';
import CustomAlert from '../../components/Cmmon/CustomAlert'; // המודאל היוקרתי
import './TodosPage.css';

function TodosPage() {
    const { user } = useContext(UserContext);

    // שליפת הנתונים
    const { data: todos, updateItem, deleteItem, addItem, isLoading, error } = 
        useFetch(user ? `http://localhost:3000/todos?userId=${user.id}` : null);

    // סינון ומיון
    const {
        searchQuery, setSearchQuery,
        sortBy, setSortBy,
        filteredAndSortedData
    } = useFilterAndSort(todos, ['title', 'id'], 'id');

    // --- מצבים לניהול המודאל והעריכה ---
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info");
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [tempTitle, setTempTitle] = useState("");

    if (!user) return <h2 className="loading-msg">Loading user data...</h2>;
    if (isLoading) return <h2 className="loading-msg">Loading tasks...</h2>;
    if (error) return <h2 className="error-msg">error: {error}</h2>;

    //מחיקה 
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await deleteItem(id);
            setAlertMessage("Task deleted successfully");
            setAlertType("success");
            setShowInput(false);
            setIsAlertOpen(true);
        } catch (err) {
            setAlertMessage("Error deleting");
            setAlertType("error");
            setIsAlertOpen(true);
        }
    };

    //סטטוס
    const handleToggle = async (id, currentStatus) => {
        try {
            await updateItem(id, { completed: !currentStatus });
        } catch (err) {
            console.error("Error updating");
        }
    };

    // פתיחת מודאל להוספה
    const handleAddRequest = () => {
        setAlertMessage("Enter a title for the new task:");
        setInputValue("");
        setShowInput(true);
        setAlertType("info");
        setIsAlertOpen(true);
    };

    // אישור הוספה במודאל
    const handleConfirmAdd = async () => {
        if (!inputValue.trim()) return;
        try {
            await addItem({
                userId: user.id,
                title: inputValue.trim(),
                completed: false
            });
            setShowInput(false);
            setAlertMessage("Task added!");
            setAlertType("success");
        } catch (err) {
            setAlertMessage("Error adding");
            setAlertType("error");
        }
    };

    // שמירת עריכה במקום
    const saveEdit = async (id) => {
        if (!tempTitle.trim()) return;
        try {
            await updateItem(id, { title: tempTitle.trim() });
            setEditingId(null);
        } catch (err) {
            console.error("Error updating title");
        }
    };

    return (
        <div className="todos-container">
            <header className="todos-header">
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />

                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                        <option value="id"> ID </option>
                        <option value="title"> title </option>
                        <option value="completed"> completed </option>
                    </select>
                    
                    <button className="add-btn" onClick={handleAddRequest}>
                        <span className="plus-icon">+</span> New to dos
                    </button>
                </div>
            </header>

            <div className="todos-list">
                {filteredAndSortedData.length > 0 ? (
                    filteredAndSortedData.map(todo => (
                        <div key={todo.id} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
                            <div className="todo-info">
                                <span className="todo-id">
                                    #{String(todo.id).includes('-') ? todo.id.split('-').pop() : todo.id}
                                </span>
                                
                                {editingId === todo.id ? (
                                    /* עריכה "במקום" במקום prompt */
                                    <input 
                                        className="inline-edit-input"
                                        value={tempTitle}
                                        onChange={(e) => setTempTitle(e.target.value)}
                                        onBlur={() => saveEdit(todo.id)}
                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                                        autoFocus
                                    />
                                ) : (
                                    <span className="todo-title">{todo.title}</span>
                                )}
                            </div>

                            <div className="todo-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        setEditingId(todo.id);
                                        setTempTitle(todo.title);
                                    }}
                                >
                                    edit
                                </button>

                                <button className="delete-btn" onClick={() => handleDelete(todo.id)}>
                                    delete
                                </button>

                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleToggle(todo.id, todo.completed)}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-data">No assignments were found.</p>
                )}
            </div>

            {/* המודאל המרכזי שסוגר לנו את פינת העיצוב */}
            <CustomAlert
                isOpen={isAlertOpen}
                message={alertMessage}
                type={alertType}
                showInput={showInput}
                value={inputValue}
                setValue={setInputValue}
                onConfirm={handleConfirmAdd}
                onClose={() => setIsAlertOpen(false)}
            />
        </div>
    );
}

export default TodosPage;