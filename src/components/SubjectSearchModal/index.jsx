import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Grid, Button, Flex, Table, Alert, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { capitalizeFirstLetter, formatFullName } from '../../helpers/general';
import { get } from '../../helpers/request';
import options from '../../constants/options';

const { Item } = Form;
const commonItemStyle = {
    margin: 0,
};

const SubjectSearchModal = ({ actionComponent, selectedSubjects, setSelectedSubjects, exclude, ...rest }) => {
    const formRef = useRef(null);
    const { xs } = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [meta, setMeta] = useState(null);
    const [loadingSubjects, setLoadingSubjects] = useState();
    const [subjects, setSubjects] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { open } = rest;

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
    ];

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedSubjects(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys: selectedSubjects,
        onChange: onSelectChange,
    };

    const getSubjects = async (query) => {
        setLoadingSubjects(true);

        const response = await get({
            uri: '/teacher/subjects/options',
            navigate,
            location,
            query,
        });
        if (response?.meta?.code !== 200) {
            setLoadingSubjects(false);
            setMeta(response?.meta);
            return;
        }

        setMeta(null);
        setTotal(response?.data?.total);
        setPage(response?.data?.page);
        setLimit(response?.data?.limit);
        setSubjects(response?.data?.subjects);
        setLoadingSubjects(false);
    };

    useEffect(() => {
        if (!open) {
            setSelectedSubjects([]);
            setSubjects([]);
            setTotal(0);
            setPage(1);
            setLimit(10);
        } else {
            const query = {
                ...(page && { page }),
                ...(limit && { limit }),
                ...(exclude && { exclude: JSON.stringify(exclude) }),
            };
            getSubjects(query);
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
                        const { keyword, type } = values;
                        const query = {
                            ...(page && { page }),
                            ...(limit && { limit }),
                            ...(type && { type }),
                            ...(keyword && { keyword }),
                            ...(exclude && { exclude: JSON.stringify(exclude) }),
                        };
                        getSubjects(query);
                    }}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 10,
                    }}
                >
                    <Item
                        name="type"
                        style={{
                            ...commonItemStyle,
                            ...(xs && { width: '100%' }),
                        }}
                    >
                        <Select
                            allowClear
                            placeholder="Select Type"
                            options={options.subjectType}
                            style={{ width: 220, ...(xs && { width: '100%' }) }}
                        />
                    </Item>
                    <Item
                        name="keyword"
                        style={{
                            ...commonItemStyle,
                            ...(xs && { width: '100%' }),
                        }}
                    >
                        <Input
                            allowClear
                            placeholder="Search by Name"
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
                loading={loadingSubjects}
                scroll={ { x: true } }
                rowSelection={rowSelection}
                dataSource={subjects.map(student => {
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

export default SubjectSearchModal;