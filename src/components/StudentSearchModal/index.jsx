import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Grid, Button, Flex, Table, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { formatFullName } from '../../helpers/general';
import SectionSelection from '../SearchFormItems/SectionSelection';
import { get } from '../../helpers/request';

const { Item } = Form;
const commonItemStyle = {
    margin: 0,
};

const StudentSearchModal = ({ searchBySection=false, actionComponent, selectedStudents, setSelectedStudents, exclude, excludeStudentsInSection=false, ...rest }) => {
    const formRef = useRef(null);
    const { xs } = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [meta, setMeta] = useState(null);
    const [loadingStudents, setLoadingStudents] = useState();
    const [students, setStudents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { open } = rest;

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
            render: data => data ? data.name : '-',
        },
        {
            title: 'Grade Level',
            dataIndex: 'grade_level',
            key: 'grade_level',
            render: (_, record) => {
                const { section } = record || {};
                return section ? section.grade_level : '-';
            },
        },
    ];

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedStudents(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys: selectedStudents,
        onChange: onSelectChange,
    };

    const getStudents = async (query) => {
        setLoadingStudents(true);

        const response = await get({
            uri: '/teacher/students/options',
            navigate,
            location,
            query,
        });
        if (response?.meta?.code !== 200) {
            setLoadingStudents(false);
            setMeta(response?.meta);
            return;
        }

        setMeta(null);
        setTotal(response?.data?.total);
        setPage(response?.data?.page);
        setLimit(response?.data?.limit);
        setStudents(response?.data?.students);
        setLoadingStudents(false);
    };

    useEffect(() => {
        if (!open) {
            setSelectedStudents([]);
            setStudents([]);
            setTotal(0);
            setPage(1);
            setLimit(10);
        } else {
            const query = {
                ...(page && { page }),
                ...(limit && { limit }),
                ...(exclude && { exclude: JSON.stringify(exclude) }),
                exclude_students_in_section: excludeStudentsInSection,
            };
            getStudents(query);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <Modal
            { ...rest }
            footer={null}
        >
            {
                meta &&
                <Alert
                    message={meta.message}
                    type="error"
                    showIcon
                />
            }
            <Flex
                justify="end"
                wrap="wrap"
                gap={10}
                style={{ margin: '20px 0px' }}
            >
                <Form
                    ref={formRef}
                    onFinish={values => {
                        const { section_id, keyword } = values;
                        const query = {
                            ...(page && { page }),
                            ...(limit && { limit }),
                            ...(section_id && { section_id }),
                            ...(keyword && { keyword }),
                            ...(exclude && { exclude: JSON.stringify(exclude) }),
                            exclude_students_in_section: excludeStudentsInSection,
                        };
                        getStudents(query);
                    }}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 10,
                    }}
                >
                    {
                        searchBySection &&
                        <Item
                            name="section_id"
                            style={{
                                ...commonItemStyle,
                                ...(xs && { width: '100%' }),
                            }}
                        >
                            <SectionSelection
                                formRef={formRef}
                                name="section_id"
                            />
                        </Item>
                    }
                    <Item
                        name="keyword"
                        style={{
                            ...commonItemStyle,
                            ...(xs && { width: '100%' }),
                        }}
                    >
                        <Input
                            allowClear
                            placeholder="Search by Name and LRN"
                            style={{ width: 220, ...(xs && { width: '100%' }) }}
                        />
                    </Item>
                    <Item
                        style={{
                            ...commonItemStyle,
                            ...(xs && { width: '100%' }),
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<SearchOutlined/>}
                            htmlType="submit"
                            style={{ ...(xs && { width: '100%' }) }}
                        >
                            Search
                        </Button>
                    </Item>
                </Form>
            </Flex>
            <Table
                loading={loadingStudents}
                scroll={ { x: true } }
                rowSelection={rowSelection}
                dataSource={students.map(student => {
                    return { ...student, key: student._id };
                })}
                columns={columns}
                pagination={{
                    current: page,
                    showSizeChanger: true,
                    onChange: (current, pageSize) => {
                        setPage(current);
                        setLimit(pageSize);
                        formRef.current.submit();
                    },
                    position: ['bottomRight'],
                    total,
                    pageSize: limit,
                }}
            />
            {actionComponent}
        </Modal>
    );
};

export default StudentSearchModal;