import React from "react";

interface BoxTimeProps {
  children: React.ReactNode;
}

export const BoxTime = ({ children }: BoxTimeProps) => {
  return (
    <div
      className="flex items-center justify-center text-[15px] bg-light-bg-terciary
     dark:bg-dark-bg-terciary rounded-md px-2.5 w-fit h-[40px] md:h-[35px] min-w-[50px] md:min-w-[40px]
      border border-light-border-primary dark:border-dark-border-primary"
    >
      {children}
    </div>
  );
};
