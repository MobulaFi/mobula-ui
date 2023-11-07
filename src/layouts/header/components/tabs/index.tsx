import React, { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { navigation } from "../../constants";
import { TabsPopover } from "../ui/tabs-popover";

export const Tabs: React.FC = () => {
  const [selected, setSelected] = useState("");
  const isSmallScreen =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 1200;
  return (
    <div
      className="flex"
      //   fontFamily="Inter"
      //   color={text80}
      //   fontSize="13px"
      //   h={["35px", "35px", "45px", "45px"]}
    >
      {navigation.map((item) => {
        const isActive = selected === item.name && item.extends;
        const isEcosystem = isSmallScreen && item.name === "Ecosystem";
        const isDoubleSize = item.extends.length > 4;
        return (
          <div
            // pb-[22px]
            className="flex justify-center items-center font-medium h-[65px] "
            key={item.name}
            onMouseLeave={() => setSelected("")}
            onMouseEnter={() => {
              if (item.extends) setSelected(item.name);
              else setSelected("");
            }}
          >
            <div className="flex items-center relative text-sm text-light-font-100 dark:text-dark-font-100 mr-2.5">
              {item.name}{" "}
              <AiFillCaretDown
                className={`text-light-font-60 dark:text-dark-font-60 
            ${
              isActive ? "rotate-180" : "rotate-0"
            } mt-[3px] ml-[5px] text-[10px]`}
              />
              <div
                className={`border border-light-border-primary dark:border-dark-border-primary absolute top-[47px] ${
                  isActive ? "flex" : "hidden"
                }
             ${
               isEcosystem ? "left-[50%]" : "left-0"
             } bg-light-bg-secondary dark:bg-dark-bg-secondary z-10 shadow-md ${
                  isEcosystem ? "translate-x-[-35%]" : "translate-x-0"
                } 
             rounded ${
               isDoubleSize ? "w-[780px]" : "w-[390px]"
             } transition-all duration-250`}
              >
                <TabsPopover extend={item} condition={(i: number) => i < 4} />
                {selected === item.name && item.extends && isDoubleSize ? (
                  <TabsPopover
                    extend={item}
                    condition={(i: number) => i >= 4}
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
