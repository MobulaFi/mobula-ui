"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

export const ContainerScroll = ({
  titleComponent,
}: {
  titleComponent: string | React.ReactNode;
}) => {
  const containerRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = (isContainer: boolean) => {
    return isMobile ? [0.7, 0.9] : [isContainer ? 1.05 : 1.4, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const scale = useTransform(scrollYProgress, [0, 1.2], scaleDimensions(true));
  const scaleText = useTransform(
    scrollYProgress,
    [0, 1.2],
    scaleDimensions(false)
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const translateText = useTransform(scrollYProgress, [0, 1], [140, 0]);

  return (
    <div
      className="h-[80rem] flex items-center justify-center relative p-20"
      ref={containerRef}
    >
      <div
        className="py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header
          translate={translateText}
          titleComponent={titleComponent}
          scale={scaleText}
        />
        <Card rotate={rotate} translate={translate} scale={scale} />
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent, scale }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
        scale,
      }}
      className="div max-w-5xl text-[96px] md:text-[56px] md:leading-[50px] font-bold leading-[90px] font-poppins w-fit mx-auto text-transparent 
      text-fill-color tracking-[-0.08em] bg-gradient-to-br from-[rgba(0,0,0,1)]
      to-[rgba(0,0,0,0.40)] dark:from-[rgba(255,255,255,1)]
       dark:to-[rgba(255,255,255,0.40)] dark:text-transparent bg-clip-text text-center pb-20"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
}: {
  rotate: any;
  scale: any;
  translate: any;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate, // rotate in X-axis
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-fit md:h-[40rem] w-full border-4 border-[#6C6C6C] p-6 bg-[#222222] rounded-[30px] shadow-2xl"
    >
      <motion.div
        className="bg-white cursor-pointer relative rounded-lg"
        style={{ translateY: translate }}
        whileHover={{
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        }}
      >
        <img
          src={"/landing/portfolio-example.png"}
          className="rounded-tr-md rounded-tl-md text-sm  rounded-xl"
          alt="portfolio image"
        />
      </motion.div>
    </motion.div>
  );
};
