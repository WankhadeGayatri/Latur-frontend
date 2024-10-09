declare module "react-lottie" {
  import { CSSProperties } from "react";

  interface LottieProps {
    options: {
      loop?: boolean;
      autoplay?: boolean;
      animationData: any;
      rendererSettings?: {
        preserveAspectRatio?: string;
      };
      path?: string;
    };
    height?: number;
    width?: number;
    isStopped?: boolean;
    isPaused?: boolean;
    speed?: number;
    segments?: number[];
    direction?: number;
    ariaRole?: string;
    ariaLabel?: string;
    isClickToPauseDisabled?: boolean;
    title?: string;
    style?: CSSProperties;
  }

  export default class Lottie extends React.Component<LottieProps> {}

  export interface Options {
    loop: boolean;
    autoplay: boolean;
    animationData: any;
    rendererSettings?: {
      preserveAspectRatio?: string;
    };
    path?: string;
  }
}
