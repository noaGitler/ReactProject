//לוגיקה עצמאית המאפשרת למשתמש 
//לסנן נתונים בזמן אמת ולמיין אותם לפי שדות שונים

import { useMemo, useState } from 'react';

function useFilterAndSort(initialData, searchKeys = ['title', 'id'], defaultSortField = 'id') {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState(defaultSortField);

    const filteredAndSortedData = useMemo(() => {
        if (!initialData) return [];

        // פונקציית עזר לחילוץ המספר האחרון מה-ID
        const getDisplayId = (id) => {
            const strId = String(id);
            return strId.includes('-') ? strId.split('-').pop() : strId;
        };

        // סינון 
        let result = initialData.filter(item => 
            searchKeys.some(key => {
                if (key === 'id') {
                    // חיפוש אך ורק לפי המספר שמוצג למשתמש
                    return getDisplayId(item.id).includes(searchQuery);
                }
                return item[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase());
            })
        );

        // מיון 
        result.sort((a, b) => {
            if (sortBy === 'id') {
                // מיון לפי המספר האחרון בלבד
                return Number(getDisplayId(a.id)) - Number(getDisplayId(b.id));
            }
            
            // מיון רגיל לשאר השדות (כמו כותרת)
            const valA = String(a[sortBy] || "").toLowerCase();
            const valB = String(b[sortBy] || "").toLowerCase();
            return valA.localeCompare(valB);
        });

        return result;
    }, [initialData, searchQuery, sortBy, searchKeys]);

    return {
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        filteredAndSortedData
    };
}

export default useFilterAndSort;