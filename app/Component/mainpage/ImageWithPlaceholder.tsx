import React, { useState } from "react";

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt,
  width,
  height,
  className,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#f0f0f0",
        position: "relative",
      }}
    >
      {!loaded && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Loading...
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
        className={className}
      />
    </div>
  );
};

export default ImageWithPlaceholder;
