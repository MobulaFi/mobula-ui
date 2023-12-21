import React, { useEffect, useRef, useState } from "react";
import { getTokenPercentage } from "../../../../../utils/formaters";
import { legacyStacks } from "../../constant";
import { containerStyle } from "../../style";
import { blurEffectAnimation } from "../../utils";

export const LegacyStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLegacyStack, setActiveLegacyStack] = useState(legacyStacks[2]);
  const [legacyStackHover, setLegacyStackHover] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    blurEffectAnimation(container);
  }, []);

  return (
    <section
      className="w-screen flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center py-[100px]"
      style={{
        backgroundImage: `radial-gradient(at right top, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))`,
      }}
    >
      <div className={containerStyle}>
        <div>
          <div className="h-fit w-fit overflow-hidden mx-auto">
            <h1
              id="text"
              style={{
                WebkitTextFillColor: "transparent",
              }}
              className="text-[72px] font-bold font-poppins w-fit mx-auto text-transparent 
                text-fill-color tracking-[-0.08em] bg-gradient-to-br from-[rgba(0,0,0,0.95)]
                to-[rgba(0,0,0,0.35)] dark:from-[rgba(255,255,255,0.95)]
                 dark:to-[rgba(255,255,255,0.35)] dark:text-transparent bg-clip-text"
            >
              Migrate your legacy stacks
            </h1>
          </div>
          <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-6 text-xl text-center">
            A new way of using subgraphs, livestreamed, multi-chain & enriched
          </p>
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
                  } flex flex-col items-center justify-start h-[130px] w-[20%] transition-all duration-300 ease-in-out`}
                  onMouseEnter={() => setLegacyStackHover(stack.id)}
                  onMouseLeave={() => setLegacyStackHover(0)}
                  onClick={() => setActiveLegacyStack(stack)}
                >
                  <img
                    className="w-[40px] h-[40px] rounded-full"
                    src={stack.image}
                    alt={`${stack.title} logo`}
                  />

                  <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-3 text-xl text-center">
                    {stack.description}
                  </p>
                  <p className="text-light-font-100 dark:text-dark-font-100 font-poppins tracking-tight mt-3 text-2xl text-center font-medium ">
                    {stack.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className="h-[2px] w-full bg-light-font-10 dark:bg-dark-font-10 mt-[40px] relative">
            <div
              className="h-full w-[20%] absolute bg-blue dark:bg-blue transition-all duration-300 ease-in-out"
              style={{
                left:
                  ((legacyStackHover !== 0
                    ? legacyStackHover
                    : activeLegacyStack.id) -
                    1) *
                    20 +
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
                <div key={content.name} className="w-[25%] flex flex-col">
                  <p className="text-light-font-60 tracking-tight dark:text-dark-font-60 font-poppins text-xl">
                    {content.name}
                  </p>
                  <p className="text-light-font-100 tracking-tight dark:text-dark-font-100 font-poppins mt-3 text-4xl">
                    {getTokenPercentage(content.value)}%
                  </p>
                </div>
              ))}
            </div>
            <div className=" p-8 flex items-center">
              <p className="text-light-font-60 tracking-tight dark:text-dark-font-60 font-poppins text-xl">
                Discover how bitcoin.com ave 12,000$ yearly bills by switch to
                Mobula
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
