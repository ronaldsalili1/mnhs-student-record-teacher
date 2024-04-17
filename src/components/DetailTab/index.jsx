import { Flex, Tabs } from 'antd';

const DetailTab = ({ items, activeKey, onTabClick }) => {
    const styledItems = items.map(item => {
        return ({
            ...item,
            children: (
                <Flex justify="center">
                    <div className="tab-content">
                        {item.children}
                    </div>
                </Flex>
            ),
        });
    });

    return (
        <Tabs
            activeKey={activeKey}
            tabPosition="top"
            type="card"
            items={styledItems}
            onTabClick={onTabClick}
            destroyInactiveTabPane={true}
            style={{ width: '100%' }}
        />
    );
};

export default DetailTab;