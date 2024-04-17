import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Typography } from 'antd';

import { capitalizeFirstLetter, getParamsFromUrl, objectToQueryString } from '../../helpers/general';
import { NavigationContext } from '../../providers/NavigationProvider';
import useSubject from '../../hooks/useSubject';

const { Link } = Typography;

const SubjectPage = () => {
    const layoutState = useContext(NavigationContext);
    const { setTitle } = layoutState;

    const query = getParamsFromUrl();
    const navigate = useNavigate();
    const location = useLocation();
    const { subjects, loadingSubjects, getSubjects, page, limit, total } = useSubject();

    useEffect(() => {
        setTitle('Subjects');

        return () => setTitle(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Link
                        onClick={() => navigate(`/subjects/${record._id}`)}
                    >
						View
                    </Link>   
                );
            },
        },
    ];

    return (
        <Table
            loading={loadingSubjects}
            scroll={ { x: true } }
            dataSource={subjects.map(subject => {
                return { ...subject, key: subject._id };
            })}
            columns={columns}
            pagination={{
                current: page,
                showSizeChanger: true,
                onChange: (current, pageSize) => {
                    const queryObj = { ...query, page: current, limit: pageSize };
                    getSubjects(queryObj);
                    const queryString = objectToQueryString(queryObj);
                    navigate(`${location.pathname}${queryString}`);
                },
                position: ['bottomRight'],
                total,
                pageSize: limit,
            }}
        />
    );
};

export default SubjectPage;