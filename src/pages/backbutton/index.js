import { useRouter } from 'next/router';
import Image from 'next/image';
import backIcon from '../../../public/image/back.svg';

const BackButton = ({ label , style }) => {
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
            <Image src={backIcon} alt="戻る" width={40} height={40} />
            <span>{label}</span>
        </button>
    );
};

export default BackButton;