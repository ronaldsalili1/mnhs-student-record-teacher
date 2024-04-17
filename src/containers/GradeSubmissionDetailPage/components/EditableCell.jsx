import { Input, InputNumber, Form } from 'antd';

const EditableCell = ({
    editing,
    dataIndex,
    inputType,
    // title,
    // record,
    // index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber style={{ width: 55 }} /> : <Input style={{ width: 55 }} />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default EditableCell;