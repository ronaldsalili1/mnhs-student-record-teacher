import { useEffect, useMemo, useState } from 'react';
import { Modal, Typography, Button, Input, Flex } from 'antd';

const { Text } = Typography;

const ChangePasswordModal = ({ changePassword, loadingChangePass, ...rest }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const disabled = useMemo(() => {
        return (
            !currentPassword
            || currentPassword === ''
            || !newPassword
            || newPassword === ''
            || !confirmNewPassword
            || confirmNewPassword === ''
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newPassword, confirmNewPassword]);

    useEffect(() => {
        if (!rest.open) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        }
    }, [rest.open]);
    
    return (
        <Modal
            { ...rest }
            footer={null}
        >
            <Flex
                vertical
                gap={10}
                style={{
                    marginTop: 20,
                }}
            >
                <div>
                    <Text>Current Password:</Text>
                    <Input.Password
                        size="large"
                        onChange={e => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Text>New Password:</Text>
                    <Input.Password
                        size="large"
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Text>Confirm New Password:</Text>
                    <Input.Password
                        size="large"
                        onChange={e => setConfirmNewPassword(e.target.value)}
                    />
                </div>
                <Button
                    disabled={disabled}
                    loading={loadingChangePass}
                    type="primary"
                    size="large"
                    style={{ marginTop: 20 }}
                    onClick={() => {
                        changePassword({ fields: {
                            current_password: currentPassword,
                            new_password: newPassword,
                            confirm_new_password: confirmNewPassword,
                        } });
                    }}
                >
                    Update Password
                </Button>
            </Flex>
        </Modal>
    );
};

export default ChangePasswordModal;