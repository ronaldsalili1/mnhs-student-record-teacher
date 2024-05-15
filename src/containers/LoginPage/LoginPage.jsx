import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Flex, theme, Typography, Button, Alert } from 'antd';

import backgroundImg from '../../images/mnhs-bg.webp';
import mnhsLogo from '../../images/mnhs-logo.webp';
import { post } from '../../helpers/request';
import { getAuthenticated, setAuthenticated } from '../../helpers/localStorage';
import { getParamsFromUrl } from '../../helpers/general';

import ResetPasswordModal from './components/ResetPasswordModal';

const { Text, Link } = Typography;

const LoginPage = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const [meta, setMeta] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingResetPassReq, setLoadingResetPassReq] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modal, setModal] = useState(false);

    const requestResetPassword = async ({ fields }) => {
        setLoadingResetPassReq(true);

        const body = {
            ...fields,
        };

        const response = await post({
            uri: '/teacher/auth/reset-password/request',
            body,
            navigate,
            location,
        });

        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingResetPassReq(false);
            return;
        }

        setMeta({
            ...response?.meta,
            message: 'A password reset has been successfully sent. Please check your email.',
        });
        setLoadingResetPassReq(false);
    };
    
    const login = async () => {
        setLoadingSubmit(true);
    
        const body = {
            email,
            password,
        };
    
        const response = await post({
            uri: '/teacher/auth/login',
            body,
            navigate,
            location,
        });
    
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubmit(false);
            return;
        }
    
       
        setLoadingSubmit(false);
        setAuthenticated();

        const query = getParamsFromUrl();
        if (query.path) {
            navigate(query.path, { replace: true });
            return;
        }

        navigate('/subjects', { replace: true });
    };

    useEffect(() => {
        const authenticated = getAuthenticated();
        if (authenticated === 'yes') {
            const query = getParamsFromUrl();
            if (query.path) {
                navigate(query.path, { replace: true });
            } else {
                navigate('/subjects');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Flex
            justify="center"
            align="center"
            style={{
                backgroundImage: `url(${backgroundImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
            }}
        >
            <Flex
                vertical
                gap={10}
                style={{
                    maxWidth: 400,
                    width: '100%',
                    backgroundColor: token.colorSider,
                    padding: 20,
                    borderRadius: 10,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    opacity: 0.96,
                }}
            >
                {
                    meta &&
                    <Alert
                        message={meta.message}
                        type={meta?.code === 200 ? 'success' : 'error'}
                        showIcon
                    />
                }
                <Flex
                    align="center"
                    style={{ marginBottom: 15 }}
                >
                    <img
                        src={mnhsLogo}
                        alt="MNHS Logo"
                        width={100}
                    />
                    <div
                        style={{
                            height: 80,
                            width: 1,
                            backgroundColor: '#ce1a21',
                            margin: '0px 10px',
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 35,
                            fontWeight: 600,
                            lineHeight: 1.1,
                        }}
                    >
                        MNHS Student Record System
                    </Text>
                </Flex>
                <div>
                    <Text strong>Email:</Text>
                    <Input
                        size="large"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <Text strong>Password:</Text>
                    <Input.Password
                        size="large"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <Flex gap={5}>
                    <Text>Forgot your password?</Text>
                    <Link onClick={() => setModal(true)}>Reset Password</Link>
                </Flex>
                <Button
                    disabled={!email || email === '' || !password || password === ''}
                    loading={loadingSubmit}
                    type="primary"
                    size="large"
                    style={{ marginTop: 20 }}
                    onClick={login}
                >
                    Login
                </Button>
            </Flex>
            <ResetPasswordModal
                open={modal}
                title="Reset Password"
                destroyOnClose={true}
                width={450}
                onCancel={() => setModal(false)}
                loadingResetPassReq={loadingResetPassReq}
                requestResetPassword={requestResetPassword}
                setModal={setModal}
            />
        </Flex>
    );
};

export default LoginPage;