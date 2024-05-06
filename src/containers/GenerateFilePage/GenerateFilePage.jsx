import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Flex, Form, Button, Typography, Select } from 'antd';

import { NavigationContext } from '../../providers/NavigationProvider';
import { AuthContext } from '../../providers/AuthProvider';
import useGenerateFile from '../../hooks/useGenerateFile';
import { formatFullName } from '../../helpers/general';
import SkeletonSelect from '../../components/CustomUI/SkeletonSelect';

const { Item } = Form;
const { Text } = Typography;

const GenerateFilePage = () => {
    const layoutState = useContext(NavigationContext);
    const authState = useContext(AuthContext);
    const { setTitle, notificationApi } = layoutState;
    const { teacher, activeSemester } = authState || {};
    const formRef = useRef(null);
    const { students, loadingStudents, generateForm, loadingSubmit } = useGenerateFile();
    const [selectedSection, setSelectedSection] = useState(null);
    
    const studentOption = useMemo(() => {
        if (!selectedSection) {
            return [];
        }

        return students.filter(student => student?.section?._id === selectedSection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [students, selectedSection]);

    useEffect(() => {
        setTitle('Generate Files');

        return () => setTitle(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sections = useMemo(() => {
        return teacher?.sections || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teacher]);

    useEffect(() => {
        const form = formRef.current;
        
        if (form && sections.length === 1) {
            const sectionId = sections[0]?._id;

            setSelectedSection(sectionId);
            form.setFieldsValue({
                section_id: sectionId,
                student_id: 'all',
            });
        }
    }, [sections]);

    return (
        <Flex justify="center">
            <Form
                ref={formRef}
                layout="vertical"
                style={{ width: 400 }}
                onFinish={values => {
                    if (!activeSemester) {
                        notificationApi['error']({
                            message: `The system is currently unable to provide access 
                                            to this feature, as there is no active academic term 
                                            or semester at the moment.`,
                            placement: 'bottomRight',
                        });
                    } else {
                        const { form, section_id, student_id } = values;
                        
                        if (student_id === 'all') {
                            generateForm(form, null, section_id);
                        } else {
                            generateForm(form, student_id, null);
                        }
                    }
                }}
            >
                <Item
                    name="form"
                    label="Form:"
                    rules={[
                        {
                            required: true,
                            message: 'Form is required',
                        },
                    ]}
                >
                    <Select
                        placeholder="Select Form"
                        options={[
                            {
                                label: 'Master Gradesheet',
                                value: 'master_gradesheet',
                            },
                            {
                                label: 'Student Form 10',
                                value: 'sf10',
                            },
                        ]}
                    />
                </Item>
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
                        onChange={value => setSelectedSection(value)}
                    />
                </Item>
                <Item
                    name="student_id"
                    label="Student:"
                    rules={[
                        {
                            required: true,
                            message: 'Student is required',
                        },
                    ]}
                >
                    <SkeletonSelect
                        loading={loadingStudents}
                        placeholder="Select Student"
                        options={[
                            {
                                label: 'All',
                                value: 'all',
                            },
                            ...studentOption.map(student => ({
                                label: formatFullName(student),
                                value: student._id,
                            })),
                        ]}
                    />
                </Item>
                <Item >
                    <Flex justify="end">
                        <Button
                            loading={loadingSubmit}
                            type="primary"
                            htmlType="submit"
                            style={{ minWidth: 80 }}
                        >
                            Generate
                        </Button>
                    </Flex>
                </Item>
            </Form>
        </Flex>
    );
};

export default GenerateFilePage;