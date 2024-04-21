import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Flex, Typography, Row, Col, Popover, theme, Avatar } from 'antd';
import { LogoutOutlined, DownOutlined } from '@ant-design/icons';

import './NavigationHeader.css';
import { AuthContext } from '../../providers/AuthProvider';
import { post } from '../../helpers/request';
import { removeAuthenticated } from '../../helpers/localStorage';
import { NavigationContext } from '../../providers/NavigationProvider';

const { Header } = Layout;
const { Title, Text } = Typography;

const NavigationHeader = () => {
    const { token } = theme.useToken();
    const { teacher } = useContext(AuthContext);
    const { first_name, last_name, email } = teacher || {};
    const navigate = useNavigate();
    const location = useLocation();
    const layoutState = useContext(NavigationContext);
    const { notificationApi } = layoutState;

    const [meta, setMeta] = useState(null);

    const logout = async () => {
        const response = await post({ uri: '/teacher/auth/logout', navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            return;
        }
        removeAuthenticated();
        navigate('/login');
    };

    const avatar = (
        <Avatar
            size="large"
            style={{ backgroundColor: token.colorPrimary }}
        >
            {first_name ? first_name.charAt(0) : ''}
        </Avatar>
    );

    useEffect(() => {
        if (meta) {
            const type = meta.code === 200 ? 'success' : 'error';
            notificationApi[type]({
                message: meta.message,
                placement: 'bottomRight',
            });
        }

        return () => setMeta(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta]);

    return (
        <Header
            className="nav-header"
            style={{
                boxShadow: '0 5px 5px -5px rgba(0, 0, 0, 0.3)',
                position: 'fixed',
                top: 0,
                right: 0,
                left: 300,
                height: 64,
                zIndex: 10,
            }}
        >
            <Flex
                justify="space-between"
                align="center"
                style={{ height: '100%' }}
            >
                <Title
                    className="header-title"
                    level={1}
                    style={{ fontSize: 20, color: token.colorNeutral }}
                >
                    MNHS Student Records
                </Title>
                <div>
                    <Popover
                        placement="bottomRight"
                        content={
                            <>
                                <Row>
                                    <Col>
                                        {avatar}
                                    </Col>
                                    <Col>
                                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                                            <Text strong>{first_name} {last_name}</Text>
                                            <Text style={{ marginTop: -5 }}>{email}</Text>
                                        </div>
                                    </Col>
                                </Row>
                                <div
                                    className="divider"
                                    style={{ margin: '15px 0px' }}
                                />
                                <Row
                                    justify="space-between"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => logout()}
                                >
                                    <Text>Sign Out</Text>
                                    <LogoutOutlined />
                                </Row>
                            </>
                        }
                    >
                        <Row gutter={6}>
                            <Col>
                                {avatar}
                            </Col>
                            <Col className="teacher-name">
                                {first_name} {last_name}
                            </Col>
                            <Col>
                                <DownOutlined style={{ width: 10 }} />
                            </Col>
                        </Row>
                    </Popover>
                </div>
            </Flex>
        </Header>
    );
};

export default NavigationHeader;