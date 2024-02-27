"use client";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import React, { useRef } from "react";

export const StickyScroll = ({
  content,
}: {
  content: {
    title: string;
    description: string;
    logo: string;
  }[];
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    cardsBreakpoints.forEach((breakpoint, index) => {
      if (latest > breakpoint - 0.2 && latest <= breakpoint) {
        setActiveCard(() => index);
      }
    });
  });

  const backgroundColors = [
    "var(--slate-900)",
    "var(--black)",
    "var(--neutral-900)",
  ];

  console.log("", content[activeCard % content.length]?.logo);
  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="h-[30rem] overflow-y-auto flex justify-center relative space-x-10 rounded-md p-10 w-full max-w-[1200px] mx-auto"
      ref={ref}
    >
      <div className="div relative flex items-start px-4 w-full">
        <div className="w-full ">
          {content.map((item, index) => (
            <div
              key={item.title + index}
              className={`${
                index === content.length - 1
                  ? "mt-[150px] mb-[50px]"
                  : "my-[190px]"
              } ${index === 0 ? "mt-[100px]" : ""} `}
            >
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.2,
                }}
                className="text-4xl font-bold text-light-font-100 dark:text-dark-font-100 font-poppins transition-all duration-300 ease-in-out tracking-tighter"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.2,
                }}
                className="max-w-md mt-6 text-light-font-60 dark:text-dark-font-60 text-lg font-poppins transition-all duration-1000 ease-in-out"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <motion.div
        animate={{
          backgroundImage: `url('${
            content[activeCard % content.length]?.logo
          }')`,
        }}
        className="block h-60 w-[1000px] rounded-md bg-white sticky top-10 overflow-hidden bg-no-repeat bg-cover bg-center"
      ></motion.div>
    </motion.div>
  );
};
