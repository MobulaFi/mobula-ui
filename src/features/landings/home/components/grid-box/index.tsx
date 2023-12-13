import React from "react";

export const GridBox = ({ title, image, description }) => {
  return (
    <div
      className="p-8 rounded-2xl shadow-xl"
      style={{
        background: "rgba(23, 27, 43, 0.22)",
        borderRadius: "16px",
        backdropFilter: "blur(3.2px)",
        border: "1px solid rgba(23, 27, 43, 0.4)",
        "-webkit-backdrop-filter": " blur(3.2px)",
      }}
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
