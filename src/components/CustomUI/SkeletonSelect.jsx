import { Select, Skeleton } from 'antd';

const SkeletonSelect = ({ loading, ...rest }) => {
    if (loading) {
        return (
            <div className="skeleton-input-ui">
                <Skeleton.Input
                    active
                    style={{
                        width: '100%',
                        ...(rest?.style && { ...rest.style }),
                    }}
                />
            </div>
        );
    }
    return (
        <Select {...rest}/>
    );
};

export default SkeletonSelect;