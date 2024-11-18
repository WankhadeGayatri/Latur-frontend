"use client";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "./component/ContactForm";
import Footer from "../Component/mainpage/Footer";
import Navbar from "../Component/mainpage/Navbar";

const ContactCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-slate-50 p-6 rounded-lg shadow-sm text-center">
    <div className="mb-4 flex justify-center">
      <Icon className="h-8 w-8 text-blue-600" />
    </div>
    <h3 className="font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const MessageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto min-h-screen bg-white px-4">
        <div className="relative bg-sky-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Contact Us About Our{" "}
                <span className="text-sky-600">Hostel Services</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                We'd love to help you find the perfect accommodation for your
                stay. Whether you need information about rooms, rates, or
                facilities, our team is here to assist you. Here are a few ways
                to reach us.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-1 items-center">
          {/* Left Content */}
          <div className="space-y-6 relative h-[450px] rounded-lg overflow-hidden">
            <Image
              src="/Images/contact1.png"
              alt="Contact support team"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="relative h-[600px] rounded-lg overflow-hidden mt-4 md:mt-16">
            {/* <ContactForm/> */}

            <ContactForm
              imageHeight="h-52" // Makes image taller
              imageWidth="w-full" // Full width
              imageFit="contain" // Options: 'cover', 'contain', 'fill'
              imagePosition="object-center" // Control image position
              imageSrc="/your-custom-image.png" // Custom image path
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
