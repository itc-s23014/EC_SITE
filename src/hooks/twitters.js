import { useEffect } from "react";

const TwitterEmbeds = ({ videoLink, twitterUserId, twitterStatusId }) => {
    useEffect(() => {
        if (videoLink) {
            const twitterRegex = videoLink.match(/https:\/\/twitter.com\/\w+\/status\/\d+/) || "";
            const twitterData = twitterRegex[0].split("/");
            const userId = twitterData[3];
            const statusId = twitterData[5];

            if (userId && statusId) {
                const script = document.createElement('script');
                script.src = 'https://platform.twitter.com/widgets.js';
                script.async = true;
                script.charset = 'utf-8';
                document.getElementById('twitter').appendChild(script);
            }
        }
    }, [videoLink]);

    return (
        <div id="twitter" style={{ maxWidth: '550px', margin: '0 auto' }}>
            <blockquote className="twitter-tweet" data-media-max-width="550">
                <a href={`https://twitter.com/${twitterUserId}/status/${twitterStatusId}?ref_src=twsrc%5Etfw`}></a>
            </blockquote>
        </div>
    );
};

export default TwitterEmbeds;