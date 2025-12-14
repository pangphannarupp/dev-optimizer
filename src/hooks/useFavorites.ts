import { useState, useEffect, useCallback } from 'react';

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('sidebar_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('sidebar_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = useCallback((id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    }, []);

    const isFavorite = useCallback((id: string) => {
        return favorites.includes(id);
    }, [favorites]);

    return { favorites, toggleFavorite, isFavorite };
}
