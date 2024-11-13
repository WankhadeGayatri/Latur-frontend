import React from "react";
import { keyframes, css } from "@emotion/react";
import styled from "@emotion/styled";

// Keyframes definitions
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

const slideInLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Styled components with animations
const AnimatedDiv = styled.div`
  animation: ${fadeIn} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

const SlideInDiv = styled.div`
  animation: ${slideInLeft} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

// Your existing interfaces
interface Position {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
}

interface ChatBubbleProps {
  text: string;
  position: string;
  flag: "fr" | "au" | "br" | "us" | "uk" | "in";
  delay?: number;
  className?: string;
}

interface AnimatedContentProps {
  className?: string;
}

interface ContentCard {
  title: string;
  description: string;
  imageSrc: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  text,
  position,
  flag,
  delay = 0,
  className = "",
}) => (
  <AnimatedDiv
    className={`absolute ${position} transform ${className} z-30`}
    style={{
      animationDelay: `${delay}s`,
    }}
  >
    <div className="flex items-end gap-2">
      <div className="relative">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
          <div className="w-full h-full bg-gradient-to-br from-blue-100/20 to-white/30 backdrop-blur" />
        </div>
        <div className="w-4 h-4 absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-blue-500" />
      </div>
      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl rounded-bl-none shadow-lg">
        <p className="text-white text-sm font-medium">{text}</p>
      </div>
    </div>
  </AnimatedDiv>
);

const ContentCardItem: React.FC<ContentCard & { delay: number }> = ({
  title,
  description,
  imageSrc,
  delay,
}) => (
  <SlideInDiv
    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs transform hover:scale-105 transition-transform duration-300"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-center gap-4">
      <img
        src={imageSrc}
        alt={title}
        className="w-12 h-12 object-contain rounded-lg"
      />
      <div>
        <h3 className="text-white font-semibold">{title}</h3>
        <p className="text-blue-100 text-sm">{description}</p>
      </div>
    </div>
  </SlideInDiv>
);

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  className = "",
}) => {
  const contentCards: ContentCard[] = [
    {
      title: "Hygiene Standards",
      description: "A Sanitized Sanctuary. Peace of Mind, Always.",
      imageSrc: "/homesvg/hygine.png",
    },
    {
      title: "Security Features",
      description: "24/7 surveillance for your protection.",
      imageSrc: "/homesvg/security.png",
    },
    {
      title: "Easy Transport",
      description: "Convenient pick-up and drop-off points.",
      imageSrc: "/homesvg/pick.png",
    },
  ];

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Chat Bubbles */}
      <div className="absolute inset-0 z-30">
        <ChatBubble
          text="Love the facilities here! 🏠"
          position="left-40 top-10"
          flag="fr"
          delay={0.5}
        />
        <ChatBubble
          text="Great community atmosphere! 🌟"
          position="left-20 top-44"
          flag="au"
          delay={1}
        />
        <ChatBubble
          text="The security is top-notch! 🛡️"
          position="left-36 top-72"
          flag="br"
          delay={1.5}
        />
      </div>

      {/* Content Cards */}
      <div className="absolute left-10 top-20 space-y-6 z-20">
        {contentCards.map((card, index) => (
          <ContentCardItem key={card.title} {...card} delay={2 + index * 0.5} />
        ))}
      </div>
    </div>
  );
};

export default AnimatedContent;
