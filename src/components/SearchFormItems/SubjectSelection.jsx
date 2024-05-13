import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Empty, Spin } from 'antd';

import { get } from '../../helpers/request';
import SkeletonSelect from '../CustomUI/SkeletonSelect';


const SubjectSelection = ({ formRef, name, defaultValue, width }) => {
    const { xs } = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [loadingSubjectsInit, setLoadingSubjectsInit] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [subjectSearchKey, setSubjectSearchKey] = useState('');

    const getSubjectOptions = async () => {
        setLoadingSubjects(true);

        const response = await get({
            uri: '/teacher/subjects/options',
            navigate,
            location,
            query: {
                limit: 4,
                ...(subjectSearchKey !== '' && { keyword: subjectSearchKey }),
            },
        });
        if (response?.meta?.code !== 200) {
            setLoadingSubjects(false);
            setLoadingSubjectsInit(false);
            return;
        }

        setSubjects(response?.data?.subjects);
        setLoadingSubjects(false);
        setLoadingSubjectsInit(false);
    };

    useEffect(() => {
        let timeout;
        timeout = setTimeout(() => {
            getSubjectOptions();
        }, 500);

        return () => timeout && clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectSearchKey]);
    
    return (
        <SkeletonSelect
            loading={loadingSubjectsInit}
            placeholder="Select Subject"
            defaultValue={defaultValue}
            allowClear
            showSearch
            notFoundContent={loadingSubjects ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
            filterOption={false}
            onSearch={value => setSubjectSearchKey(value)}
            options={subjects.map(subject => ({
                label: subject.name,
                value: subject._id,
            }))}
            onChange={value => {
                const form = formRef?.current;
                if (name && form) {
                    form.setFieldValue(name, value);
                }
            }}
            onClear={() => {
                setSubjectSearchKey('');
                getSubjectOptions();
            }}
            style={{ width: width || 200, ...(xs && { width: '100%' }) }}
        />
    );
};

export default SubjectSelection;