import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface GalleryItem {
  id: string;
  type: "image" | "quote" | "text" | "slider";
  content: string | string[];
  alt?: string;
  title?: string;
  subtitle?: string;
  gridArea: string;
  hue: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    type: "text",
    content: "Latur Hostels: Make Student Lifestyle Easy Book Your Room Today!",
    gridArea: "header",
    hue: "bg-blue-500",
  },
  {
    id: "2",
    type: "image",
    content: "/Images/HomePage/Hostel.jpg",
    alt: "Hostel building",
    gridArea: "img1",
    hue: "bg-red-500",
  },
  {
    id: "3",
    type: "image",
    content: "/Images/HomePage/Hostel1.jpeg",
    alt: "Hostel interior",
    gridArea: "img2",
    hue: "bg-green-500",
  },
  {
    id: "4",
    type: "quote",
    content:
      "Hostels are the places, where you make best memories of your life, Make it special with Latur Hostel",
    title: "Director",
    gridArea: "quote",
    hue: "bg-purple-500",
  },
  {
    id: "5",
    type: "image",
    content: "/Images/HomePage/Hostel2.jpeg",
    alt: "Hostel exterior",
    gridArea: "img3",
    hue: "bg-yellow-500",
  },
  {
    id: "6",
    type: "image",
    content: "/Images/HomePage/Hostel3.jpeg",
    alt: "Hostel courtyard",
    gridArea: "img4",
    hue: "bg-indigo-500",
  },
  {
    id: "7",
    type: "image",
    content: "/Images/HomePage/Hostel4.jpeg",
    alt: "Hostel facade",
    gridArea: "img5",
    hue: "bg-pink-500",
  },
  {
    id: "8",
    type: "slider",
    content: [
      "/Images/HomePage/Bedroom.jpg",
      "/Images/HomePage/Liabrary.jpg",
      "/Images/HomePage/Successful.jpg",
    ],
    alt: "Hostel facilities",
    gridArea: "text1",
    hue: "bg-teal-500",
  },
  {
    id: "9",
    type: "image",
    content: "/Images/HomePage/Hostel5.jpeg",
    alt: "Hostel room",
    gridArea: "img6",
    hue: "bg-orange-500",
  },
  {
    id: "10",
    type: "image",
    content: "/Images/HomePage/Hostel6.jpeg",
    alt: "Hostel lounge",
    gridArea: "img7",
    hue: "bg-cyan-500",
  },
  {
    id: "11",
    type: "text",
    content: "Promise your Success",
    subtitle:
      "Where Convenience Meets Community! Room to Grow, Space to Thrive.",
    gridArea: "text2",
    hue: "bg-lime-500",
  },
  {
    id: "12",
    type: "image",
    content: "/Images/HomePage/Hostel7.jpeg",
    alt: "Hostel surroundings",
    gridArea: "img8",
    hue: "bg-fuchsia-500",
  },
  {
    id: "13",
    type: "image",
    content: "/Images/HomePage/Hostel8.jpeg",
    alt: "Additional hostel view",
    gridArea: "img9",
    hue: "bg-emerald-500",
  },
];

const GalleryItem: React.FC<{ item: GalleryItem }> = ({ item }) => {
  const itemStyle: React.CSSProperties = {
    gridArea: item.gridArea,
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
  };

  switch (item.type) {
    case "image":
      return (
        <div
          className="relative overflow-hidden rounded-lg shadow-md h-full"
          style={itemStyle}
        >
          <Image
            src={item.content as string}
            alt={item.alt || ""}
            layout="fill"
            objectFit="cover"
          />
          <div className={`absolute inset-0 ${item.hue} opacity-30`}></div>
        </div>
      );
    case "quote":
      return (
        <div
          className={`${item.hue} bg-opacity-20 p-2 rounded-lg shadow-md flex flex-col justify-center h-full`}
          style={itemStyle}
        >
          <p className="text-xs italic">{item.content}</p>
          <p className="text-xs mt-1 text-right">— {item.title}</p>
        </div>
      );
    case "text":
      return (
        <div
          className={`${item.hue} bg-opacity-20 p-2 rounded-lg shadow-md flex flex-col justify-center h-full`}
          style={itemStyle}
        >
          <h3 className="text-sm font-semibold">{item.content}</h3>
          {item.subtitle && <p className="text-xs mt-1">{item.subtitle}</p>}
        </div>
      );
    case "slider":
      return (
        <div
          className="overflow-hidden rounded-lg shadow-md h-full"
          style={itemStyle}
        >
          <Slider {...sliderSettings}>
            {(item.content as string[]).map((src, index) => (
              <div key={index} className="relative aspect-w-16 aspect-h-9">
                <Image
                  src={src}
                  alt={`${item.alt} ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
                <div
                  className={`absolute inset-0 ${item.hue} opacity-30`}
                ></div>
              </div>
            ))}
          </Slider>
        </div>
      );
    default:
      return null;
  }
};

const HostelGallery: React.FC = () => {
  return (
    <div className="container mx-auto px-2 py-4 h-screen">
      <div className="flex h-full">
        <div className="w-1/3 pr-2">
          <div className="relative h-full rounded-lg overflow-hidden shadow-md">
            <Image
              src="/Images/HomePage/Student.png"
              alt="Main Hostel Image"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-blue-500 opacity-30"></div>
          </div>
        </div>
        <div className="w-2/3">
          <div
            className="grid gap-2 h-full"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(6, 1fr)",
              gridTemplateAreas: `
                "header header img1"
                "img3   img3   quote"
                "img3   img3   img4"
                "img6   text1  img5"
                "img7   text1  img8"
                "text2  img9   img9"
              `,
            }}
          >
            {galleryItems.map((item) => (
              <GalleryItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelGallery;
