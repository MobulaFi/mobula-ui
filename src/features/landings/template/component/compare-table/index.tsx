import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { MediumFont } from "../../../../../components/fonts";

export const CompareTable = ({ title, contents }) => {
  const getColor = (isCheck: boolean, isError: boolean) => {
    if (isCheck) return "text-blue dark:text-blue";
    if (isError) return "text-light-font-40 dark:text-dark-font-40";
    return "text-light-font-100 dark:text-dark-font-100";
  };

  const getIcon = (isCheck: boolean, isError: boolean, entry: string) => {
    if (isCheck) return <BsCheckLg />;
    if (isError) return <AiOutlineClose />;
    return entry;
  };

  return (
    <div className="flex flex-col w-[185px] lg:w-[64px]">
      <div className="flex items-center justify-center h-[60px] md:h-[54px] w-full rounded-t-lg bg-light-bg-terciary dark:bg-dark-bg-terciary md:bg-none dark:md:bg-none">
        <MediumFont extraCss="font-normal">{title}</MediumFont>
      </div>
      {contents.map((entry) => {
        const isCheck = entry === "check";
        const isError = entry === "error";
        const color = getColor(isCheck, isError);
        const icon = getIcon(isCheck, isError, entry);
        return (
          <div
            className={`flex items-center justify-center h-[53px] w-full border border-light-border-primary
           dark:border-dark-border-primary border-t-0 md:border-t text-base md:text-xs text-light-font-100 dark:text-dark-font-100 
           ${color}`}
          >
            {icon}
          </div>
        );
      })}
    </div>
  );
};
