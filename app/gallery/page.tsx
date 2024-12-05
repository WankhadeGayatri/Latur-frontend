"use client";
import React from "react";
import styled, { keyframes } from "styled-components";
import Footer from "../Component/mainpage/Footer";
import Navbar from "../Component/mainpage/Navbar";

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

// Keep all your existing styled components the same...
const Container = styled.div`
  min-height: 200vh;
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

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = React.useState<number | null>(null);
  const maxImages = 12; // Move this inside the component

  // Keep all your existing image arrays and handlers the same...
  const galleryImages = [
    "/Images/galary/a10.jpg",
    "/Images/galary/ami.jpeg",
    "/Images/galary/avan.jpeg",
    "/Images/galary/b5.png",
    "/Images/galary/nea.jpeg",
    "/Images/galary/raman.jpeg",
    "/Images/galary/saar.png",
    "/Images/galary/s1.jpeg",
    "/Images/galary/A15.jpg",
    "/Images/galary/b4.png",
    "/Images/galary/b.jpeg",
    "/Images/galary/b6.png",
  ];

  const imageDetails = [
    {
      title: "Hostel",
      description: "Dinning Room",
    },
    { title: "Neha Hostel", description: "Bed Room" },
    { title: "Sagar Hostel", description: "Dining Rooms" },
    { title: "Avani Hostel", description: "Reading Hall" },
    { title: "Samarth Hostel", description: "Passage Area" },
    { title: "Sharda Hostel", description: "Entrance" },
    { title: "Sanichit Hostel", description: "Dining Rooms" },
    { title: "Venutai Hostel", description: "Bed Rooms" },
    { title: "Shiv Hostel", description: "Passage Area" },
    { title: "Shourya Hostel", description: "Dining Area" },
    { title: "Amit Hostel", description: "Bed room" },
    { title: "RamanHostel", description: "Study room" },
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
            <LightboxImage
              src={galleryImages[selectedImage!]}
              alt={`Hostel Image ${selectedImage! + 1}`}
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
