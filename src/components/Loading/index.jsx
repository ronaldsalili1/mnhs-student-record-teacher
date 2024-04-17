import { Spin, Flex } from 'antd';

const Loading = () => {
    return (
        <Flex
            justify="center"
            align="center"
            style={{ height: 400 }}
        >
            <Spin/>
        </Flex>
    );
};

export default Loading;