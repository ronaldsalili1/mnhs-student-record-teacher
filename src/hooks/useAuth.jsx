import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { get } from '../helpers/request';

const useAuth = () => {
    const [checkingAuthStatus, setCheckingAuthStatus] = useState(false);
    const [meta, setMeta] = useState(null);
    const [teacher, setTeacher] = useState(null);
    const [activeSemester, setActiveSemester] = useState(null);

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
        setActiveSemester(response?.data?.semester);
        setCheckingAuthStatus(false);
    };

    return {
        checkingAuthStatus,
        meta,
        teacher,
        setTeacher,
        resetMeta,
        checkAuthStatus,
        activeSemester,
    };
};

export default useAuth;