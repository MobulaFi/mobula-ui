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
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // const dx = x - rect.width / 2;
        // const dy = y - rect.height / 2;
        // const tiltX = dy / rect.height;
        // const tiltY = -dx / rect.width;

        container.style.setProperty("--x", x + "px");
        container.style.setProperty("--y", y + "px");
        // container.style.setProperty("--rotateX", tiltX * 20 + "deg");
        // container.style.setProperty("--rotateY", tiltY * 20 + "deg");
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
