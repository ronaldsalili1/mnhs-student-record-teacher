import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { get, post, del, patch } from '../../helpers/request';
import { NavigationContext } from '../../providers/NavigationProvider';
import { getParamsFromUrl } from '../../helpers/general';

const useGradeSubmissionDetail = () => {
    const [meta, setMeta] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [loadingSemesters, setLoadingSemesters] = useState(false);
    const [semesters, setSemesters] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingReviewers, setLoadingReviewers] = useState(false);
    const [reviewers, setReviewers] = useState([]);
    const [studentGradeData, setStudentGradeData] = useState([]);
    const [semester, setSemester] = useState(null);
    const [subject, setSubject] = useState(null);
    const [loadingGrades, setLoadingGrades] = useState(false);
    const [gradeSubmission, setGradeSubmission] = useState(null);

    const layoutState = useContext(NavigationContext);
    const { notificationApi } = layoutState;

    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();
    const { gradeSubmissionId } = useParams();

    const resetMeta = () => {
        setMeta(null);
    };

    const getSemesterOptions = async () => {
        setLoadingSemesters(true);

        const response = await get({
            uri: '/teacher/semesters/options/all',
            navigate,
            location,
        });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSemesters(false);
            return;
        }

        setSemesters(response?.data?.semesters);
        setLoadingSemesters(false);
    };

    const getSubjectsOptions = async () => {
        setLoadingSubjects(true);

        const response = await get({
            uri: '/teacher/subjects/options',
            navigate,
            location,
        });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubjects(false);
            return;
        }

        setSubjects(response?.data?.subjects);
        setLoadingSubjects(false);
    };

    const getReviewerOptions = async () => {
        setLoadingReviewers(true);

        const response = await get({
            uri: '/teacher/admins/options/reviewers',
            navigate,
            location,
        });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingReviewers(false);
            return;
        }

        setReviewers(response?.data?.reviewers);
        setLoadingReviewers(false);
    };

    const getGradeSubmissionById = async () => {
        setLoadingGrades(true);

        const response = await get({
            uri: `/teacher/grades/submissions/${gradeSubmissionId}`,
            navigate,
            location,
        });

        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingGrades(false);
            return;
        }

        setGradeSubmission(response?.data?.grade_submission);
        setSemester(response?.data?.semester);
        setSubject(response?.data?.subject);
        setStudentGradeData(response?.data?.student_grade_data);
        setLoadingGrades(false);
    };

    const createOrUpdateGradeSubmission = async ({ fields }) => {
        setLoadingSubmit(true);

        const body = {
            grade_submission: {
                ...fields,
            },
        };

        let response;

        if (gradeSubmissionId) {
            response = await patch({
                uri: `/teacher/grades/submissions/${gradeSubmissionId}`,
                body,
                navigate,
                location,
            });
        } else {
            response = await post({
                uri: '/teacher/grades/submissions',
                body,
                navigate,
                location,
            });
        }

        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubmit(false);
            return;
        }

        const { grade_submission } = response.data;

        setMeta(response.meta);
        setLoadingSubmit(false);

        navigate(`/grade-submission/${grade_submission._id}`);
    };

    useEffect(() => {
        getSemesterOptions();
        gradeSubmissionId && getGradeSubmissionById();

        return () => {
            setMeta(null);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gradeSubmissionId]);

    useEffect(() => {
        if (meta) {
            const type = meta.code === 200 ? 'success' : 'error';
            notificationApi[type]({
                message: meta.message,
                placement: 'bottomRight',
            });

            if (meta.code === 200) {
                gradeSubmissionId && getGradeSubmissionById();
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
        getSemesterOptions,
        loadingSemesters,
        semesters,
        getSubjectsOptions,
        loadingSubjects,
        subjects,
        loadingSubmit,
        loadingReviewers,
        reviewers,
        getReviewerOptions,
        createOrUpdateGradeSubmission,
        studentGradeData,
        setStudentGradeData,
        semester,
        setSemester,
        subject,
        setSubject,
        loadingGrades,
        setLoadingGrades,
        gradeSubmission,
    };
};

export default useGradeSubmissionDetail;