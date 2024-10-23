import React from "react";
import Image from "next/image";

const OptimizedHeroImage = () => {
  return (
    <div className="w-full relative overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px]">
      <Image
        src="/Images/HomePage/pgImage.jpeg"
        alt="Hostel"
        width={1500}
        height={1000}
        layout="responsive"
        priority
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={75}
        loading="eager"
        onLoadingComplete={(img) => {
          if (img.naturalWidth === 0) {
            // Image failed to load, load a fallback
            img.src = "/Images/fallback-image.jpg";
          }
        }}
      />
    </div>
  );
};

export default OptimizedHeroImage;
