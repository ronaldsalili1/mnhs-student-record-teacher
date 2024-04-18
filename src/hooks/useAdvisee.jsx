import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { NavigationContext } from '../providers/NavigationProvider';
import { del, get, post } from '../helpers/request';
import { getParamsFromUrl } from '../helpers/general';

const useAdvisee = () => {
    const [meta, setMeta] = useState(null);
    const [loadingAdvisees, setLoadingAdvisees] = useState(false);
    const [advisees, setAdvisees] = useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [loadingDeleteSectionStudent, setLoadingDeleteSectionStudent] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const query = getParamsFromUrl();
    const layoutState = useContext(NavigationContext);
    const { notificationApi } = layoutState;

    const resetMeta = () => {
        setMeta(null);
    };

    const getAdvisees = async (query) => {
        setLoadingAdvisees(true);

        const response = await get({ uri: '/teacher/students', query, navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingAdvisees(false);
            return;
        }

        setTotal(response?.data?.total);
        setPage(response?.data?.page);
        setLimit(response?.data?.limit);
        setAdvisees(response?.data?.students);
        setLoadingAdvisees(false);
    };

    const createSectionStudents = async ({ fields }) => {
        setLoadingSubmit(true);

        const body = {
            section_students: {
                ...fields,
            },
        };

        const response = await post({
            uri: '/teacher/students',
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

    const deleteSectionStudentById = async (sectionStudentId) => {
        setLoadingDeleteSectionStudent(true);

        const response = await del({ uri: `/teacher/students/${sectionStudentId}`, navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingDeleteSectionStudent(false);
            return;
        }

        setMeta(response.meta);
        setLoadingDeleteSectionStudent(false);
    };

    useEffect(() => {
        getAdvisees(query);

        return () => {
            setAdvisees([]);
            setMeta(null);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (meta) {
            const type = meta.code === 200 ? 'success' : 'error';
            notificationApi[type]({
                message: meta.message,
                placement: 'bottomRight',
            });

            if (meta.code === 200) {
                getAdvisees(query);
            }
        }

        return () => resetMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta]);

    return {
        meta,
        resetMeta,
        getAdvisees,
        loadingAdvisees,
        total,
        page,
        limit,
        advisees,
        createSectionStudents,
        loadingSubmit,
        deleteSectionStudentById,
        loadingDeleteSectionStudent,
    };
};

export default useAdvisee;