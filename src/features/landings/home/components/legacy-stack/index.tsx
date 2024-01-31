import React, { useEffect, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { getTokenPercentage } from "../../../../../utils/formaters";
import { legacyStacks } from "../../constant";
import { containerStyle } from "../../style";
import { blurEffectAnimation } from "../../utils";
import { Title } from "../ui/title";

export const LegacyStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLegacyStack, setActiveLegacyStack] = useState(legacyStacks[2]);
  const [legacyStackHover, setLegacyStackHover] = useState(0);
  const [legacyStackOpen, setLegacyStackOpen] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    blurEffectAnimation(container);
  }, []);

  const handleStackClick = (id: number, stack: any) => {
    setActiveLegacyStack(stack);
    if (legacyStackOpen === id) setLegacyStackOpen(0);
    else setLegacyStackOpen(id);
  };

  return (
    <section
      className="w-full flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center py-[150px] md:py-[50px]"
      style={{
        backgroundImage: `radial-gradient(at right top, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
      }}
    >
      <div className={containerStyle}>
        <div>
          <Title title="Migrate your legacy stacks" />
          <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-6 text-xl lg:text-base text-center ">
            Save on your data bill & harmonize your app by working with a single
            provider, dedicated data provider.
          </p>
          <div className="flex flex-col w-full md:hidden">
            <div className="w-full mx-auto">
              <div className="flex items-center mt-[50px] w-full justify-around">
                {legacyStacks.map((stack) => (
                  <button
                    key={stack.id}
                    className={`${
                      legacyStackHover === stack.id ||
                      activeLegacyStack.id === stack.id
                        ? "opacity-100"
                        : "opacity-40"
                    } flex flex-col items-center justify-start h-[130px] w-[25%] transition-all duration-300 ease-in-out`}
                    onMouseEnter={() => setLegacyStackHover(stack.id)}
                    onMouseLeave={() => setLegacyStackHover(0)}
                    onClick={() => setActiveLegacyStack(stack)}
                  >
                    <img
                      className="w-[40px] h-[40px] md:w-[30px] md:h-[30px] rounded-full"
                      src={stack.image}
                      alt={`${stack.title} logo`}
                    />

                    <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-3 text-xl text-center md:text-xs">
                      {stack.description}
                    </p>
                    <p className="text-light-font-100 dark:text-dark-font-100 font-poppins tracking-tight mt-3 text-2xl text-center font-medium md:text-xs">
                      {stack.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[2px] w-full bg-light-font-10 dark:bg-dark-font-10 mt-[40px] relative">
              <div
                className="h-full w-[25%] absolute bg-blue dark:bg-blue transition-all duration-300 ease-in-out"
                style={{
                  left:
                    ((legacyStackHover !== 0
                      ? legacyStackHover
                      : activeLegacyStack.id) -
                      1) *
                      25 +
                    "%",
                }}
              />{" "}
            </div>
            <p className="text-light-font-60 tracking-tight dark:text-dark-font-60 font-poppins text-xl mt-[50px]">
              {activeLegacyStack.content.description}
            </p>
            <div
              className="flex flex-col shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border mt-7 
                   border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-full 
                   overflow-hidden h-fit"
              ref={containerRef}
            >
              <div className="p-8 flex items-center h-fit">
                <img
                  src={activeLegacyStack.image}
                  alt="stack logo"
                  className="w-[40px] h-[40px] rounded-full"
                />
                <p className="text-light-font-100 dark:text-dark-font-100 font-poppins tracking-tight ml-3 text-2xl text-center font-medium ">
                  {activeLegacyStack.title}
                </p>
              </div>
              <div
                className="p-8 h-fit flex items-center w-full bg-[rgba(23, 27, 43, 0.62)] shadow-top-bottom
               border border-light-border-primary dark:border-dark-border-primary"
              >
                {activeLegacyStack.content.values.map((content) => (
                  <div key={content.name} className="w-[33%] flex flex-col">
                    <p className="text-light-font-60 tracking-tight dark:text-dark-font-60 font-poppins text-xl">
                      {content.name}
                    </p>
                    <p className="text-light-font-100 tracking-tight dark:text-dark-font-100 font-poppins mt-3 text-4xl">
                      {getTokenPercentage(content.value as never)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden flex-col w-full md:flex mt-5">
            {legacyStacks.map((stack, i) => (
              <div
                key={stack.id}
                className={`${
                  legacyStackOpen === stack.id ? "h-[360px]" : "h-[70px]"
                } flex flex-col transition-all duration-300 ease-in-out bg-[rgba(23, 27, 43, 0.22)]
                 rounded backdrop-blur-md overflow-hidden ${
                   i !== legacyStacks.length - 1
                     ? "border-b border-light-border-primary dark:border-dark-border-primary"
                     : ""
                 }`}
              >
                <div
                  className="flex items-center justify-between py-[1rem] cursor-pointer"
                  onClick={() => handleStackClick(stack.id, stack)}
                >
                  <div className="flex items-center">
                    <img
                      className="h-[35px] w-[35px] mr-2.5"
                      src={stack.image}
                      alt={`${stack.title} logo`}
                    />
                    <h3 className="text-lg text-light-font-100 dark:text-dark-font-100">
                      {stack.title}
                    </h3>
                  </div>
                  <button className="flex items-center">
                    <BsChevronDown />
                  </button>
                </div>
                <div
                  className="px-6 py-2 h-fit flex flex-col w-full bg-[rgba(23, 27, 43, 0.62)] shadow-top-bottom
               border border-light-border-primary dark:border-dark-border-primary rounded-xl mt-1"
                >
                  {activeLegacyStack.content.values.map((content, i) => (
                    <div
                      key={content.name}
                      className={`w-full flex flex-col py-3 ${
                        i !== activeLegacyStack.content.values?.length - 1
                          ? "border-b border-light-border-primary dark:border-dark-border-primary"
                          : ""
                      }`}
                    >
                      <p className="text-light-font-60 tracking-tight dark:text-dark-font-60 font-poppins text-base">
                        {content.name}
                      </p>
                      <p className="text-light-font-100 tracking-tight dark:text-dark-font-100 font-poppins mt-1 text-2xl">
                        {content.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
