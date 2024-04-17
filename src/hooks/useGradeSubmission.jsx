import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { get } from '../helpers/request';
import { getParamsFromUrl } from '../helpers/general';

const useGradeSubmission = () => {
    const [meta, setMeta] = useState(null);
    const [loadingGradeSubmissions, setLoadingGradeSubmissions] = useState(false);
    const [gradeSubmissions, setGradeSubmissions] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const navigate = useNavigate();
    const location = useLocation();
    const query = getParamsFromUrl();

    const resetMeta = () => {
        setMeta(null);
    };

    const getGradeSubmissions = async (query) => {
        setLoadingGradeSubmissions(true);

        const response = await get({ uri: '/teacher/grades/submissions', query, navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingGradeSubmissions(false);
            return;
        }

        setTotal(response?.data?.total);
        setPage(response?.data?.page);
        setLimit(response?.data?.limit);
        setGradeSubmissions(response?.data?.grade_submissions);
        setLoadingGradeSubmissions(false);
    };

    useEffect(() => {
        getGradeSubmissions(query);

        return () => {
            setGradeSubmissions([]);
            setMeta(null);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        meta,
        resetMeta,
        getGradeSubmissions,
        loadingGradeSubmissions,
        total,
        page,
        limit,
        gradeSubmissions,
    };
};

export default useGradeSubmission;