"use client";
import React from "react";
import dynamic from "next/dynamic";
import Footer from "../Component/mainpage/Footer";
import Navbar from "../Component/mainpage/Navbar";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

// Types
interface GalleryProps {
  maxImages?: number;
}

// Styled components using MUI styled
const Container = styled("div")({
  minHeight: "200vh",
  maxWidth: "100%",
  padding: "2rem",
  background: "#f7fafc",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
});

const GalleryContainer = styled("div")({
  width: "100%",
  maxWidth: "1200px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "2rem",
  padding: "2rem",
});

const GalleryItem = styled("div")({
  position: "relative",
  borderRadius: "15px",
  overflow: "hidden",
  aspectRatio: "1.2",
  cursor: "pointer",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
    "& img": {
      transform: "scale(1.1)",
      filter: "brightness(0.85)",
    },
    "& .overlay": {
      opacity: 1,
    },
  },
});

const Image = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "all 0.5s ease",
  borderRadius: "15px",
});

const ImageOverlay = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7))",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  opacity: 0,
  transition: "opacity 0.3s ease",
  padding: "1rem",
  borderRadius: "15px",
  "& h3": {
    color: "white",
    fontSize: "1.75rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
  },
  "& p": {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "1.1rem",
  },
});

const Lightbox = styled("div")<{ isVisible: boolean }>(({ isVisible }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  display: "flex",
  opacity: isVisible ? 1 : 0,
  transition: "all 0.4s ease-in-out",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: isVisible ? "auto" : "none",
  zIndex: 1000,
  backdropFilter: "blur(5px)",
}));

const LightboxContent = styled("div")({
  maxWidth: "90%",
  maxHeight: "90vh",
  position: "relative",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
});

const LightboxImage = styled("img")({
  maxHeight: "90vh",
  maxWidth: "100%",
  borderRadius: "15px",
  transition: "all 0.4s ease",
});

const CloseButton = styled("button")({
  position: "absolute",
  top: "1rem",
  right: "1rem",
  width: "2rem",
  height: "2rem",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.85)",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  color: "#2d3748",
  fontSize: "1.5rem",
  "&:hover": {
    background: "white",
    transform: "rotate(90deg)",
  },
});

const ImageGallery = ({ maxImages = 12 }: GalleryProps) => {
  const [selectedImage, setSelectedImage] = React.useState<number | null>(null);

  // Gallery images and descriptions
  const galleryImages = [
    "/Images/HomePage/img 8.jpg",
    "/Images/HomePage/img 9.jpg",
    "/Images/HomePage/img1.jpg",
    "/Images/HomePage/img3.jpg",
    "/Images/HomePage/img5.jpg",
    "/Images/HomePage/img6.jpg",
    "/Images/HomePage/imgg3.jpg",
    "/Images/HomePage/immgg5.jpg",
    "/Images/HomePage/img 8.jpg",
    "/Images/HomePage/img 9.jpg",
    "/Images/HomePage/img3.jpg",
    "/Images/HomePage/img5.jpg",
  ];

  const imageDetails = [
    { title: "Hostel", description: "Dinning Room" },
    { title: "Hostel", description: "Hostel Rooms" },
    { title: "Hostel", description: "Hostel Rooms" },
    { title: "Hostel", description: "Study table" },
    { title: "Hostel", description: "Hall" },
    { title: "Hostel", description: "Boys Hostel" },
    { title: "Hostel", description: "Attached rooms" },
    { title: "Hostel", description: "bedRooms" },
    { title: "Hostel", description: "Dinning rooms" },
    { title: "Hostel", description: "single room" },
    { title: "Hostel", description: "combine room" },
    { title: "Hostel", description: "Hall " },
  ];

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Navbar />
      <Container>
        <div className="relative bg-sky-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Gallery <span className="text-sky-600">Latur Hostel</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Explore our modern hostel facilities through our gallery. See
                the comfortable rooms and vibrant spaces designed for students.
              </p>
            </div>
          </div>
        </div>
        <GalleryContainer>
          {galleryImages.slice(0, maxImages).map((imagePath, index) => (
            <GalleryItem key={index} onClick={() => handleImageClick(index)}>
              <Image src={imagePath} alt={`Hostel Image ${index + 1}`} />
              <ImageOverlay className="overlay">
                <h3>{imageDetails[index]?.title}</h3>
                <p>{imageDetails[index]?.description}</p>
              </ImageOverlay>
            </GalleryItem>
          ))}
        </GalleryContainer>

        <Lightbox isVisible={selectedImage !== null}>
          <LightboxContent>
            {selectedImage !== null && (
              <LightboxImage
                src={galleryImages[selectedImage]}
                alt={`Hostel Image ${selectedImage + 1}`}
              />
            )}
            <CloseButton onClick={handleClose}>✕</CloseButton>
          </LightboxContent>
        </Lightbox>
      </Container>
      <Footer />
    </>
  );
};

export default ImageGallery;
