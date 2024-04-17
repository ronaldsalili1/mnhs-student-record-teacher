import { Modal } from 'antd';

const StudentDetailModal = ({ ...rest }) => {
    return (
        <Modal
            { ...rest }
            footer={null}
        >
			Hello
        </Modal>
    );
};

export default StudentDetailModal;