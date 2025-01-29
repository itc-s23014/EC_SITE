import { useRouter } from 'next/router';
import Image from 'next/image';
import backIcon from '../../../public/image/back.svg';
import styles from './BackButton.module.css';

const BackButtonHome = ({ label = "", destination }) => {
    const router = useRouter();

    const handleClick = () => {
        try {
            if (destination) {
                router.push("/");
            } else {
                router.push("/");
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

export default BackButtonHome;
