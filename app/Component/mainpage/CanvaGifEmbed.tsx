import React, { useState } from "react";

interface CanvaGifEmbedProps {
  designId: string;
  title?: string;
}

const CanvaGifEmbed: React.FC<CanvaGifEmbedProps> = ({ designId, title }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="canva-gif-embed-container ">
      <div
        className={`canva-gif-embed ${isHovered ? "hovered" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <iframe
          src={`https://www.canva.com/design/${designId}/view?embed`}
          allowFullScreen
          allow="fullscreen"
        ></iframe>
      </div>
      {title && (
        <div className="canva-gif-embed-title">
          <a
            href={`https://www.canva.com/design/${designId}/view?utm_content=${designId}&utm_campaign=designshare&utm_medium=embeds&utm_source=link`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
          </a>
        </div>
      )}

      <style jsx>{`
        .canva-gif-embed-container {
          width: 100%;
          max-width: 1200px;
          margin: 80px auto 0;
          padding: 0 15px;
        }

        .canva-gif-embed {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          overflow: hidden;
          border-radius: 80px 0px 80px 0px;
          background-color: transparent;
          box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.7); /* Darker shadow */
          transition: transform 0.3s ease-in-out;
        }

        .canva-gif-embed.hovered {
          transform: scale(1.05);
        }

        .canva-gif-embed iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          transition: transform 0.3s ease-in-out;
        }

        .canva-gif-embed.hovered iframe {
          transform: scale(1.1);
        }

        .canva-gif-embed-title {
          text-align: center;
          margin-top: 15px;
        }

        .canva-gif-embed-title a {
          font-size: 14px;
          color: #4a5568;
          text-decoration: none;
          background-color: rgba(255, 255, 255, 0.7);
          padding: 5px 10px;
          border-radius: 5px;
          display: inline-block;
        }

        @media (max-width: 768px) {
          .canva-gif-embed-container {
            margin-top: 40px;
          }

          .canva-gif-embed {
            border-radius: 40px 0px 40px 0px;
          }
        }

        @media (max-width: 480px) {
          .canva-gif-embed-container {
            margin-top: 20px;
          }

          .canva-gif-embed {
            border-radius: 20px 0px 20px 0px;
          }
        }

        @media (hover: none) {
          .canva-gif-embed,
          .canva-gif-embed iframe {
            transform: scale(1) !important;
          }
        }
      `}</style>
    </div>
  );
};
export default CanvaGifEmbed;
