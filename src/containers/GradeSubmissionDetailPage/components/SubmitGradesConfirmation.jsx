import { useRef } from 'react';
import { Flex, Button, Modal, Form } from 'antd';

import SkeletonSelect from '../../../components/CustomUI/SkeletonSelect';
import SkeletonTextArea from '../../../components/CustomUI/SkeletonTextArea';
import { filterOption, formatFullName } from '../../../helpers/general';

const { Item } = Form;

const SubmitGradesConfirmation = ({ gradeSubmissionDetailProps, handleSubmit, ...rest }) => {
    const formRef = useRef(null);

    const {
        loadingReviewers,
        reviewers,
        loadingSubmit,
        gradeSubmission,
    } = gradeSubmissionDetailProps;
    const { reviewer, remark } = gradeSubmission || {};

    return (
        <Modal
            { ...rest }
            footer={null}
        >
            <Form
                ref={formRef}
                initialValues={{
                    ...(reviewer && { admin_id: reviewer._id }),
                    ...(remark && { remark }),
                }}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ width: 400, marginTop: 20 }}
            >
                <Item
                    name="admin_id"
                    label="Reviewer:"
                    rules={[
                        {
                            required: true,
                            message: 'Reviewer is required',
                        },
                    ]}
                >
                    <SkeletonSelect
                        loading={loadingReviewers}
                        placeholder="Select reviewer"
                        allowClear
                        showSearch
                        filterOption={filterOption}
                        options={reviewers.map(reviewer => {
                            return {
                                label: formatFullName(reviewer),
                                value: reviewer._id,
                            };
                        })}
                    />
                </Item>
                <Item
                    name="remark"
                    label="Remarks:"
                >
                    <SkeletonTextArea
                        // loading={true}
                        placeholder="Enter remarks"
                        allowClear
                    />
                </Item>
                <Item>
                    <Flex justify="end">
                        <Button
                            loading={loadingSubmit}
                            type="primary"
                            htmlType="submit"
                            style={{ minWidth: 80 }}
                        >
                            Confirm and Submit
                        </Button>
                    </Flex>
                </Item>
            </Form>
        </Modal>
    );
};

export default SubmitGradesConfirmation;