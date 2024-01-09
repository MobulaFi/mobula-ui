import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { cn } from "../lib/shadcn/lib/utils";
import { LargeFont } from "./fonts";

interface ModalContainerProps {
  extraCss?: string;
  isOpen: boolean;
  title?: React.ReactNode;
  onClose: Function;
  children: React.ReactNode;
}

export const ModalContainer = ({
  extraCss,
  isOpen,
  onClose,
  title,
  children,
}: ModalContainerProps) => {
  return (
    <>
      <div
        className={`z-[100] left-0 inset-0 top-0 fixed w-screen h-screen bg-background/80 
          flex justify-center backdrop-blur-sm ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-all duration-200 ease-in-out`}
        onClick={() => onClose()}
      />
      <div
        className={cn(
          `z-[101] fixed left-1/2 -translate-x-1/2 top-[10vh] h-fit border border-light-border-primary dark:border-dark-border-primary
           rounded-2xl bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-font-100 dark:text-dark-font-100
            w-full md:w-[90%] ${
              title ? "py-3.5 px-4" : ""
            } overflow-y-scroll  ${
            isOpen
              ? "scale-100 opacity-100"
              : "opacity-0 scale-90 pointer-events-none"
          } transition-all duration-200 ease-in-out`,
          extraCss
        )}
      >
        {title ? (
          <div className="flex justify-between items-center mb-2.5">
            <LargeFont>{title}</LargeFont>
            <button onClick={() => onClose()}>
              <AiOutlineClose className="text-light-font-100 dark:text-dark-font-100 text-xl" />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </>
  );
};
