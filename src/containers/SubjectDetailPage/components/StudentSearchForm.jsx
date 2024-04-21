import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Grid } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { filterOption, getParamsFromUrl, objectToQueryString } from '../../../helpers/general';
import SkeletonSelect from '../../../components/CustomUI/SkeletonSelect';
import { formatSemester } from '../../../helpers/semester';
import SemesterSelection from '../../../components/SearchFormItems/SemesterSelection';

const { Item } = Form;

const commonItemStyle = {
    margin: 0,
};

const StudentSearchForm = (props) => {
    const searchFormRef = useRef(null);
    const { xs } = Grid.useBreakpoint();
    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();
    const { getStudents } = props;
    const { page, limit } = query || {};
    
    return (
        <Form
            ref={searchFormRef}
            initialValues={query}
            onFinish={values => {
                const { semester_id, keyword } = values;
                const queryObj = {
                    ...(page && { page }),
                    ...(limit && { limit }),
                    ...(semester_id && { semester_id }),
                    ...(keyword && { keyword }),
                };
                getStudents(queryObj);
                const queryString = objectToQueryString(queryObj);
                navigate(`${location.pathname}${queryString}`);
            }}
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
            }}
        >
            <Item
                name="semester_id"
                style={{
                    ...commonItemStyle,
                    ...(xs && { width: '100%' }),
                }}
            >
                <SemesterSelection
                    formRef={searchFormRef}
                    name="semester_id"
                    defaultValue={query?.semester_id ? query.semester_id : null}
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
    );
};

export default StudentSearchForm;