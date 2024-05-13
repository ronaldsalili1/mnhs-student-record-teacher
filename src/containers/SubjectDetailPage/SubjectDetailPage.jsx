import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Flex } from 'antd';

import { formatFullName, getParamsFromUrl, objectToQueryString } from '../../helpers/general';
import { NavigationContext } from '../../providers/NavigationProvider';
import useSubjectDetail from '../../hooks/SubejctDetailPage/useSubjectDetail';
import StudentSearchForm from './components/StudentSearchForm';


const SubjectDetailPage = () => {
    const layoutState = useContext(NavigationContext);
    const { setTitle, setBreadcrumbItems } = layoutState;
    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();

    const subjectDetailProps = useSubjectDetail();
    const {
        loadingStudents,
        students,
        subject,
        page,
        total,
        limit,
        getStudents,
    } = subjectDetailProps;

    useEffect(() => {
        setBreadcrumbItems([
            {
                title: 'Subjects',
                href: '',
                onClick: (e) => {
                    e.preventDefault();
                    navigate('/subjects');
                },
            },
            {
                title: subject ? 'Details' : 'Create',
            },
        ]);

        if (!subject) {
            setTitle(' ');
        } else {
            setTitle(subject?.name);
        }

        return () => {
            setTitle(null);
            setBreadcrumbItems([]);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subject]);

    const columns = [
        {
            title: 'Name (Last, First, Middle, Suffix)',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => formatFullName(record),
        },
        {
            title: 'LRN',
            dataIndex: 'lrn',
            key: 'lrn',
        },
        {
            title: 'Grades',
            children: [
                {
                    title: 'Q1',
                    dataIndex: 'quarter_1',
                    key: 'quarter_1',
                    render: (_, record) => record?.grade?.quarter_1 || '-',
                },
                {
                    title: 'Q2',
                    dataIndex: 'quarter_2',
                    key: 'quarter_2',
                    render: (_, record) => record?.grade?.quarter_2 || '-',
                },
                {
                    title: 'Final',
                    dataIndex: 'final_grade',
                    key: 'final_grade',
                    render: (_, record) => {
                        const { quarter_1, quarter_2 } = record?.grade || {};
                        let grade;
                        if (quarter_1 && !quarter_2) {
                            grade = quarter_1;
                        } else if (!quarter_1 && quarter_2) {
                            grade = quarter_2;
                        } else if (quarter_1 && quarter_2) {
                            grade = (quarter_1 + quarter_2) / 2;
                        }
                        return grade ? Math.round(grade) : '-';
                    },
                },
            ],
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
                <StudentSearchForm {...subjectDetailProps}/>
            </Flex>
            <Table
                loading={loadingStudents}
                scroll={ { x: true } }
                dataSource={students.map(student => {
                    return { ...student, key: student._id };
                })}
                size="middle"
                bordered
                columns={columns}
                pagination={{
                    current: page,
                    showSizeChanger: true,
                    onChange: (current, pageSize) => {
                        const queryObj = { ...query, page: current, limit: pageSize };
                        getStudents(queryObj);
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

export default SubjectDetailPage;