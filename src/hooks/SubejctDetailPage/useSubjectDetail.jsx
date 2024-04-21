import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { get, post, del } from '../../helpers/request';
import { NavigationContext } from '../../providers/NavigationProvider';
import { getParamsFromUrl } from '../../helpers/general';

const useSubjectDetail = () => {
    const [meta, setMeta] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [students, setStudents] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [loadingSubject, setLoadingSubject] = useState(false);
    const [subject, setSubject] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingDeleteSubjectStudent, setLoadingDeleteSubjectStudent] = useState(false);

    const layoutState = useContext(NavigationContext);
    const { notificationApi } = layoutState;

    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();
    const { subjectId } = useParams();

    const resetMeta = () => {
        setMeta(null);
    };

    const getEnrolledStudents = async () => {
        const newQuery = { subject_id: subjectId };
        const response = await get({ uri: '/teacher/subjects/students/enrolled', query: newQuery, navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            return;
        }

        setEnrolledStudents(response?.data?.students);
    };

    const getStudents = async (query) => {
        setLoadingStudents(true);

        const newQuery = query
            ? {
                ...query, 
                subject_id: subjectId,
            }
            : { subject_id: subjectId };
        const response = await get({ uri: '/teacher/subjects/students', query: newQuery, navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingStudents(false);
            return;
        }

        setTotal(response?.data?.total);
        setPage(response?.data?.page);
        setLimit(response?.data?.limit);
        setStudents(response?.data?.students);
        setLoadingStudents(false);
    };

    const getSubjectById = async () => {
        setLoadingSubject(true);

        const response = await get({ uri: `/teacher/subjects/${subjectId}`, navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubject(false);
            return;
        }

        setSubject(response?.data?.subject);
        setLoadingSubject(false);
    };

    const createStudents = async ({ fields }) => {
        setLoadingSubmit(true);

        const body = {
            student: {
                ...fields,
                subject_id: subjectId,
            },
        };

        const response = await post({
            uri: '/teacher/subjects/students',
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

    const deleteSubjectStudentById = async (subjectStudentId) => {
        setLoadingDeleteSubjectStudent(true);

        const response = await del({ uri: `/teacher/subjects/students/${subjectStudentId}`, navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingDeleteSubjectStudent(false);
            return;
        }

        setMeta(response.meta);
        setLoadingDeleteSubjectStudent(false);
    };

    useEffect(() => {
        getEnrolledStudents();
        getStudents(query);
        subjectId && getSubjectById();

        return () => {
            setStudents([]);
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
                getStudents(query);
                getEnrolledStudents();
            }
        }

        return () => resetMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta]);

    return {
        meta,
        resetMeta,
        total,
        page,
        limit,
        loadingStudents,
        getStudents,
        students,
        loadingSubject,
        subject,
        loadingSubmit,
        createStudents,
        deleteSubjectStudentById,
        loadingDeleteSubjectStudent,
        enrolledStudents,
    };
};

export default useSubjectDetail;