import { useMemo, useRef } from 'react';
import { Modal, Form, Button, Flex } from 'antd';

import SkeletonSelect from '../../../components/CustomUI/SkeletonSelect';
import { filterOption, formatFullName } from '../../../helpers/general';
import { formatSemester } from '../../../helpers/semester';

const { Item } = Form;

const NewStudentsModal = ({ subjectDetailProps, ...rest }) => {
    const formRef = useRef(null);

    const {
        loadingSemesters,
        loadingStudentOpts,
        loadingSubmit,
        studentOpts,
        semesters,
        createStudent,
    } = subjectDetailProps;
    
    const activeSemester = useMemo(() => {
        return semesters.find(semester => semester.status === 'active') ;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [semesters]);

    return (
        <Modal
            { ...rest }
            footer={null}
        >
            <Form
                ref={formRef}
                layout="vertical"
                initialValues={activeSemester ? {
                    semester_id: activeSemester._id,
                } : {}}
                onFinish={values => {
                    createStudent({ fields: values });
                }}
                style={{
                    width: '100%',
                    marginTop: 20,
                }}
            >
                <Item
                    name="semester_id"
                    label="Semester:"
                    rules={[
                        {
                            required: true,
                            message: 'Semester is required',
                        },
                    ]}
                >
                    <SkeletonSelect
                        disabled={true}
                        loading={loadingSemesters}
                        placeholder="Select Semester"
                        showSearch
                        filterOption={filterOption}
                        options={semesters.map(semester => {
                            return {
                                label: formatSemester(semester),
                                value: semester._id,
                            };
                        })}
                    />
                </Item>
                <Item
                    name="student_ids"
                    label="Students:"
                    rules={[
                        {
                            required: true,
                            message: 'Students are required',
                        },
                    ]}
                >
                    <SkeletonSelect
                        loading={loadingStudentOpts}
                        placeholder="Select Student"
                        mode="multiple"
                        showSearch
                        filterOption={filterOption}
                        options={studentOpts.map(student => ({
                            label: formatFullName(student),
                            value: student._id,
                        }))}
                    />
                </Item>
                
                <Item style={{ margin: 0 }}>
                    <Flex justify="end">
                        <Button
                            loading={loadingSubmit}
                            type="primary"
                            htmlType="submit"
                            style={{ minWidth: 80 }}
                        >
                            Save
                        </Button>
                    </Flex>
                </Item>
            </Form>
        </Modal>
    );
};

export default NewStudentsModal;