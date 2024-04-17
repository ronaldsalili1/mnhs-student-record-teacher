export const getAuthenticated = () => {
    return localStorage.getItem('authenticated');
};

export const setAuthenticated = () => {
    localStorage.setItem('authenticated', 'yes');
};

export const removeAuthenticated = () => {
    localStorage.removeItem('authenticated');
};