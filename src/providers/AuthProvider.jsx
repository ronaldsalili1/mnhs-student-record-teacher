import { createContext, useEffect } from 'react';

import useAuth from '../hooks/useAuth';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const { teacher, activeSemester, checkAuthStatus, setTeacher } = useAuth();

    useEffect(() => {
        checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider
            value={{ teacher, activeSemester, setTeacher }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;