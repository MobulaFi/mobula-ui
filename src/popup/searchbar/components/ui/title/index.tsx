import React from "react";

interface TitleProps {
  children: React.ReactNode;
  extraCss?: string;
}

export const Title = ({ children, extraCss }: TitleProps) => {
  return (
    <p
      className={`mb-2.5 text-light-font-100 dark:text-dark-font-100 text-base px-[20px] md:px-2.5 font-medium ${extraCss}`}
    >
      {children}
    </p>
  );
};
