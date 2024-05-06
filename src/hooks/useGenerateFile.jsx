import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import config from '../config';
import { get } from '../helpers/request';
import { NavigationContext } from '../providers/NavigationProvider';
import { removeAuthenticated } from '../helpers/localStorage';

const useGenerateFile = () => {
    const [meta, setMeta] = useState(null);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [students, setStudents] = useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const layoutState = useContext(NavigationContext);
    const { notificationApi } = layoutState;
    const navigate = useNavigate();
    const location = useLocation();

    const resetMeta = () => {
        setMeta(null);
    };

    const getStudents = async (query) => {
        setLoadingStudents(true);

        const response = await get({ uri: '/teacher/students/options/advisees', query, navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingStudents(false);
            return;
        }

        setStudents(response?.data?.students);
        setLoadingStudents(false);
    };

    const needLogout = ({ meta, navigate, location }) => {
        const { pathname, search, hash } = location;
    
        const unauthorizedCodes = [4011, 4012, 4013];
        if (unauthorizedCodes.includes(meta.code) && pathname !== '/login') {
            removeAuthenticated();
            navigate(`/login?path=${pathname + search + hash}`, { replace: true });
            return;
        }
    };

    const generateForm = async (form, studentId, sectionId) => {
        let uri;
        
        if (studentId) {
            uri = `/teacher/forms/${form}/${studentId}`;
        } else {
            uri = `/teacher/forms/${form}/all/${sectionId}`;
        }

        try {
            setLoadingSubmit(true);
            const response = await fetch(`${config.api}${uri}`, {
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                referrerPolicy: 'no-referrer',
                method: 'GET',
            });

            if (response.status === 200) {
                setLoadingSubmit(false);
                window.open(`${config.api}${uri}`, '_blank');
                return;
            }

            const jsonResponse = await response.json();
            setMeta(jsonResponse?.meta);
            setLoadingSubmit(false);

            needLogout({
                meta: jsonResponse.meta,
                navigate,
                location,
            });
    
            setLoadingSubmit(false);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        getStudents();

        return () => {
            setStudents([]);
            setMeta(null);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (meta) {
            const type = (meta.code === 200) ? 'success' : 'error';
            notificationApi[type]({
                message: meta.message,
                placement: 'bottomRight',
            });

            if (meta.code === 200) {
                getStudents();
            }
        }

        return () => resetMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta]);

    return {
        meta,
        resetMeta,
        getStudents,
        loadingStudents,
        students,
        loadingSubmit,
        generateForm,
    };
};

export default useGenerateFile;