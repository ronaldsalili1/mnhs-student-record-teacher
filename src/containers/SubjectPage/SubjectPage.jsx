import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Flex, Table, Typography, Grid } from 'antd';

import { capitalizeFirstLetter, getParamsFromUrl, objectToQueryString } from '../../helpers/general';
import { NavigationContext } from '../../providers/NavigationProvider';
import useSubject from '../../hooks/useSubject';
import { PlusSquareFilled } from '@ant-design/icons';
import SubjectSearchModal from '../../components/SubjectSearchModal';
import SubjectConfirmationModal from './components/SubjectConfirmationModal';

const { Link } = Typography;

const SubjectPage = () => {
    const layoutState = useContext(NavigationContext);
    const { setTitle } = layoutState;
    const { xs } = Grid.useBreakpoint();

    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();
    const { subjects, loadingSubjects, getSubjects, page, limit, total, loadingSubmit, createSectionSubjects, meta } = useSubject();

    const [addSubjectModal, setAddSubjectModal] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [confirmation, setConfirmation] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        setTitle('Subjects');

        return () => setTitle(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (meta && meta.code === 200) {
            setConfirmation(false);
            setAddSubjectModal(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: data => {
                return capitalizeFirstLetter(data);
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Link
                        onClick={() => navigate(`/subjects/${record._id}`)}
                    >
						View
                    </Link>   
                );
            },
        },
    ];

    const onAddSubjectsConfirmation = () => {
        createSectionSubjects({
            fields: {
                section_id: selectedSection,
                subject_ids: selectedSubjects,
            },
        });
    };

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
                    onClick={() => setAddSubjectModal(true)}
                >
                    Add Subjects
                </Button>
            </Flex>
            <Table
                loading={loadingSubjects}
                scroll={ { x: true } }
                dataSource={subjects.map(subject => {
                    return { ...subject, key: subject._id };
                })}
                columns={columns}
                pagination={{
                    current: page,
                    showSizeChanger: true,
                    onChange: (current, pageSize) => {
                        const queryObj = { ...query, page: current, limit: pageSize };
                        getSubjects(queryObj);
                        const queryString = objectToQueryString(queryObj);
                        navigate(`${location.pathname}${queryString}`);
                    },
                    position: ['bottomRight'],
                    total,
                    pageSize: limit,
                }}
            />
            <SubjectSearchModal
                title="Subjects"
                width={800}
                open={addSubjectModal}
                destroyOnClose={true}
                maskClosable={false}
                onCancel={() => setAddSubjectModal(false)}
                selectedSubjects={selectedSubjects}
                setSelectedSubjects={setSelectedSubjects}
                exclude={subjects.map(subject => subject._id)}
                actionComponent={(
                    <Button
                        disabled={selectedSubjects.length === 0}
                        size="large"
                        type="primary"
                        icon={<PlusSquareFilled />}
                        htmlType="submit"
                        style={{ width: '100%', marginTop: 10 }}
                        onClick={() => setConfirmation(true)}
                    >
                        Save Selected Subjects
                    </Button>
                )}
            />
            <SubjectConfirmationModal
                title="Confirmation"
                destroyOnClose={true}
                width={450}
                open={confirmation}
                onCancel={() => setConfirmation(false)}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                loadingSubmit={loadingSubmit}
                onConfirm={onAddSubjectsConfirmation}
            />
        </>
    );
};

export default SubjectPage;