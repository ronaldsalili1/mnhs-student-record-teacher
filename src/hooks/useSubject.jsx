import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { get, post } from '../helpers/request';
import { getParamsFromUrl } from '../helpers/general';
import { NavigationContext } from '../providers/NavigationProvider';

const useSubject = () => {
    const [meta, setMeta] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const layoutState = useContext(NavigationContext);
    const { notificationApi } = layoutState;
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

    const createSectionSubjects = async ({ fields }) => {
        setLoadingSubmit(true);

        const body = {
            section_subjects: {
                ...fields,
            },
        };

        const response = await post({
            uri: '/teacher/subjects',
            body,
            navigate,
            location,
        });

        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubmit(false);
            return;
        }

        setMeta(response.meta);
        setLoadingSubmit(false);
    };

    useEffect(() => {
        getSubjects(query);

        return () => {
            setSubjects([]);
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
                getSubjects();
            }
        }

        return () => resetMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta]);

    return {
        meta,
        resetMeta,
        getSubjects,
        loadingSubjects,
        total,
        page,
        limit,
        subjects,
        loadingSubmit,
        createSectionSubjects,
    };
};

export default useSubject;