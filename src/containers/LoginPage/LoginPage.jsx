import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Flex, Card, Typography } from 'antd';

import useAuth from '../../hooks/useAuth';
import { getParamsFromUrl } from '../../helpers/general';
import { getAuthenticated } from '../../helpers/localStorage';

const { Password } = Input;
const { Text } = Typography;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState(null);

    const navigate = useNavigate();
    const { meta, loadingSubmit, login, resetMeta } = useAuth();

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
    
    useEffect(() => {
        if (meta) {
            if (meta.code === 200) {
                setErrMsg(null);
            } else {
                setErrMsg(meta.message);
            }
        }

        return () => resetMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta]);


    return (
        <Flex
            justify="center"
            align="center"
            style={{ height: '100vh' }}
        >
            <Card
                title="Login to Proceed"
                style={{ width: 300 }}
            >
                <Flex
                    vertical
                    gap={15}
                >
                    <div>
                        <Text>Email:</Text>
                        <Input onChange={e => setEmail(e.target.value)}/>
                        {errMsg && <Text type="danger">{errMsg}</Text>}
                    </div>
                    <div>
                        <Text>Password:</Text>
                        <Password onChange={e => setPassword(e.target.value)}/>
                        {errMsg && <Text type="danger">{errMsg}</Text>}
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        loading={loadingSubmit}
                        onClick={() => {
                            login(email, password);
                        }}
                        style={{ width: '100%' }}
                    >
                        Login
                    </Button>
                </Flex>
            </Card>
        </Flex>
    );
};

export default LoginPage;