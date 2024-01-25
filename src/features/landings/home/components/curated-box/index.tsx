import React, { useEffect, useRef } from "react";

export const CuratedBox = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dx = x - rect.width / 2;
        const dy = y - rect.height / 2;
        const tiltX = dy / rect.height;
        const tiltY = -dx / rect.width;

        container.style.setProperty("--x", x + "px");
        container.style.setProperty("--y", y + "px");
        container.style.setProperty("--rotateX", tiltX * 20 + "deg");
        container.style.setProperty("--rotateY", tiltY * 20 + "deg");
      });
    }
  }, []);

  return (
    <div
      className="p-5 rounded-2xl shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
         border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-full mt-5 lg:mt-2.5 min-w-[370px] lg:min-w-full"
      ref={containerRef}
    >
      <div className="flex items-center">
        <div
          className="p-1 flex items-center justify-center shadow-xl bg-dark-bg-hover backdrop-blur-md border
         border-light-border-primary dark:border-dark-border-primary rounded-lg"
        >
          {content.icon}
        </div>
        <p className="text-light-font-100 dark:text-dark-font-100 font-poppins text-xl ml-2.5">
          {content.title}
        </p>
      </div>
      <p className="text-light-font-60 dark:text-dark-font-60 font-poppins text-base mt-4 lg:text-sm lg:mt-3">
        {content.description}
      </p>
    </div>
  );
};
