import { useEffect, useRef, useState } from "react";

export const useIsInViewport = (ref: React.RefObject<HTMLElement>) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry.isIntersecting)
    );
  }, []);

  useEffect(() => {
    if (ref?.current && observer.current) {
      observer.current.observe(ref.current);

      return () => {
        observer.current?.disconnect();
      };
    }
  }, [ref, observer]);

  return isIntersecting;
};
