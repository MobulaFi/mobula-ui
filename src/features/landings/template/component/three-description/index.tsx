import React from "react";
import { LargeFont, MediumFont } from "../../../../../components/fonts";

export const ThreeDescription = ({ infoDescription }) => {
  return (
    <div className="flex justify-between mt-[50px] md:mt-5 pb-[50px] md:pb-0 md:flex-col border-b-2 border-light-border-primary dark:border-dark-border-primary">
      {infoDescription.map((entry) => {
        return (
          <div className="flex flex-col mb-0 md:mb-5 mr-5 md:mr-0">
            <div className="flex items-center mb-2.5">
              <img className="w-[25px] h-[25px] mr-2.5" src={entry.logo} />
              <LargeFont>{entry.title}</LargeFont>
            </div>
            <MediumFont>{entry.text}</MediumFont>
          </div>
        );
      })}
    </div>
  );
};
