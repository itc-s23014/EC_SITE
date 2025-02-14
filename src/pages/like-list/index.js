import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/BackButton/BackButton";
import { useAuthGuard } from '@/hooks/useAuthGuard';
import LoadingComponent from '@/components/LoadingComponent';
import { useLikedProducts } from "@/hooks/useLikedProducts";
import Header from "@/components/Header";

const LikeList = () => {
    const { likedProducts, loading, user } = useLikedProducts();
    const { user: authUser, loading: authloading } = useAuthGuard(); //認証を強制

    if (loading) {
        return <LoadingComponent />
    }

    if (!user) {
        return <p style={{ textAlign: "center", marginTop: "20px" }}>ログインしてください。</p>;
    }

    return (
        <>
        <Header />
        <div className="font-sans px-4 py-8" style={styles.container}>
            <BackButton />
            <header style={styles.header}>
                <h1 style={styles.title}>Like List</h1>
                <h2 style={styles.subtitle}>あなたが「いいね」した商品</h2>
            </header>

            <div className="mx-auto lg:max-w-6xl md:max-w-4xl">
            <h2 className="sectionTitle" style={styles.sectionTitle}>お気に入り商品</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {likedProducts.length > 0 ? (
                        likedProducts.map((product) => {
                            if (user && product.sellerId === user.uid) {
                                return null;
                            }
                            return (
                                <Link href={`/Catalog/detail/${product.id}`} passHref key={product.id}>
                                    <div
                                        className="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
                                        <div className="w-full overflow-hidden mx-auto">
                                            <Image
                                                src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : "/placeholder.jpg"}
                                                alt={product.name}
                                                width={500}
                                                height={500}
                                                className="aspect-[108/82] w-full object-contain"
                                            />
                                        </div>
                                        <div className="text-center mt-4">
                                            <h3 className="text-sm font-bold text-gray-800">{product.name}</h3>
                                            <h4 className="text-sm text-blue-600 font-bold mt-2">¥{product.price.toLocaleString()}</h4>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <p style={styles.noItemsMessage}>「いいね」した商品がありません。</p>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

const styles = {
    container: {
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        position: "relative",
    },
    header: {
        textAlign: "center",
        marginBottom: "40px",
    },
    title: {
        fontSize: "36px",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    subtitle: {
        fontSize: "24px",
        color: "#555",
    },
    sectionTitle: {
        fontSize: "18px",
        marginBottom: "10px",
        padding: "0.25em 0.5em",
        color: "#494949",
        background: "transparent",
        borderLeft: "solid 5px #494949",
        textAlign: "left",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
    },
    noItemsMessage: {
        textAlign: "center",
        color: "#777",
        fontSize: "16px",
    },
};

export default LikeList;
