export const getAuthenticated = () => {
    return localStorage.getItem('teacher_authenticated');
};

export const setAuthenticated = () => {
    localStorage.setItem('teacher_authenticated', 'yes');
};

export const removeAuthenticated = () => {
    localStorage.removeItem('teacher_authenticated');
};