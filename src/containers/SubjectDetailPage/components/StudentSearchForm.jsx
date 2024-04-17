import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Grid } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { filterOption, getParamsFromUrl, objectToQueryString } from '../../../helpers/general';
import SkeletonSelect from '../../../components/CustomUI/SkeletonSelect';
import { formatSemester } from '../../../helpers/semester';

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
    const { getStudents, loadingSemesters, semesters, activeSemester, setSelectedSemester } = props;
    const { page, limit } = query || {};

    useEffect(() => {
        if (!query.semester_id && activeSemester) {
            searchFormRef.current?.setFieldsValue({
                semester_id: activeSemester._id,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [semesters]);
    
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
                setSelectedSemester(semester_id);
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
                <SkeletonSelect
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
                    style={{ width: 260, ...(xs && { width: '100%' }) }}
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