import React from "react";

export const GridBox = ({ title, image, description }) => {
  return (
    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-8 rounded-2xl shadow-xl">
      <img src={image} alt="bitcoin" className="w-[60px] h-[60px] mb-6" />
      <h3 className="text-2xl font-medium font-[Poppins] mb-3 text-light-font-100 dark:text-dark-font-100">
        {title}
      </h3>
      <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins]">
        {description}
      </p>
    </div>
  );
};
