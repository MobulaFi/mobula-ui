import React, { useEffect, useRef } from "react";

type GridBoxProps = {
  title: string;
  image: string;
  description: string;
};

export const GridBox = ({ title, image, description }: GridBoxProps) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", (e) => {
        let x = e.pageX - container.offsetLeft;
        let y = e.pageY - container.offsetTop;
        container.style.setProperty("--x", x + "px");
        container.style.setProperty("--y", y + "px");
      });
    }
  }, []);
  return (
    <div
      className="p-8 rounded-2xl shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
     border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking"
      ref={containerRef}
    >
      <img
        src={image}
        alt="bitcoin"
        className="w-[60px] h-[60px] mb-6 mx-auto"
      />
      <h3 className="text-2xl font-medium font-[Poppins] mb-3 text-light-font-100 dark:text-dark-font-100 text-center">
        {title}
      </h3>
      <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] text-center">
        {description}
      </p>
    </div>
  );
};
