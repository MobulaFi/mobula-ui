import React, { useState } from "react";

interface MiddleBoxProps {
  showPageMobile?: number;
}

export const MiddleBox = ({ showPageMobile = 0 }: MiddleBoxProps) => {
  const [showPage, setShowPage] = useState(0);

  return (
    <div
      className={`flex h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
      border-light-border-primary dark:border-dark-border-primary py-2.5 relative overflow-hidden 
      min-w-[407px] md:min-w-full w-[31.5%] lg:w-full transition duration-500 ${
        showPageMobile === 1 ? "z-[3]" : "z-[1]"
      }] mx-2.5 md:mx-0`}
      style={{ transform: `translateX(-${showPageMobile * 100}%)` }}
    >
      <div className="flex items-center absolute top-0 right-0 h-[35px] px-[15px] bg-light-bg-secondary dark:bg-dark-bg-secondary z-[1]">
        {/* {render.map((_, idx) => (
          <button
            className={`rounded-full ${
              showPage === idx ? "w-[9px]" : "w-[8px]"
            } ${showPage === idx ? "h-[9px]" : "h-[8px]"} ${
              showPage === idx ? "max-w-[9px]" : "max-w-[8px]"
            } ${
              showPage === idx ? "max-h-[9px]" : "max-h-[8px]"
            } px-0 ml-[5px] ${
              showPage === idx
                ? "bg-light-font-80 dark:bg-dark-font-80"
                : "bg-light-font-40 dark:bg-dark-font-40"
            } `}
            key={idx as Key}
            onClick={() => setShowPage(idx)}
          />
        ))} */}
      </div>
      {/* {render} */}
    </div>
  );
};
