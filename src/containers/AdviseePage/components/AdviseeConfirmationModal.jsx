import { useContext, useEffect } from 'react';
import { Modal, Select, Flex, Button, Grid, Typography } from 'antd';

import { AuthContext } from '../../../providers/AuthProvider';

const AdviseeConfirmationModal = ({ selectedSection, setSelectedSection, loadingSubmit, onConfirm, ...rest }) => {
    const { xs } = Grid.useBreakpoint();
    const { teacher } = useContext(AuthContext);
    const sections = teacher?.sections || [];
    const sectionCount = sections.length;
    console.log('🚀 ~ sectionCount:', sectionCount);

    useEffect(() => {
        if (sectionCount === 1) {
            console.log('@@@@@@@@@@@@@');
            setSelectedSection(sections[0]._id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sections]);

    return (
        <Modal
            { ...rest }
            footer={null}
        >
            <Typography.Text>Are you sure you want to add the selected students in your section {sectionCount === 1 ? sections[0].name : ''}?</Typography.Text>
            {
                sectionCount > 1 &&
                <Flex style={{ margin: '10px 0px 20px' }}>
                    <Select
                        defaultValue={sections.length === 1 ? sections[0]._id : null}
                        placeholder="Select Section"
                        style={{ width: '100%' }}
                        options={sections.map(section => ({
                            label: section.name,
                            value: section._id,
                        }))}
                        onChange={value => setSelectedSection(value)}
                    />
                </Flex>
            }
            <Flex justify="end">
                <Button
                    disabled={sectionCount > 1 && !selectedSection}
                    loading={loadingSubmit}
                    type="primary"
                    style={{ ...(xs && { width: '100%' }) }}
                    onClick={onConfirm}
                >
                    Confirm
                </Button>
            </Flex>
        </Modal>
    );
};

export default AdviseeConfirmationModal;