import { useContext, useEffect, useRef, useState } from 'react';
import { Row, Form, Button, Flex, Typography } from 'antd';

import SkeletonInput from '../../components/CustomUI/SkeletonInput';
import { NavigationContext } from '../../providers/NavigationProvider';
import useProfile from '../../hooks/useProfile';
import { removeObjNilValues } from '../../helpers/general';

import ChangePasswordModal from './components/ChangePasswordModal';

const { Item } = Form;
const { Text } = Typography;

const ProfilePage = () => {
    const layoutState = useContext(NavigationContext);
    const { setTitle } = layoutState;
    const formRef = useRef(null);

    const {
        meta,
        loadingProfile,
        profile,
        updateProfile,
        loadingSubmit,
        changePassword,
        loadingChangePass,
    } = useProfile();

    const [modal, setModal] = useState(false);

    useEffect(() => {
        setTitle('Profile');

        return () => setTitle(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (meta && meta.code == 200) {
            setModal(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta]);

    useEffect(() => {
        formRef.current?.setFieldsValue(profile);
    }, [profile]);

    return (
        <Flex justify="center">
            <Form
                ref={formRef}
                layout="vertical"
                onFinish={values => updateProfile({ fields: removeObjNilValues(values) })}
                style={{
                    width: 400,
                }}
            >
                <Row>
                    <Text
                        strong
                        style={{ fontSize: 18, margin: '15px 0px' }}
                    >
                        Teacher Informations:
                    </Text>
                </Row>
                <Item
                    name="email"
                    label="Email:"
                    rules={[
                        {
                            required: true,
                            message: 'Email is required',
                        },
                        {
                            type: 'email',
                            message: 'Email is not valid',
                        },
                    ]}
                >
                    <SkeletonInput
                        loading={loadingProfile}
                        disabled={true}
                        placeholder="Enter Email"
                    />
                </Item>
                <Item
                    name="last_name"
                    label="Last Name:"
                    rules={[
                        {
                            required: true,
                            message: 'Last Name is required',
                        },
                    ]}
                >
                    <SkeletonInput
                        loading={loadingProfile}
                        placeholder="Enter Last Name"
                    />
                </Item>
                <Item
                    name="first_name"
                    label="First Name:"
                    rules={[
                        {
                            required: true,
                            message: 'First Name is required',
                        },
                    ]}
                >
                    <SkeletonInput
                        loading={loadingProfile}
                        placeholder="Enter First Name"
                    />
                </Item>
                <Item
                    name="middle_name"
                    label="Middle Name:"
                >
                    <SkeletonInput
                        loading={loadingProfile}
                        placeholder="Enter Middle Name"
                    />
                </Item>
                <Item
                    name="suffix"
                    label="Suffix:"
                >
                    <SkeletonInput
                        loading={loadingProfile}
                        placeholder="Enter Suffix"
                    />
                </Item>
                <Item>
                    <Flex justify="space-between">
                        <Button
                            style={{ minWidth: 80 }}
                            onClick={() => setModal(true)}
                        >
                            Change Password
                        </Button>
                        <Button
                            loading={loadingSubmit}
                            type="primary"
                            htmlType="submit"
                            style={{ minWidth: 80 }}
                        >
                            Save
                        </Button>
                    </Flex>
                </Item>
            </Form>
            <ChangePasswordModal
                open={modal}
                title="Change Password"
                destroyOnClose={true}
                width={450}
                onCancel={() => setModal(false)}
                changePassword={changePassword}
                loadingChangePass={loadingChangePass}
            />
        </Flex>
    );
};

export default ProfilePage;