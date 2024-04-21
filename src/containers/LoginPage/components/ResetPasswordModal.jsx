import { useEffect, useState } from 'react';
import { Modal, Typography, Button, Input, Flex } from 'antd';
import { isValidEmail } from '../../../helpers/general';

const { Text } = Typography;

const ResetPasswordModal = ({ requestResetPassword, loadingResetPassReq, setModal, ...rest }) => {
    const [email, setEmail] = useState('');
    const [emailErr, setEmailErr] = useState(null);

    useEffect(() => {
        if (email !== '') {
            const valid = isValidEmail(email);
            if (!valid) {
                setEmailErr('Invalid email');
            } else {
                setEmailErr(null);
            }
        }
    }, [email]);

    useEffect(() => {
        if (!rest.open) {
            setEmail('');
            setEmailErr(null);
        }
    }, [rest.open]);

    useEffect(() => {
        if (!loadingResetPassReq) {
            setModal(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingResetPassReq]);
    
    return (
        <Modal
            { ...rest }
            footer={null}
        >
            <Flex
                vertical
                gap={15}
                style={{ marginTop: 20 }}
            >
                <Text>
                    Kindly provide your email address below, and we will send you a 
                    link via email to a page where you can create a new password.
                </Text>
                <div>
                    <Input
                        placeholder="Enter Email Address"
                        size="large"
                        onChange={e => setEmail(e.target.value)}
                    />
                    {
                        emailErr &&
                        <Text type="danger">{emailErr}</Text>
                    }
                </div>
                <Button
                    disabled={email === '' || emailErr}
                    loading={loadingResetPassReq}
                    type="primary"
                    size="large"
                    onClick={() => {
                        requestResetPassword({ fields: {
                            email,
                            resend: false,
                        } });
                    }}
                >
                    Proceed
                </Button>
            </Flex>
        </Modal>
    );
};

export default ResetPasswordModal;