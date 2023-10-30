import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { LargeFont } from "./fonts";

interface ModalContainerProps {
  extraCss?: string;
  show: boolean;
  title: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export const ModalContainer = ({
  extraCss,
  show,
  setShow,
  title,
  children,
}: ModalContainerProps) => {
  console.log(show);
  return (
    <div className="z-[100] top-0 left-0 fixed w-screen h-screen bg-[black] bg-opacity-10 flex justify-center backdrop-blur-[1px] overflow-y-scroll">
      <div
        className={`z-[101] px-4 h-fit py-3.5 border mt-[10vh] border-light-border-primary dark:border-dark-border-primary rounded-2xl bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-font-100 dark:text-dark-font-100 w-full sm:w-[90%] ${extraCss}`}
      >
        <div className="flex justify-between items-center mb-2.5">
          <LargeFont>{title}</LargeFont>
          <button onClick={() => setShow(false)}>
            <AiOutlineClose className="text-light-font-100 dark:text-dark-font-100 text-md" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
