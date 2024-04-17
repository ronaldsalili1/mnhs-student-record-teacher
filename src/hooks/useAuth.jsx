import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { get, post } from '../helpers/request';
import { getParamsFromUrl } from '../helpers/general';
import { removeAuthenticated, setAuthenticated } from '../helpers/localStorage';

const useAuth = () => {
    const [checkingAuthStatus, setCheckingAuthStatus] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [meta, setMeta] = useState(null);
    const [teacher, setTeacher] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const resetMeta = () => {
        setMeta(null);
    };

    const checkAuthStatus = async () => {
        setCheckingAuthStatus(true);

        const response = await get({ uri: '/teacher/auth/authenticated', navigate, location });
        if (response?.meta?.code !== 200) {
            navigate(`/login?path=${location.pathname + location.search + location.hash}`, { replace: true });
            return;
        }

        setTeacher(response?.data?.teacher);
        setCheckingAuthStatus(false);
    };

    const login = async (email, password) => {
        setLoadingSubmit(true);
    
        const response = await post({
            uri: '/teacher/auth/login',
            body: {
                email,
                password,
            },
            navigate,
            location,
        });

        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubmit(false);
            return;
        }
    
        setMeta(response?.meta);
        setLoadingSubmit(false);
        setAuthenticated();

        const query = getParamsFromUrl();
        if (query.path) {
            navigate(query.path, { replace: true });
            return;
        }

        navigate('/subjects', { replace: true });
    };

    const logout = async () => {
        setLoadingSubmit(true);
    
        const response = await post({ uri: '/teacher/auth/logout', navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubmit(false);
            return;
        }

        setLoadingSubmit(false);
        removeAuthenticated();
        navigate('/login');
    };

    return {
        checkingAuthStatus,
        loadingSubmit,
        meta,
        teacher,
        login,
        logout,
        resetMeta,
        checkAuthStatus,
    };
};

export default useAuth;