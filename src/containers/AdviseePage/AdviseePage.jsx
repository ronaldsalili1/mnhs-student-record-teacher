import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Typography, Flex, Button, Grid, Modal, Alert } from 'antd';
import { PlusSquareFilled, ExclamationCircleFilled } from '@ant-design/icons';

import { formatFullName, getParamsFromUrl, objectToQueryString } from '../../helpers/general';
import { NavigationContext } from '../../providers/NavigationProvider';
import useAdvisee from '../../hooks/useAdvisee';
import AdviseeSearchForm from './components/AdviseeSearchForm';
import StudentSearchModal from '../../components/StudentSearchModal';
import AdviseeConfirmationModal from './components/AdviseeConfirmationModal';
import { AuthContext } from '../../providers/AuthProvider';

const { confirm } = Modal;
const { Link } = Typography;

const AdviseePage = () => {
    const layoutState = useContext(NavigationContext);
    const { setTitle } = layoutState;
    const { teacher } = useContext(AuthContext);
    const { sections } = teacher || {};
    const { xs } = Grid.useBreakpoint();

    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();
    const adviseeProps = useAdvisee();
    const {
        meta,
        getAdvisees,
        loadingAdvisees,
        total,
        page,
        limit,
        advisees,
        createSectionStudents,
        loadingSubmit,
        deleteSectionStudentById,
    } = adviseeProps;

    const [addStudentsModal, setAddStudentsModal] = useState(false);
    const [confirmation, setConfirmation] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);

    const onAddStudentConfirmation = () => {
        createSectionStudents({
            fields: {
                section_id: selectedSection,
                student_ids: selectedStudents,
            },
        });
    };

    const confirmDelete = (id) => {
        confirm({
            title: 'Are you sure you want to delete this record?',
            icon: <ExclamationCircleFilled />,
            okButtonProps: {
                danger: true,
            },
            okText: 'Delete',
            onOk: () => {
                deleteSectionStudentById(id);
            },
        });
    };

    useEffect(() => {
        setTitle('Subjects');

        return () => setTitle(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (meta && meta.code === 200) {
            setConfirmation(false);
            setAddStudentsModal(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            title: 'Section',
            dataIndex: 'section',
            key: 'section',
            render: (_, record) => record?.section_student?.section?.name || '-',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Link
                        type="danger"
                        onClick={() => confirmDelete(record?.section_student?._id)}
                    >
						Delete
                    </Link>   
                );
            },
        },
    ];

    return (
        <>
            {
                teacher && sections.length === 0 &&
                <Alert
                    message="You are currently not designated as an adviser for any particular section"
                    type="error"
                />
            }
            <Flex
                justify="end"
                wrap="wrap"
                gap={10}
                style={{ margin: '10px 0px' }}
            >
                <AdviseeSearchForm {...adviseeProps}/>
                <Button
                    type="primary"
                    icon={<PlusSquareFilled />}
                    htmlType="submit"
                    style={{ ...(xs && { width: '100%' }) }}
                    onClick={() => setAddStudentsModal(true)}
                >
                    Add Student
                </Button>
            </Flex>
            <Table
                loading={loadingAdvisees}
                scroll={ { x: true } }
                dataSource={advisees.map(advisee => {
                    return { ...advisee, key: advisee._id };
                })}
                columns={columns}
                pagination={{
                    current: page,
                    showSizeChanger: true,
                    onChange: (current, pageSize) => {
                        const queryObj = { ...query, page: current, limit: pageSize };
                        getAdvisees(queryObj);
                        const queryString = objectToQueryString(queryObj);
                        navigate(`${location.pathname}${queryString}`);
                    },
                    position: ['bottomRight'],
                    total,
                    pageSize: limit,
                }}
            />
            <StudentSearchModal
                title="Add Students"
                width={800}
                open={addStudentsModal}
                destroyOnClose={true}
                maskClosable={false}
                onCancel={() => setAddStudentsModal(false)}
                selectedStudents={selectedStudents}
                setSelectedStudents={setSelectedStudents}
                searchBySection={false}
                exclude={advisees.map(advisee => advisee._id)}
                excludeStudentsInSection={true}
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
            <AdviseeConfirmationModal
                title="Confirmation"
                destroyOnClose={true}
                width={450}
                open={confirmation}
                onCancel={() => setConfirmation(false)}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                loadingSubmit={loadingSubmit}
                onConfirm={onAddStudentConfirmation}
            />
        </>
    );
};

export default AdviseePage;