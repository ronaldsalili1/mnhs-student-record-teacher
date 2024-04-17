import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Table, Typography, Flex, Button, Grid, Divider, Modal } from 'antd';
import { PlusSquareFilled, ExclamationCircleFilled, CloudDownloadOutlined, CloudUploadOutlined } from '@ant-design/icons';

import { formatFullName, getParamsFromUrl, objectToQueryString } from '../../helpers/general';
import { NavigationContext } from '../../providers/NavigationProvider';
import useSubjectDetail from '../../hooks/SubejctDetailPage/useSubjectDetail';
import StudentSearchForm from './components/StudentSearchForm';
import NewStudentsModal from './components/NewStudentsModal';
import StudentDetailModal from './components/StudentDetailModal';
import config from '../../config';
import { getTemplateDlLink } from '../../helpers/grade';

const { Link } = Typography;
const { confirm } = Modal;

const SubjectDetailPage = () => {
    const layoutState = useContext(NavigationContext);
    const { setTitle, setBreadcrumbItems } = layoutState;
    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();
    const { xs } = Grid.useBreakpoint();

    const { subjectId } = useParams();
    const subjectDetailProps = useSubjectDetail();
    const { loadingStudents, students, subject, meta, page, total, limit, getStudents, deleteSubjectStudentById, semesters } = subjectDetailProps;

    const [newStudentsModal, setNewStudentsModal] = useState(false);
    const [studentDetailModal, setStudentDetailModal] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState(null);

    const activeSemester = useMemo(() => {
        return semesters.find(semester => semester.status === 'active');
    }, [semesters]);

    const confirmDelete = (id) => {
        confirm({
            title: 'Are you sure you want to delete this record?',
            icon: <ExclamationCircleFilled />,
            okButtonProps: {
                danger: true,
            },
            okText: 'Delete',
            onOk: () => {
                deleteSubjectStudentById(id);
            },
        });
    };

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

    useEffect(() => {
        if (meta?.code === 200) {
            setNewStudentsModal(false);
        }
    }, [meta]);

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
                    render: data => data || '-',
                },
                {
                    title: 'Q2',
                    dataIndex: 'quarter_2',
                    key: 'quarter_2',
                    render: data => data || '-',
                },
                {
                    title: 'Final',
                    dataIndex: 'final_grade',
                    key: 'final_grade',
                    render: data => data || '-',
                },
            ],
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            render: (_, record) => {
                return (
                    <>
                        <Link
                            onClick={() => setStudentDetailModal(true)}
                        >
                            View
                        </Link>
                        <Divider type="vertical"/>
                        <Link
                            type="danger"
                            onClick={() => confirmDelete(record.subject_student_id)}
                        >
                            Delete
                        </Link>    
                    </>
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
                <StudentSearchForm
                    {...subjectDetailProps}
                    activeSemester={activeSemester}
                    setSelectedSemester={setSelectedSemester}
                />
                <Button
                    type="primary"
                    icon={<PlusSquareFilled />}
                    htmlType="submit"
                    style={{ ...(xs && { width: '100%' }) }}
                    onClick={() => setNewStudentsModal(true)}
                >
                    Add Students
                </Button>
                <Button
                    type="primary"
                    icon={<CloudDownloadOutlined />}
                    htmlType="submit"
                    style={{ ...(xs && { width: '100%' }) }}
                    onClick={() => window.open(getTemplateDlLink(activeSemester?._id || selectedSemester, subjectId), '_blank')}
                >
                    Download Template
                </Button>
                <Button
                    type="primary"
                    icon={<CloudUploadOutlined />}
                    htmlType="submit"
                    style={{ ...(xs && { width: '100%' }) }}
                    onClick={() => setNewStudentsModal(true)}
                >
                    Upload Grades
                </Button>
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
            <NewStudentsModal
                title="Add Student"
                destroyOnClose={true}
                width={450}
                open={newStudentsModal}
                onCancel={() => setNewStudentsModal(false)}
                subjectDetailProps={subjectDetailProps}
            />
            <StudentDetailModal
                title="Student Detail (Refactor)"
                destroyOnClose={true}
                width={450}
                open={studentDetailModal}
                onCancel={() => setStudentDetailModal(false)}
                // subjectDetailProps={subjectDetailProps}
            />
        </>
    );
};

export default SubjectDetailPage;