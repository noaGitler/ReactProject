//רכיב מרכזי שמנהל את מצב המשתמש המחובר בכל האפליקציה,
//מאפשר גישה לנתוני הפרופיל מכל עמוד ללא צורך בהעברת Props,
//מטפל בלוגיקה של התחברות (Login), הרשמה (Register) ושמירת הסשן ב-LocalStorage

import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const savedUserId = localStorage.getItem('currentUser');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(!!savedUserId);

    // אפקט לטעינת נתוני המשתמש המלאים מהשרת במידה וקיים ID שמור
    useEffect(() => {
        const fetchUserData = async () => {
            if (savedUserId) {
                try {
                    const response = await fetch(`http://localhost:3000/users/${savedUserId}`);
                    if (response.ok) {
                        const fullUser = await response.json();
                        setUser(fullUser);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error("Connection error during auto-login:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchUserData();
    }, [savedUserId]);

    // פונקציית התחברות (Login)
    const login = async (username, password) => {
        try {
            const response = await fetch(`http://localhost:3000/users?username=${username}`);
            const users = await response.json();

            if (users.length > 0 && users[0].website === password) {
                const loggedInUser = users[0];
                localStorage.setItem('currentUser', loggedInUser.id);
                setUser(loggedInUser);
                return { success: true };
            }
            return { success: false, message: "Incorrect username or password" };
        } catch (error) {
            return { success: false, message: "Server connection error" };
        }
    };

    const checkUsernameAvailability = async (username) => {
        try {
            const response = await fetch(`http://localhost:3000/users?username=${username}`);
            const existingUsers = await response.json();
            return existingUsers.length === 0;
        } catch (error) {
            throw new Error("Connection error");
        }
    };

    // פונקציית רישום (Register)
    const register = async (newUserFirstStep, fullDetails) => {
        try {
            const res = await fetch('http://localhost:3000/users');
            const allUsers = await res.json();
            const maxId = allUsers.reduce((max, u) => Math.max(max, Number(u.id)), 0);

            const completeUser = {
                id: (maxId + 1).toString(),
                name: fullDetails.fullName,
                username: newUserFirstStep.username,
                email: fullDetails.email,
                address: {
                    street: fullDetails.street,
                    city: fullDetails.city,
                    suite: "", zipcode: "", geo: { lat: "", lng: "" }
                },
                phone: fullDetails.phone,
                website: newUserFirstStep.password,
                company: { name: "", catchPhrase: "", bs: "" }
            };

            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completeUser)
            });

            if (response.ok) {
                const createdUser = await response.json();
                // שמירת ה-ID בלבד לאחר הרשמה מוצלחת
                localStorage.setItem('currentUser', createdUser.id);
                setUser(createdUser);
                return { success: true };
            }
            return { success: false, message: "Error saving user to server" };
        } catch (error) {
            return { success: false, message: "Connection error" };
        }
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, register, logout, checkUsernameAvailability, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

