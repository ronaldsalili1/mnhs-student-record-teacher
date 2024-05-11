import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Empty, Spin } from 'antd';

import { get } from '../../helpers/request';
import SkeletonSelect from '../CustomUI/SkeletonSelect';
import { formatFullName } from '../../helpers/general';

const StudentSelection = ({ formRef, name, defaultValue, width, query }) => {
    const { xs } = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [loadingStudents, setLoadingStudents] = useState(false);
    const [loadingStudentsInit, setLoadingStudentsInit] = useState(true);
    const [students, setStudents] = useState([]);
    const [studentSearchKey, setStudentSearchKey] = useState('');

    const getStudentOptions = async () => {
        setLoadingStudents(true);

        const response = await get({
            uri: '/teacher/students/options',
            navigate,
            location,
            query: {
                ...query,
                ...(studentSearchKey !== '' && { keyword: studentSearchKey }),
                exclude_students_in_section: false,
            },
        });
        if (response?.meta?.code !== 200) {
            setLoadingStudents(false);
            return;
        }

        setStudents(response?.data?.students);
        setLoadingStudents(false);
        setLoadingStudentsInit(false);
    };

    useEffect(() => {
        let timeout;
        timeout = setTimeout(() => {
            getStudentOptions();
        }, 500);

        return () => timeout && clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentSearchKey]);
    
    return (
        <SkeletonSelect
            loading={loadingStudentsInit}
            placeholder="Select Student"
            defaultValue={defaultValue}
            allowClear
            showSearch
            notFoundContent={loadingStudents ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
            filterOption={false}
            onSearch={value => setStudentSearchKey(value)}
            options={students.map(student => ({
                label: formatFullName(student),
                value: student._id,
            }))}
            onChange={value => {
                const form = formRef?.current;
                if (name && form) {
                    form.setFieldValue(name, value);
                }
            }}
            onClear={() => {
                setStudentSearchKey('');
                getStudentOptions();
            }}
            style={{ width: width || 200, ...(xs && { width: '100%' }) }}
        />
    );
};

export default StudentSelection;