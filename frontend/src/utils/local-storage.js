export const getLocalToken = (key) => localStorage.getItem(key);
export const setLocalToken = (key, value) => localStorage.setItem(key, value);
export const removeLocalToken = (key) => localStorage.removeItem(key);

export const clearAuthData = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};
