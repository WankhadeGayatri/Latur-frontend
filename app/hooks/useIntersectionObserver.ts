// hooks/useIntersectionObserver.ts
import { useEffect } from "react";

export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  callback: () => void,
  options: IntersectionObserverInit = {
    threshold: 0.1,
    root: null,
    rootMargin: "0px",
  }
) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [elementRef, callback, options]);
};
