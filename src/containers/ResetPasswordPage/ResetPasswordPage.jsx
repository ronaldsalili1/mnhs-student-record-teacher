import { useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Input, Flex, theme, Typography, Button, Alert } from 'antd';

import backgroundImg from '../../images/mnhs-bg.webp';
import { post } from '../../helpers/request';

const { Text } = Typography;

const ResetPasswordPage = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const { token: resetPassToken } = useParams();

    const [meta, setMeta] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const disabled = useMemo(() => {
        return (
            !newPassword
            || newPassword === ''
            || !confirmNewPassword
            || confirmNewPassword === ''
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newPassword, confirmNewPassword]);

    const updatePassword = async () => {
        setLoadingSubmit(true);
    
        const body = {
            token: resetPassToken,
            new_password: newPassword,
            confirm_new_password: confirmNewPassword,
        };
    
        const response = await post({
            uri: '/teacher/auth/reset-password',
            body,
            navigate,
            location,
        });
    
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubmit(false);
            return;
        }
    
        setMeta(response.meta);
        setLoadingSubmit(false);

        navigate('/login');
    };

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
                    meta && meta?.code !== 200 &&
                    <Alert
                        message={meta.message}
                        type="error"
                        showIcon
                    />
                }
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: 700,
                        marginBottom: 10,
                    }}
                >
                    Reset Password
                </Text>
                <div>
                    <Text strong>New Password:</Text>
                    <Input.Password
                        size="large"
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Text strong>Confirm New Password:</Text>
                    <Input.Password
                        size="large"
                        onChange={e => setConfirmNewPassword(e.target.value)}
                    />
                </div>
                <Button
                    disabled={disabled}
                    loading={loadingSubmit}
                    type="primary"
                    size="large"
                    style={{ marginTop: 20 }}
                    onClick={updatePassword}
                >
                    Update Password
                </Button>
            </Flex>
        </Flex>
    );
};

export default ResetPasswordPage;