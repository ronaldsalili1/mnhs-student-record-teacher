import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Breadcrumb, notification } from 'antd';

import AuthProvider from '../providers/AuthProvider';
import NavigationProvider from '../providers/NavigationProvider';
import NavigationHeader from '../components/NavigationHeader';
import Drawer from '../components/Drawer';
import Card from '../components/Card';

const { Content, Footer } = Layout;

const Navigation = ({ breadcrumb=false }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);
    const [title, setTitle] = useState(null);

    const [notificationApi, notificationContextHolder] = notification.useNotification();

    return (
        <AuthProvider>
            <NavigationProvider
                value={{
                    breadcrumbItems,
                    setBreadcrumbItems,
                    title,
                    setTitle,
                    notificationApi,
                }}
            >
                <Layout>
                    {notificationContextHolder}
                    <Drawer
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                    />
                    <Layout>
                        <NavigationHeader/>
                        <Content
                            className="nav-content"
                            style={{
                                padding: '15px 15px 0px 315px',
                                marginTop: 64,
                            }}
                        >
                            <Card title={title}>
                                {
                                    breadcrumb &&
                                <Breadcrumb
                                    items={breadcrumbItems}
                                    style={{ marginBottom: 15 }}
                                />
                                }
                                <Outlet/>
                            </Card>
                        </Content>
                        <Footer
                            className="nav-content"
                            style={{ textAlign: 'center', padding: '10px 0px 0px 300px' }}
                        >
                            © 2024 Mayorga National High School. All rights reserved.
                        </Footer>
                    </Layout>
                </Layout>
            </NavigationProvider>
        </AuthProvider>
    );
};

export default Navigation;