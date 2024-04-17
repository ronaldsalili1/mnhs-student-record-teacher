import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Typography, Flex, Grid, Button } from 'antd';
import { PlusSquareFilled } from '@ant-design/icons';

import { capitalizeFirstLetter, formatFullName, getParamsFromUrl, objectToQueryString } from '../../helpers/general';
import { NavigationContext } from '../../providers/NavigationProvider';
import useGradeSubmission from '../../hooks/useGradeSubmission';
import dayjs from 'dayjs';
import { formatSemester } from '../../helpers/semester';
import options from '../../constants/options';

const { Link } = Typography;

const GradeSubmissionPage = () => {
    const layoutState = useContext(NavigationContext);
    const { setTitle } = layoutState;
    const { xs } = Grid.useBreakpoint();

    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        meta,
        resetMeta,
        getGradeSubmissions,
        loadingGradeSubmissions,
        total,
        page,
        limit,
        gradeSubmissions,
    } = useGradeSubmission();

    useEffect(() => {
        setTitle('Grade Submission');

        return () => setTitle(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            render: data => data.name,
        },
        {
            title: 'Semester',
            dataIndex: 'semester',
            key: 'semester',
            render: data => formatSemester(data),
        },
        {
            title: 'Reviewer',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => formatFullName(record.reviewer),
        },
        {
            title: 'Submission Date',
            dataIndex: 'submitted_at',
            key: 'submitted_at',
            render: data => dayjs(data).format('YYYY-MM-DD'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: data => options.gradeSubmissionStatus.find(status => status.value === data).label,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Link
                        onClick={() => navigate(`/grade-submission/${record._id}`)}
                    >
						View
                    </Link>   
                );
            },
        },
    ];

    return (
        <>
            <Flex
                justify="end"
                wrap="wrap"
                gap={10}
                style={{ margin: '10px 0px' }}
            >
                <Button
                    type="primary"
                    icon={<PlusSquareFilled />}
                    htmlType="submit"
                    style={{ ...(xs && { width: '100%' }) }}
                    onClick={() => navigate('/grade-submission/create')}
                >
                    Submit Grades
                </Button>
            </Flex>
            <Table
                loading={loadingGradeSubmissions}
                scroll={ { x: true } }
                dataSource={gradeSubmissions.map(gradeSubmission => {
                    return { ...gradeSubmission, key: gradeSubmission._id };
                })}
                columns={columns}
                pagination={{
                    current: page,
                    showSizeChanger: true,
                    onChange: (current, pageSize) => {
                        const queryObj = { ...query, page: current, limit: pageSize };
                        getGradeSubmissions(queryObj);
                        const queryString = objectToQueryString(queryObj);
                        navigate(`${location.pathname}${queryString}`);
                    },
                    position: ['bottomRight'],
                    total,
                    pageSize: limit,
                }}
            />
        </>
    );
};

export default GradeSubmissionPage;