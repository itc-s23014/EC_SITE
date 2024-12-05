import { useRouter } from 'next/router';
import Image from 'next/image';
import backIcon from '../../../public/image/back.svg';
import styles from './BackButton.module.css';

const BackButton = ({ label = "", destination }) => {
    const router = useRouter();

    const handleClick = () => {
        try {
            if (destination) {
                router.push(destination);
            } else {
                router.back();
            }
        } catch (error) {
            console.error("ナビゲーションエラー:", error);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={styles.backButton}
        >
            <Image src={backIcon} alt="戻る" width={40} height={40} />
            {label && <span>{label}</span>}
        </button>
    );
};

export default BackButton;
