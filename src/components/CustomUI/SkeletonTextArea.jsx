import { Input, Skeleton } from 'antd';

const SkeletonTextArea = ({ loading, ...rest }) => {
    if (loading) {
        return (
            <div className="skeleton-input-ui">
                <Skeleton.Input
                    active
                    style={{
                        width: '100%',
                        height: 54,
                        ...(rest?.style && { ...rest.style }),
                    }}
                />
            </div>
        );
    }
    return (
        <Input.TextArea {...rest}/>
    );
};

export default SkeletonTextArea;