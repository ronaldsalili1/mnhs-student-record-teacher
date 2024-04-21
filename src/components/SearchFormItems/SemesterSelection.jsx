import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Empty, Spin, Popover } from 'antd';

import { get } from '../../helpers/request';
import { formatSemester } from '../../helpers/semester';
import SkeletonSelect from '../CustomUI/SkeletonSelect';


const SemesterSelection = ({ formRef, name, defaultValue }) => {
    const { xs } = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [loadingSemesters, setLoadingSemesters] = useState(false);
    const [loadingSemestersInit, setLoadingSemestersInit] = useState(true);
    const [semesters, setSemesters] = useState([]);
    const [semesterYear, setSemesterYear] = useState('');

    const getSemesterOptions = async () => {
        setLoadingSemesters(true);

        const response = await get({
            uri: '/teacher/semesters/options',
            navigate,
            location,
            query: {
                ...(semesterYear !== '' && { year: semesterYear }),
            },
        });
        if (response?.meta?.code !== 200) {
            setLoadingSemestersInit(false);
            setLoadingSemesters(false);
            return;
        }

        setSemesters(response?.data?.semesters);
        setLoadingSemesters(false);
        setLoadingSemestersInit(false);
    };

    const activeSemester = useMemo(() => {
        return semesters.find(semester => semester.status === 'active');
    }, [semesters]);
 

    useEffect(() => {
        let timeout;
        timeout = setTimeout(() => {
            getSemesterOptions();
        }, 500);

        return () => timeout && clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [semesterYear]);
    
    return (
        <Popover
            content="Enter a Year"
            trigger="click"
            placement="topLeft"
        >
            <SkeletonSelect
                loading={loadingSemestersInit}
                defaultValue={defaultValue || activeSemester?._id}
                placeholder="Select Semester"
                showSearch
                notFoundContent={loadingSemesters ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                filterOption={false}
                onSearch={value => setSemesterYear(value)}
                options={semesters.map(semester => ({
                    label: formatSemester(semester),
                    value: semester._id,
                }))}
                onChange={value => {
                    const form = formRef?.current;
                    if (name && form) {
                        form.setFieldValue(name, value);
                    }
                }}
                onClear={() => {
                    setSemesterYear('');
                    getSemesterOptions();
                }}
                style={{ width: 250, ...(xs && { width: '100%' }) }}
            />
        </Popover>
    );
};

export default SemesterSelection;