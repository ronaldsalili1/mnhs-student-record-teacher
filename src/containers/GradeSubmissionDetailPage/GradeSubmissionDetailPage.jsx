import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, Typography, Flex, Button, Grid, Divider, Modal, Form, Space, Alert, Upload } from 'antd';
import { ExclamationCircleFilled, CloudDownloadOutlined, CloudUploadOutlined } from '@ant-design/icons';

import config from '../../config';
import { NavigationContext } from '../../providers/NavigationProvider';
import { AuthContext } from '../../providers/AuthProvider';
import { formatFullName, removeObjNilValues } from '../../helpers/general';
import DownloadTemplateModal from './components/DownloadTemplateModal';
import SubmitGradesConfirmation from './components/SubmitGradesConfirmation';
import useGradeSubmissionDetail from '../../hooks/GradeSubmissionDetailPage/useGradeSubmissionDetail';
import EditableCell from './components/EditableCell';
import { formatSemester } from '../../helpers/semester';

const { Link } = Typography;
const { confirm } = Modal;

const GradeSubmissionDetailPage = () => {
    const layoutState = useContext(NavigationContext);
    const { activeSemester } = useContext(AuthContext);
    const { setTitle, setBreadcrumbItems, notificationApi } = layoutState;
    const navigate = useNavigate();
    const { xs } = Grid.useBreakpoint();

    const { gradeSubmissionId } = useParams();
    const [form] = Form.useForm();
    const gradeSubmissionDetailProps = useGradeSubmissionDetail();
    const {
        getReviewerOptions,
        createOrUpdateGradeSubmission,
        meta,
        studentGradeData,
        setStudentGradeData,
        semester,
        quarter,
        setQuarter,
        setSemester,
        subject,
        setSubject,
        loadingGrades,
        gradeSubmission,
        setLoadingGrades,
    } = gradeSubmissionDetailProps;

    const [dlTempModal, setDlTempModal] = useState(false);
    const [submitModal, setSubmitModal] = useState(false);
    const [editingKey, setEditingKey] = useState('');

    const uploadProps = {
        accept: '.xlsx',
        name: 'file',
        maxCount: 1,
        showUploadList: false,
        multiple: false,
        withCredentials: true,
        action: `${config.api}/teacher/grades/upload`,
        onChange(info) {
            const { status, name, response } = info.file;
    
            if (status === 'uploading') {
                setLoadingGrades(true);
            }
    
            if (status === 'done') {
                notificationApi['success']({
                    message: `${name} uploaded successfully`,
                    placement: 'bottomRight',
                });
    
                setSemester(response?.data?.semester || null);
                setSubject(response?.data?.subject || null);
                setQuarter(response?.data?.quarter || null);
                setStudentGradeData(response?.data?.student_grade_data || []);
                setLoadingGrades(false);
            } else if (status === 'error') {
                notificationApi['error']({
                    message: response?.meta?.message || `${name} upload failed`,
                    placement: 'bottomRight',
                });
                setLoadingGrades(false);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
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
                const newStudentGradeData = [...studentGradeData];
                const studentGradeIndex = studentGradeData.findIndex(data => data._id === id);
                newStudentGradeData.splice(studentGradeIndex, 1);
                setStudentGradeData([...newStudentGradeData]);
            },
        });
    };

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newStudentGradeData = [...studentGradeData];
            const studentGradeIndex = newStudentGradeData.findIndex(data => data._id === key);
            
            // Update data
            const studentData = newStudentGradeData[studentGradeIndex];
            studentData.grade = row.grade;

            setStudentGradeData(newStudentGradeData);
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = useMemo(() => {
        const cols = [
            {
                title: 'Name (Last, First, Middle, Suffix)',
                dataIndex: 'name',
                key: 'name',
                render: (_, record) => formatFullName(record.student),
            },
            {
                title: 'LRN',
                dataIndex: 'lrn',
                key: 'lrn',
                render: (_, record) => record.student.lrn,
            },
            {
                title: 'Grade',
                dataIndex: 'grade',
                key: 'grade',
                width: 100,
                onCell: (record) => ({
                    record,
                    inputType: 'number',
                    dataIndex: 'grade',
                    title: 'grade',
                    editing: isEditing(record),
                }),
                render: data => data || '-',
            },
        ];

        if (!gradeSubmission || gradeSubmission?.status === 'pending') {
            cols.push({
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                width: 120,
                render: (_, record) => {
                    const editable = isEditing(record);
                    return editable ? (
                        <span>
                            <Link
                                onClick={() => save(record.key)}
                                style={{
                                    marginRight: 8,
                                }}
                            >
                                Save
                            </Link>
                            <Link onClick={cancel}>
                                <a>Cancel</a>
                            </Link>
                        </span>
                    ) : (
                        <>
                            <Link
                                disabled={editingKey !== ''}
                                onClick={() => edit(record)}
                            >
                                Edit
                            </Link>
                            <Divider type="vertical"/>
                            <Link
                                type="danger"
                                onClick={() => confirmDelete(record._id)}
                            >
                                Delete
                            </Link>    
                        </>
                    );
                },
            });
        }

        return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gradeSubmission]);

    const handleSubmit = values => {
        const fields = {
            ...removeObjNilValues(values),
            subject_id: subject._id,
            quarter,
            grades: studentGradeData.map(studentGrade => {
                const { student, grade } = studentGrade || {};

                return {
                    student_id: student._id,
                    ...(grade && { grade }),
                };
            }),
        };

        createOrUpdateGradeSubmission({ fields });
    };

    useEffect(() => {
        setBreadcrumbItems([
            {
                title: 'Grade Submission',
                href: '',
                onClick: (e) => {
                    e.preventDefault();
                    navigate('/grade-submission');
                },
            },
            {
                title: gradeSubmissionId ? 'Details' : 'Create',
            },
        ]);

        if (!gradeSubmissionId) {
            setTitle('New Grade Submission');
        } else {
            setTitle('Grade Submission Details');
        }

        return () => {
            setTitle(null);
            setBreadcrumbItems([]);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gradeSubmissionId]);

    useEffect(() => {
        if (meta && meta.code === 200) {
            setSubmitModal(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta]);

    return (
        <>
            <Flex
                vertical
                gap={10}
                style={{ margin: '30px 0px 15px' }}
            >
                {
                    !gradeSubmissionId &&
                    <Alert
                        message="Attention: Do Not Reload or Leave the Page! Data Loss Possible! "
                        description="Please note that reloading or leaving the page without submitting may result in potential data loss. Ensure you complete the necessary actions before proceeding further."
                        type="warning"
                        showIcon
                        closable
                    />
                }
                <Flex gap={10}>
                    <span>
                        <strong>Semester:</strong>
                    </span>
                    <span>
                        {
                            semester ? 
                                formatSemester(semester)
                                : '-'
                        }
                    </span>
                </Flex>
                <Flex gap={18}>
                    <span>
                        <strong>Quarter:</strong>
                    </span>
                    <span>
                        { quarter ? quarter === 1 ? '1st' : '2nd' : '-' }
                    </span>
                </Flex>
                <Flex gap={21}>
                    <span>
                        <strong>Subject:</strong>
                    </span>
                    <span>
                        {subject ? subject.name : '-'}
                    </span>
                </Flex>
                {
                    gradeSubmissionId &&
                    <>
                        <Flex gap={15}>
                            <span>
                                <strong>Reviewer:</strong>
                            </span>
                            <span>
                                {gradeSubmission ? formatFullName(gradeSubmission.reviewer) : '-'}
                            </span>
                        </Flex>
                        <Flex gap={19}>
                            <span>
                                <strong>Remarks:</strong>
                            </span>
                            <span>
                                {gradeSubmission ? gradeSubmission?.remark : '-'}
                            </span>
                        </Flex>

                    </>
                }
            </Flex>
            <Form
                form={form}
                component={false}
            >
                <Table
                    loading={loadingGrades}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    scroll={ { x: true } }
                    dataSource={studentGradeData.map(data => {
                        return { ...data, key: data._id };
                    })}
                    bordered
                    columns={columns}
                    pagination={{
                        showSizeChanger: true,
                        total: studentGradeData.length,
                    }}
                />
            </Form>
            {
                (!gradeSubmission || gradeSubmission?.status === 'pending') &&
                <Flex
                    justify={gradeSubmission ? 'end' : 'space-between'}
                    style={{ marginTop: 20 }}
                >
                    {
                        !gradeSubmission &&
                        <Space>
                            <Upload {...uploadProps}>
                                <Button
                                    disabled={gradeSubmissionId}
                                    icon={<CloudUploadOutlined />}
                                    style={{ ...(xs && { width: '100%' }) }}
                                >
                                    Upload Grades
                                </Button>
                            </Upload>
                            <Button
                                disabled={gradeSubmissionId}
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
                                        setDlTempModal(true);
                                    }
                                }}
                            >
                                Download Template
                            </Button>
                        </Space>
                    }
                    <Button
                        type="primary"
                        style={{ minWidth: 80 }}
                        disabled={studentGradeData.length == 0 }
                        onClick={() => {
                            getReviewerOptions();
                            setSubmitModal(true);
                        }}
                    >
                        Submit
                    </Button>
                </Flex>
            }
            <DownloadTemplateModal
                title="Download Grade Template"
                // destroyOnClose={true}
                width={450}
                open={dlTempModal}
                onCancel={() => setDlTempModal(false)}
                setDlTempModal={setDlTempModal}
            />
            <SubmitGradesConfirmation
                title="Grades Submission Confirmation"
                destroyOnClose={true}
                width={450}
                open={submitModal}
                onCancel={() => setSubmitModal(false)}
                gradeSubmissionDetailProps={gradeSubmissionDetailProps}
                handleSubmit={handleSubmit}
            />
        </>
    );
};

export default GradeSubmissionDetailPage;