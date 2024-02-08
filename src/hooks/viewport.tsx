import { useEffect, useRef, useState } from "react";

export const useIsInViewport = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const ref = useRef<HTMLTableSectionElement | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    });

    return () => {
      observer.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (ref.current && observer.current) {
      observer.current.observe(ref.current);

      return () => {
        observer.current?.unobserve(ref.current);
      };
    }
  }, [ref.current, observer.current]);

  return { isIntersecting, ref };
};
