import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { tryItOutContent } from "../../constant";

interface TryItOutBoxProps {
  idx: number;
  url: string;
}
const TryItOutBox = React.forwardRef<HTMLDivElement, TryItOutBoxProps>(
  (props, ref) => {
    const boxStyle =
      "flex items-center md:items-start max-w-[345px] md:max-w-full flex-col shadow-lg hover:shadow-2xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border mt-[50px] md:mt-2.5 border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-[31%] md:w-full h-[430px] md:h-fit hover:-translate-y-4 md:hover:translate-y-0 transition-all duration-300 ease-in-out";
    return (
      <div className={boxStyle} ref={ref}>
        <a
          href={props.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <img
            className="h-[190px] rounded-t-2xl w-full object-cover md:hidden"
            src={tryItOutContent[props.idx].image}
            alt={`${tryItOutContent[props.idx].title} image`}
          />
          <div className="flex items-center justify-center md:items-start flex-col p-6">
            <p className="text-2xl dark:text-dark-font-100 text-light-font-100 mt-1 font-poppins md:text-start w-fit text-center">
              {tryItOutContent[props.idx].title}
            </p>
            <p className="text-base dark:text-dark-font-60 text-light-font-60 font-poppins mt-4 text-center md:text-start">
              {tryItOutContent[props.idx].description}
            </p>
            <div className="flex items-center mt-6">
              <p className="text-blue dark:text-blue mr-1 whitespace-nowrap text-base font-poppins">
                Read docs!
              </p>
              <FaArrowRightLong className="text-blue dark:text-blue text-base" />
            </div>
          </div>
        </a>
      </div>
    );
  }
);

TryItOutBox.displayName = "TryItOutBox";

export { TryItOutBox };
