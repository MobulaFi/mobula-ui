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
  if (isOpen)
    return (
      <div className="z-[100] inset-0 top-0 left-0 fixed w-screen h-screen bg-background/80 flex justify-center backdrop-blur-sm overflow-y-auto">
        <div
          className={cn(
            `z-[101] h-fit border mt-[10vh] border-light-border-primary dark:border-dark-border-primary
           rounded-2xl bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-font-100 dark:text-dark-font-100
            w-full sm:w-[90%] mx-auto ${title ? "py-3.5 px-4" : ""}`,
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
      </div>
    );
  return null;
};
