"use client";
import React from "react";
import styled, { keyframes } from "styled-components";
import Footer from "../Component/mainpage/Footer";
import Navbar from "../Component/mainpage/Navbar";

interface GalleryProps {
  maxImages?: number;
}

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
  min-height: 200vh;
  max-width: 100%;
  padding: 2rem;
  background: #f7fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const IntroSection = styled.div`
  width: 100%;
  max-width: 1200px;
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(145deg, #6ea0f1, #ffffff);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
  animation: ${fadeInBox} 0.6s ease-out forwards;

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    transform: translateY(-10px);
  }
`;

const Title = styled.h1`
  color: #2b2d42;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Description = styled.p`
  color: #4a5568;
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const GalleryContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
`;

const GalleryItem = styled.div`
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  aspect-ratio: 1.2;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out backwards;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);

    img {
      transform: scale(1.1);
      filter: brightness(0.85);
    }

    .overlay {
      opacity: 1;
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
  border-radius: 15px;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.7)
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 1rem;
  border-radius: 15px;

  h3 {
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
  }
`;

const Lightbox = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  opacity: ${(props: { isVisible: any }) => (props.isVisible ? 1 : 0)};
  transition: all 0.4s ease-in-out;
  align-items: center;
  justify-content: center;
  pointer-events: ${(props: { isVisible: any }) =>
    props.isVisible ? "auto" : "none"};
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const LightboxContent = styled.div`
  max-width: 90%;
  max-height: 90vh;
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.4s ease-out;
`;

const LightboxImage = styled.img`
  max-height: 90vh;
  max-width: 100%;
  border-radius: 15px;
  transition: all 0.4s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #2d3748;
  font-size: 1.5rem;

  &:hover {
    background: white;
    transform: rotate(90deg);
  }
`;

const ImageGallery: React.FC<GalleryProps> = ({ maxImages = 12 }) => {
  const [selectedImage, setSelectedImage] = React.useState<number | null>(null);

  // Define your gallery images and descriptions
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
    {
      title: "Hostel",
      description: "Dinning Room",
    },
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
        {/* <IntroSection>
        <Title>Hostel Gallery</Title>
        <Description>
          Explore our modern, comfortable, and affordable hostel options.
        </Description>
      </IntroSection> */}
        {/* Hero Section */}
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
              alt={`Hostel Image ${selectedImage!}`}
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
