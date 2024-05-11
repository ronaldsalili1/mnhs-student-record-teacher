import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { get, post, patch } from '../../helpers/request';
import { NavigationContext } from '../../providers/NavigationProvider';

const useGradeSubmissionDetail = () => {
    const [meta, setMeta] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingReviewers, setLoadingReviewers] = useState(false);
    const [reviewers, setReviewers] = useState([]);
    const [studentGradeData, setStudentGradeData] = useState([]);
    const [semester, setSemester] = useState(null);
    const [quarter, setQuarter] = useState(null);
    const [subject, setSubject] = useState(null);
    const [loadingGrades, setLoadingGrades] = useState(false);
    const [gradeSubmission, setGradeSubmission] = useState(null);

    const layoutState = useContext(NavigationContext);
    const { notificationApi } = layoutState;

    const navigate = useNavigate();
    const location = useLocation();
    const { gradeSubmissionId } = useParams();

    const resetMeta = () => {
        setMeta(null);
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
        setQuarter(response?.data?.quarter);
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
        loadingSubmit,
        loadingReviewers,
        reviewers,
        getReviewerOptions,
        createOrUpdateGradeSubmission,
        studentGradeData,
        setStudentGradeData,
        semester,
        quarter,
        setSemester,
        subject,
        setSubject,
        loadingGrades,
        setLoadingGrades,
        gradeSubmission,
        setQuarter,
    };
};

export default useGradeSubmissionDetail;