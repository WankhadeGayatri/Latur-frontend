// import React from "react";
// import CanvaGifEmbed from "./CanvaGifEmbed";

// interface HexagonalFrameProps {
//   designId: string;
//   title: string;
//   containerWidth?: string;
//   containerHeight?: string;
// }

// const HexagonalFrame: React.FC<HexagonalFrameProps> = ({
//   designId,
//   title,
//   containerWidth = "100%",
//   containerHeight = "auto",
// }) => {
//   const outerFrameStyle: React.CSSProperties = {
//     width: containerWidth,
//     height: containerHeight,
//     position: "relative",
//     background: "#87ceeb",
//     overflow: "hidden",
//     clipPath: "polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)",
//     borderRadius: "40% 40% 0% 0% / 20% 20% 0% 0%",
//     padding: "15px",
//   };

//   const innerFrameStyle: React.CSSProperties = {
//     width: "100%",
//     height: "100%",
//     position: "relative",
//     background: "white",
//     overflow: "hidden",
//     clipPath: "polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)",
//     borderRadius: "40% 40% 0% 0% / 20% 20% 0% 0%",
//   };

//   const curvedSidesStyle: React.CSSProperties = {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "#87ceeb",
//     clipPath: "polygon(25% 2%, 75% 2%, 95% 50%, 75% 98%, 25% 98%, 5% 50%)",
//     filter: "blur(20px)",
//     opacity: 0.7,
//   };

//   return (
//     <div style={outerFrameStyle}>
//       <div style={innerFrameStyle}>
//         <div style={curvedSidesStyle} />
//         <CanvaGifEmbed
//           designId={designId}
//           title={title}
//           containerWidth="100%"
//           containerHeight="100%"
//           gifWidth="100%"
//           gifHeight="100%"
//         />
//       </div>
//     </div>
//   );
// };

// export default HexagonalFrame;
