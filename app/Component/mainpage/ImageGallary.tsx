import React from "react";
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

const ImageGallery: React.FC<GalleryProps> = ({ images }) => {
  const ImageWithHover = ({
    image,
    className,
  }: {
    image: GalleryImage;
    className?: string;
  }) => (
    <div className={`relative aspect-square group ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black opacity-0 group-hover:opacity-90 transition-opacity duration-300 rounded-lg" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white text-lg font-semibold mb-2">{image.title}</h3>
        <p className="text-white text-sm">{image.description}</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.slice(0, 2).map((image, index) => (
        <ImageWithHover key={index} image={image} />
      ))}
      <div className="grid grid-cols-2 gap-4">
        {images.slice(2, 6).map((image, index) => (
          <ImageWithHover key={index + 2} image={image} />
        ))}
      </div>
      {images.length > 6 && (
        <div className="relative aspect-square col-span-2 md:col-span-3">
          <ImageWithHover image={images[6]} className="h-full w-full" />
          {images.length > 7 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <span className="text-white text-2xl font-bold">
                +{images.length - 7} Images
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
