import { Input, Skeleton } from 'antd';

const SkeletonPasswordInput = ({ loading, ...rest }) => {
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
        <Input.Password {...rest}/>
    );
};

export default SkeletonPasswordInput;