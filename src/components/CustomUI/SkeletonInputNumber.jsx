import { InputNumber, Skeleton } from 'antd';

const SkeletonInputNumber = ({ loading, ...rest }) => {
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
        <InputNumber {...rest}/>
    );
};

export default SkeletonInputNumber;