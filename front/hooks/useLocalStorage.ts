export const useLocalStorage = () => {
    const setItem = (key: string, value: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, value);
        }
    }

    const getItem = (key: string): string | null => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(key);
        }
        return null;
    }

    const removeItem = (key: string) => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(key);
        }
    }

    return { setItem, getItem, removeItem };
}