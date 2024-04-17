import { Flex, Button, Modal, Form } from 'antd';

import SkeletonSelect from '../../../components/CustomUI/SkeletonSelect';
import { filterOption } from '../../../helpers/general';
import { getTemplateDlLink } from '../../../helpers/grade';
import { formatSemester } from '../../../helpers/semester';

const { Item } = Form;

const DownloadTemplateModal = ({ gradeSubmissionDetailProps, activeSemester, setDlTempModal, ...rest }) => {
    const { semesters, loadingSemesters, subjects, loadingSubjects } = gradeSubmissionDetailProps;

    return (
        <Modal
            { ...rest }
            footer={null}
        >
            <Form
                layout="vertical"
                initialValues={activeSemester ? {
                    semester_id: activeSemester._id,
                } : {}}
                onFinish={values => {
                    const { semester_id, subject_id } =  values;
                    window.open(getTemplateDlLink(semester_id, subject_id), '_blank');
                    setDlTempModal(false);
                }}
                style={{ width: 400, marginTop: 20 }}
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
                    name="subject_id"
                    label="Subject:"
                    rules={[
                        {
                            required: true,
                            message: 'Subject is required',
                        },
                    ]}
                >
                    <SkeletonSelect
                        loading={loadingSubjects}
                        placeholder="Select Subject"
                        showSearch
                        filterOption={filterOption}
                        options={subjects.map(subject => {
                            return {
                                label: subject.name,
                                value: subject._id,
                            };
                        })}
                    />
                </Item>
                <Item>
                    <Flex justify="end">
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ minWidth: 80 }}
                        >
                            Download
                        </Button>
                    </Flex>
                </Item>
            </Form>
        </Modal>
    );
};

export default DownloadTemplateModal;