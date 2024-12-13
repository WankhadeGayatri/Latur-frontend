"use client";
import React from "react";
import styled, { keyframes } from "styled-components";
import Footer from "../Component/mainpage/Footer";
import Navbar from "../Component/mainpage/Navbar";
import { Typography } from "@mui/material";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInBox = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  max-width: 100%;
  padding: 2rem;
  background: #f7fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

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
  // Removed borderRadius
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
  // Removed borderRadius
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
  // Removed borderRadius
  "& h2": {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "1.25rem", // Decreased font size from 1.75rem
    fontWeight: 600,
    marginBottom: "0.5rem",
    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
  },
  "& h3": {
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
  overflow: "hidden",
  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
});

const LightboxImage = styled("img")({
  maxHeight: "90vh",
  maxWidth: "100%",
  // Removed borderRadius
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

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = React.useState<number | null>(null);
  const maxImages = 12;

  const galleryImages = [
    "/Images/gallery/a10.webp",
    "/Images/gallery/ami.webp",
    "/Images/gallery/avan.webp",
    "/Images/gallery/b5.webp",
    "/Images/gallery/nea.webp",
    "/Images/gallery/raman.webp",
    "/Images/gallery/saar.webp",
    "/Images/gallery/s1.webp",
    "/Images/gallery/A15.webp",
    "/Images/gallery/b4.webp",
    "/Images/gallery/b.webp",
    "/Images/gallery/b6.webp",
  ];

  const imageDetails = [
    {
      title: "Yash Hostel",
      description: "Boys hostel",
    },
    { title: "Neha Hostel", description: "Girls hostel" },
    { title: "Sagar Hostel", description: "Boys hostel" },
    { title: "Avani Hostel", description: "Girls hostel" },
    { title: "Samarth Hostel", description: "Boys hostel" },
    { title: "Sharda Hostel", description: "Girls hostel" },
    { title: "Sanichit Hostel", description: "Boys hostel" },
    { title: "Venutai Hostel", description: "Girls hostel" },
    { title: "Shiv Hostel", description: "Boys hostel" },
    { title: "Shourya Hostel", description: "Girls hostel" },
    { title: "Amit Hostel", description: "Boys hostel" },
    { title: "RamanHostel", description: "Girls hostel" },
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
      {/* Hero Section */}
      <div className="relative bg-sky-50 py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-[34px] md:text-5xl font-bold text-gray-900 mb-6">
              Gallery <span className="text-sky-600">Latur Hostel</span>
            </h1>
            <span className="max-w-2xl mx-auto text-lg text-gray-600 text-center sm:text-left">
              Explore our modern hostel facilities through our gallery. See the
              comfortable rooms <br className="hidden sm:block" /> and vibrant
              spaces designed for students.
            </span>
          </div>
        </div>
      </div>

      <Container>
        <GalleryContainer className="mt-0">
          {galleryImages.slice(0, maxImages).map((imagePath, index) => (
            <GalleryItem key={index} onClick={() => handleImageClick(index)}>
              <Image src={imagePath} alt={`Hostel Image ${index + 1}`} />
              <ImageOverlay className="overlay">
                <h2 className="text-[28px] md:text-[24px] font-semibold text-white mb-1">
                  {imageDetails[index]?.title}
                </h2>
                <h3 className="text-[24px] text-white">
                  {imageDetails[index]?.description}
                </h3>
              </ImageOverlay>
            </GalleryItem>
          ))}
        </GalleryContainer>

        <Lightbox isVisible={selectedImage !== null}>
          <LightboxContent>
            <LightboxImage
              src={galleryImages[selectedImage!]}
              alt={`Hostel Image ${selectedImage! + 1}`}
              loading="lazy"
            />
            <CloseButton onClick={handleClose}>✕</CloseButton>
          </LightboxContent>
        </Lightbox>
      </Container>
      <Footer />
    </>
  );
};

export default ImageGallery;
