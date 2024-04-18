import { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Grid } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { getParamsFromUrl, objectToQueryString } from '../../../helpers/general';
import SectionSelection from '../../../components/SearchFormItems/SectionSelection';

const { Item } = Form;

const commonItemStyle = {
    margin: 0,
};

const AdviseeSearchForm = (props) => {
    const searchFormRef = useRef(null);
    const { xs } = Grid.useBreakpoint();
    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();
    const { getAdvisees } = props;
    const { page, limit } = query || {};
    
    return (
        <Form
            ref={searchFormRef}
            initialValues={query}
            onFinish={values => {
                const { section_id, keyword } = values;
                const queryObj = {
                    ...(page && { page }),
                    ...(limit && { limit }),
                    ...(section_id && { section_id }),
                    ...(keyword && { keyword }),
                };
                getAdvisees(queryObj);
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
                name="section_id"
                style={{
                    ...commonItemStyle,
                    ...(xs && { width: '100%' }),
                }}
            >
                <SectionSelection
                    formRef={searchFormRef}
                    name="section_id"
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

export default AdviseeSearchForm;