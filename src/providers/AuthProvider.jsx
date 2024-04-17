import { createContext, useEffect } from 'react';

import useAuth from '../hooks/useAuth';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const { teacher, checkAuthStatus } = useAuth();

    useEffect(() => {
        checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider
            value={{ teacher }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;