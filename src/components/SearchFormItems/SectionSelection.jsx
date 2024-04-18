import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Empty, Select, Spin } from 'antd';

import { get } from '../../helpers/request';


const SectionSelection = ({ formRef, name }) => {
    const { xs } = Grid.useBreakpoint();
    const navigate = useNavigate();

    const [loadingSections, setLoadingSections] = useState();
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
            return;
        }

        setSections(response?.data?.sections);
        setLoadingSections(false);
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
        <Select
            placeholder="Select Section"
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