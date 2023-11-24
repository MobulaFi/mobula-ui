import React, { ReactNode } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  titleChildren: ReactNode;
}

export const Drawer = ({
  isOpen,
  onClose,
  children,
  titleChildren,
}: DrawerProps) => {
  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm">
      <div
        className="sm:w-0 h-screen"
        style={{
          width: "calc(100vw - 400px)",
        }}
        onClick={onClose}
      />
      <div
        className="flex flex-col fixed top-0 w-[400px] sm:w-full h-[100vh] border-l border-light-border-primary
         dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary 
         transition-all duration-500 ease-in-out "
        style={{
          right: isOpen ? "0%" : "-100%",
        }}
      >
        <div className="flex items-center justify-between border-b border-light-border-primary dark:border-dark-border-primary p-5 md:p-[15px]">
          <div className="flex items-center">{titleChildren}</div>
          <button onClick={onClose}>
            <AiOutlineClose className="text-light-font-100 dark:text-dark-font-100 text-xl" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
