import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Empty, Spin } from 'antd';

import { get } from '../../helpers/request';
import SkeletonSelect from '../CustomUI/SkeletonSelect';


const SectionSelection = ({ formRef, name, defaultValue }) => {
    const { xs } = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingSectionsInit, setLoadingSectionsInit] = useState(true);
    const [sections, setSections] = useState([]);
    const [sectionSearchKey, setSectionSearchKey] = useState('');

    const getSectionOptions = async () => {
        setLoadingSections(true);

        const response = await get({
            uri: '/teacher/sections/options',
            navigate,
            location,
            query: {
                ...(sectionSearchKey !== '' && { keyword: sectionSearchKey }),
            },
        });
        if (response?.meta?.code !== 200) {
            setLoadingSections(false);
            setLoadingSectionsInit(false);
            return;
        }

        setSections(response?.data?.sections);
        setLoadingSections(false);
        setLoadingSectionsInit(false);
    };

    useEffect(() => {
        let timeout;
        timeout = setTimeout(() => {
            getSectionOptions();
        }, 500);

        return () => timeout && clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectionSearchKey]);
    
    return (
        <SkeletonSelect
            loading={loadingSectionsInit}
            placeholder="Select Section"
            defaultValue={defaultValue}
            allowClear
            showSearch
            notFoundContent={loadingSections ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
            filterOption={false}
            onSearch={value => setSectionSearchKey(value)}
            options={sections.map(section => ({
                label: section.name,
                value: section._id,
            }))}
            onChange={value => {
                const form = formRef?.current;
                if (name && form) {
                    form.setFieldValue(name, value);
                }
            }}
            onClear={() => {
                setSectionSearchKey('');
                getSectionOptions();
            }}
            style={{ width: 200, ...(xs && { width: '100%' }) }}
        />
    );
};

export default SectionSelection;