import { Spin, theme } from 'antd';

const Card = ({ title=null, loading=false, style={}, children }) => {
    const { token } = theme.useToken();

    return(
        <div
            style={{
                backgroundColor: token.colorWhite,
                borderRadius: 10,
                minHeight: 'calc(100vh - 120px)',
                ...(loading && { height: '100%' }),
                ...style,
            }}
        >
            {
                title &&
                <div
                    style={{
                        padding: '20px 25px',
                        borderBottom: 1,
                        borderBlockStyle: 'solid',
                        borderColor: '#F0F0F0',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        backgroundColor: token.colorWhite,
                    }}
                >
                    <p
                        style={{
                            minHeight: 18,
                            margin: 0,
                            fontSize: 16,
                            fontWeight: 510,
                        }}
                    >
                        {title}
                    </p>
                </div>
            }
            <div
                style={loading ? {
                    height: 'calc(100vh - 400px)' ,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                } : { padding: '10px 23px' }}
            >
                {loading ? <Spin/> : children}
            </div>
        </div>
    );
};
export default Card;