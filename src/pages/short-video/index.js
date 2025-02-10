import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import TwitterEmbed from "@/hooks/twitter";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";

export default function VideoList() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const querySnapshot = await getDocs(collection(db, "products"));
            const videoLinks = querySnapshot.docs
                .map((doc) => doc.data().videoLink)
                .filter((link) => link);
            setVideos(videoLinks);
        };
        fetchVideos();
    }, []);

    // Twitterリンクの解析関数
    const parseTwitterLink = (url) => {
        const match = url.match(/https:\/\/twitter.com\/(\w+)\/status\/(\d+)/);
        if (match) {
            return {
                twitterUserId: match[1],
                twitterStatusId: match[2],
                videoLink: url,
            };
        }
        return null;
    };

    return (
        <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
            {videos.map((video, index) => {
                const twitterData = parseTwitterLink(video);

                return (
                    <div key={index} className="relative h-screen w-full flex justify-center items-center snap-center">
                        {twitterData ? (
                            <TwitterEmbed
                                videoLink={twitterData.videoLink}
                                twitterUserId={twitterData.twitterUserId}
                                twitterStatusId={twitterData.twitterStatusId}
                            />
                        ) : (
                            <video
                                src={video}
                                controls
                                autoPlay
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute bottom-10 left-5 text-white">
                            <p className="text-lg font-bold">@username</p>
                            <p className="text-sm">#Hashtag #Shorts</p>
                        </div>
                        <div className="absolute bottom-10 right-5 flex flex-col gap-4 text-white">
                            <button className="flex flex-col items-center">
                                <FaHeart className="text-2xl" />
                                <span>123</span>
                            </button>
                            <button className="flex flex-col items-center">
                                <FaComment className="text-2xl" />
                                <span>45</span>
                            </button>
                            <button className="flex flex-col items-center">
                                <FaShare className="text-2xl" />
                                <span>10</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
