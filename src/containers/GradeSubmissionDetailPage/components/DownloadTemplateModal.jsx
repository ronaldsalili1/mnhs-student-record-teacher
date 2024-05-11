import { useContext, useEffect, useMemo, useRef } from 'react';
import { Flex, Button, Modal, Form, Select } from 'antd';

import { getTemplateDlLink } from '../../../helpers/grade';
import SubjectSelection from '../../../components/SearchFormItems/SubjectSelection';
import { AuthContext } from '../../../providers/AuthProvider';

const { Item } = Form;

const DownloadTemplateModal = ({ setDlTempModal, ...rest }) => {
    const formRef = useRef(null);
    const { teacher } = useContext(AuthContext);
    const sections = useMemo(() => {
        return teacher?.sections || [];
    }, [teacher]);

    return (
        <Modal
            { ...rest }
            footer={null}
        >
            <Form
                ref={formRef}
                layout="vertical"
                initialValues={{ section_id: sections.length !== 0 ? sections[0]._id : null }}
                onFinish={values => {
                    const { subject_id, section_id, quarter } =  values;
                    window.open(getTemplateDlLink(subject_id, section_id, quarter), '_blank');
                    setDlTempModal(false);
                }}
                style={{ width: 400, marginTop: 20 }}
            >
                <Item
                    name="section_id"
                    label="Section:"
                    rules={[
                        {
                            required: true,
                            message: 'Section is required',
                        },
                    ]}
                >
                    <Select
                        placeholder="Select Section"
                        options={sections.map(section => ({
                            label: section.name,
                            value: section._id,
                        }))}
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
                    <SubjectSelection
                        formRef={formRef}
                        name="subject_id"
                        width="100%"
                    />
                </Item>
                <Item
                    name="quarter"
                    label="Quarter:"
                    rules={[
                        {
                            required: true,
                            message: 'Quarter is required',
                        },
                    ]}
                >
                    <Select
                        placeholder="Select Quarter"
                        options={[
                            {
                                label: 1,
                                value: 1,
                            },
                            {
                                label: 2,
                                value: 2,
                            }
                        ]}
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