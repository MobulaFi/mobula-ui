import React from "react";

interface MainContainerProps {
  children: React.ReactNode;
}

export const MainContainer: React.FC<MainContainerProps> = ({ children }) => (
  <div
    className="flex flex-row lg:flex-col max-w-[1450px] relative 
  mt-[28px] mb-[100px] justify-center w-[90%] sm:w-full"
  >
    {children}
  </div>
);
