import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { get } from '../helpers/request';
import { getParamsFromUrl } from '../helpers/general';

const useSubject = () => {
    const [meta, setMeta] = useState(null);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const navigate = useNavigate();
    const location = useLocation();
    const query = getParamsFromUrl();

    const resetMeta = () => {
        setMeta(null);
    };

    const getSubjects = async (query) => {
        setLoadingSubjects(true);

        const response = await get({ uri: '/teacher/subjects', query, navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubjects(false);
            return;
        }

        setTotal(response?.data?.total);
        setPage(response?.data?.page);
        setLimit(response?.data?.limit);
        setSubjects(response?.data?.subjects);
        setLoadingSubjects(false);
    };

    useEffect(() => {
        getSubjects(query);

        return () => {
            setSubjects([]);
            setMeta(null);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        meta,
        resetMeta,
        getSubjects,
        loadingSubjects,
        total,
        page,
        limit,
        subjects,
    };
};

export default useSubject;