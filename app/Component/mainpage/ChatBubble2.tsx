import React from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

// Keyframes definition
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const AnimatedDiv = styled.div`
  animation: ${fadeIn} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

interface ChatBubbleProps {
  text: string;
  position: string;
  userImage: string;
  delay?: number;
  className?: string;
  isReversed?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  text,
  position,
  userImage,
  delay = 0,
  className = "",
  isReversed = false,
}) => (
  <AnimatedDiv
    className={`absolute ${position} transform ${className} z-30`}
    style={{
      animationDelay: `${delay}s`,
    }}
  >
    <div
      className={`flex items-end gap-2 ${isReversed ? "flex-row-reverse" : ""}`}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#3A9BD8]/20 shadow-lg">
          <img
            src={userImage}
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={`w-4 h-4 absolute -bottom-1 rounded-full border-2 border-white bg-[#FF8C42]
            ${isReversed ? "-left-1" : "-right-1"}`}
        />
      </div>
      <div
        className={`bg-gradient-to-r from-[#3A9BD8] to-[#5BB5E6] px-4 py-2 shadow-lg
          ${
            isReversed
              ? "rounded-2xl rounded-br-none"
              : "rounded-2xl rounded-bl-none"
          }`}
      >
        <p className="text-white text-sm font-medium drop-shadow-sm">{text}</p>
      </div>
    </div>
  </AnimatedDiv>
);

const ChatBubbles2: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <div className="absolute inset-0 z-30">
        {/* First Message - Hygiene */}
        <ChatBubble
          text="Always maintaining top hygiene standards✨ "
          position="left-40 top-20"
          userImage="/Images/about/team-2.jpg"
          delay={0.5}
        />
        {/* Middle Message - Security */}
        <ChatBubble
          text="Your safety is our priority!🛡️ "
          position="left-4 top-52"
          userImage="/Images/about/team-1.jpg"
          delay={1}
          isReversed={true}
        />
        {/* Last Message - Transport */}
        <ChatBubble
          text="Convenient pick-up & drop facility available🚗"
          position="left-36 top-72"
          userImage="/Images/about/team-4.jpg"
          delay={1.5}
        />
        {/* <ChatBubble
          text="Your safety is our priority!🛡️ "
          position="left-4 top-200"
          userImage="/Images/about/team-3.jpg"
          delay={2}
          isReversed={true}
        /> */}
      </div>
    </div>
  );
};

export default ChatBubbles2;
