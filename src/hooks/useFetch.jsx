//פונקציה גנרית כדי לרכז את כל התקשורת מול השרת (GET, POST, PATCH, DELETE)
//במקום אחד, מה שמונע כפילות קוד ומאפשר ניהול מצבי טעינה ושגיאות בצורה אחידה

import { useState, useEffect } from 'react';

function useFetch(url) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetch(url)
            .then(res => {
                if (!res.ok) throw Error('We were unable to retrieve the data');
                return res.json();
            })
            .then(data => {
                setData(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [url]);

    // פונקציית מחיקה גנרית
    const deleteItem = async (id) => {
        const response = await fetch(`${url.split('?')[0]}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Delete failed');
        setData(prev => prev.filter(item => item.id !== id));
    };

    // פונקציית עדכון גנרית (PATCH)
    const updateItem = async (id, updatedFields) => {
        try {
            // המרה מפורשת של ה-ID למחרוזת כדי למנוע בעיות טיפוסים
            const stringId = String(id);
            const baseUrl = url.split('?')[0];

            const response = await fetch(`${baseUrl}/${stringId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFields),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Update failed on server');
            }

            const updatedData = await response.json();

            // עדכון ה-UI
            setData(prev => prev.map(item => String(item.id) === stringId ? updatedData : item));
        } catch (err) {
            alert(err.message);
        }
    };


    //פונקצית הוספה גנרית
    const addItem = async (newItemFields) => {
        try {
            const baseUrl = url.split('?')[0];

            //סינון הנתונים לפי ההקשר הרלוונטי (User / Post / Album)
            const relevantData = data ? data.filter(item => {
                if (newItemFields.postId) return String(item.postId) === String(newItemFields.postId);
                if (newItemFields.userId) return String(item.userId) === String(newItemFields.userId);
                if (newItemFields.albumId) return String(item.albumId) === String(newItemFields.albumId);
                return true;
            }) : [];

            // חישוב המספר הבא
            const maxCurrentId = relevantData.reduce((max, item) => {
                const parts = String(item.id).split('-');
                const currentNum = parts.length > 0 ? Number(parts[parts.length - 1]) : 0;
                return currentNum > max ? currentNum : max;
            }, 0);

            const nextNum = maxCurrentId + 1;

            //  בניית ה-ID החדש לפי סוג המשאב
            let nextId;
            if (newItemFields.postId) {
                nextId = `${newItemFields.postId}-${nextNum}`;
            } else if (newItemFields.albumId) {
                nextId = `${newItemFields.albumId}-${nextNum}`;
            } else {
                nextId = `${newItemFields.userId}-${nextNum}`;
            }

            const itemWithId = { ...newItemFields, id: nextId };

            // שליחה לשרת
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemWithId),
            });

            if (!response.ok) throw new Error('Add failed on server');
            const addedItem = await response.json();

            setData(prev => [addedItem, ...prev]);
            return addedItem;
        } catch (err) {
            throw err;
        }
    };

    return { data, setData, deleteItem, updateItem, addItem, isLoading, error };
}

export default useFetch;