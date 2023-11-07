import React, { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { NextChakraLink } from "../../../../../components/link";
import { pushData } from "../../../../../lib/mixpanel";

interface TabsPopoverProps {
  extend: {
    extends: {
      name: string;
      description: string;
      url: string;
      icon: React.ReactNode;
    }[];
  };
  condition: (i: number) => boolean;
}

export const TabsPopover = ({ extend, condition }: TabsPopoverProps) => {
  const [mouseHover, setMouseHover] = useState("");
  return (
    <div className="w-full flex flex-col p-3">
      {extend?.extends?.map((entry, i) => {
        const isHover = mouseHover === entry.name;
        if (condition(i))
          return (
            <NextChakraLink
              key={entry.name}
              onClick={() => {
                pushData("Header Clicked", {
                  name: entry.name,
                });
              }}
              href={entry.url}
            >
              <div
                className={`w-full flex p-3 rounded h-[60px] ${
                  isHover
                    ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                    : "bg-transparent dark:bg-transparent"
                }
               transition-all ${
                 i !== extend.extends.length - 1 && i !== 3 ? "mb-2.5" : "mb-0"
               }`}
                onMouseEnter={() => setMouseHover(entry.name)}
                onMouseLeave={() => setMouseHover("")}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="flex bg-light-bg-hover dark:bg-dark-bg-hover h-[36px] w-[36px] min-w-[36px] items-center justify-center rounded">
                      {entry.icon}
                    </div>
                    <div className="ml-[15px]">
                      <p className="text-md text-light-font-100 dark:text-dark-font-100 text-medium">
                        {entry.name}
                      </p>
                      <p className="text-xs text-light-font-40 dark:text-dark-font-40 text-normal">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                  <BsChevronRight
                    className={`text-md ${
                      isHover ? "animate-tabs" : "opacity-0"
                    } text-light-font-60 dark:text-dark-font-60 animate-skeleton`}
                  />
                </div>
              </div>
            </NextChakraLink>
          );
        return null;
      })}
    </div>
  );
};
