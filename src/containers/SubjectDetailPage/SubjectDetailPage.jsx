import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Typography, Flex, Button, Grid, Divider, Modal } from 'antd';
import { PlusSquareFilled, ExclamationCircleFilled, CloudDownloadOutlined, CloudUploadOutlined } from '@ant-design/icons';

import { formatFullName, getParamsFromUrl, objectToQueryString } from '../../helpers/general';
import { NavigationContext } from '../../providers/NavigationProvider';
import { AuthContext } from '../../providers/AuthProvider';
import useSubjectDetail from '../../hooks/SubejctDetailPage/useSubjectDetail';
import StudentSearchForm from './components/StudentSearchForm';
import { getTemplateDlLink } from '../../helpers/grade';
import StudentSearchModal from '../../components/StudentSearchModal';
import StudentConfirmationModal from './components/StudentConfirmationModal';

const { Link } = Typography;
const { confirm } = Modal;

const SubjectDetailPage = () => {
    const layoutState = useContext(NavigationContext);
    const { activeSemester } = useContext(AuthContext);
    const { setTitle, setBreadcrumbItems, notificationApi } = layoutState;
    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();
    const { xs } = Grid.useBreakpoint();

    const subjectDetailProps = useSubjectDetail();
    const {
        loadingStudents,
        students,
        subject,
        meta,
        page,
        total,
        limit,
        getStudents,
        deleteSubjectStudentById,
        loadingSubmit,
        createStudents,
        enrolledStudents,
    } = subjectDetailProps;
        console.log('🚀 ~ students:', students);

    const [addStudentsModal, setAddStudentsModal] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [confirmation, setConfirmation] = useState(false);

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

    const onAddStudent = () => {
        createStudents({
            fields: {
                student_ids: selectedStudents,
            },
        });
    };

    useEffect(() => {
        if (meta?.code === 200) {
            setConfirmation(false);
            setAddStudentsModal(false);
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
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            render: (_, record) => {
                return (
                    <>
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
                <StudentSearchForm {...subjectDetailProps}/>
                <Button
                    type="primary"
                    icon={<PlusSquareFilled />}
                    htmlType="submit"
                    style={{ ...(xs && { width: '100%' }) }}
                    onClick={() => setAddStudentsModal(true)}
                >
                    Add Students
                </Button>
                <Button
                    type="primary"
                    icon={<CloudDownloadOutlined />}
                    htmlType="submit"
                    style={{ ...(xs && { width: '100%' }) }}
                    onClick={() => {
                        if (!activeSemester) {
                            notificationApi['error']({
                                message: `The system is currently unable to provide access 
                                                to download templates, as there is no active academic term 
                                                or semester at the moment.`,
                                placement: 'bottomRight',
                            });
                        } else {
                            window.open(getTemplateDlLink(subject._id), '_blank');
                        }
                    }}
                >
                    Download Template
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
            <StudentSearchModal
                title="Students"
                width={800}
                open={addStudentsModal}
                destroyOnClose={true}
                maskClosable={false}
                onCancel={() => setAddStudentsModal(false)}
                selectedStudents={selectedStudents}
                setSelectedStudents={setSelectedStudents}
                searchBySection={true}
                exclude={enrolledStudents}
                excludeStudentsInSection={false}
                actionComponent={(
                    <Button
                        disabled={selectedStudents.length === 0}
                        size="large"
                        type="primary"
                        icon={<PlusSquareFilled />}
                        htmlType="submit"
                        style={{ width: '100%', marginTop: 10 }}
                        onClick={() => setConfirmation(true)}
                    >
                        Save Selected Students
                    </Button>
                )}
            />
            <StudentConfirmationModal
                title="Confirmation"
                destroyOnClose={true}
                width={450}
                open={confirmation}
                onCancel={() => setConfirmation(false)}
                subject={subject}
                loadingSubmit={loadingSubmit}
                onConfirm={onAddStudent}
            />
        </>
    );
};

export default SubjectDetailPage;