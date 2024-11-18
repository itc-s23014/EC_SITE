import { useRouter } from 'next/router';

const BackButton = ({ label = '← 戻る', style }) => {
    const router = useRouter();

    const defaultStyle = {
        position: 'absolute',
        left: '20px',
        top: '20px',
        fontSize: '16px',
        color: '#333',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        ...style,
    };

    return (
        <button
            onClick={() => router.back()}
            style={defaultStyle}
            className="back-button"
        >
            {label}
        </button>
    );
};

export default BackButton;