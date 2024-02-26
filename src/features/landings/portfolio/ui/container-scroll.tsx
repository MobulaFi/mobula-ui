"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
export const ContainerScroll = ({
  users,
  titleComponent,
}: {
  users: {
    name: string;
    designation: string;
    image: string;
    badge?: string;
  }[];
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

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateText = useTransform(scrollYProgress, [0, 1], [0, -200]);
  return (
    <div
      className="h-[80rem] flex items-center justify-center relative p-20 pt-[200px]"
      ref={containerRef}
    >
      <div
        className="py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translateText} titleComponent={titleComponent} />
        <Card
          rotate={rotate}
          translate={translate}
          scale={scale}
          users={users}
        />
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
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
  users,
}: {
  rotate: any;
  scale: any;
  translate: any;
  users: {
    name: string;
    designation: string;
    image: string;
    badge?: string;
  }[];
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate, // rotate in X-axis
        scale,
        translateY: translate,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl w-full -mt-12 mx-auto h-[40rem] md:h-[40rem]  p-6 bg-[rgba(23, 27, 43, 0.22)]
      backdrop-blur-md  rounded-[30px] shadow-2xl border-[4px] border-light-border-primary dark:border-dark-border-primary"
    >
      <div className="bg-gray-100 h-full w-full rounded-2xl overflow-hidden p-4">
        <motion.div
          className="bg-white rounded-xl cursor-pointer relative"
          style={{
            translateY: translate,
            boxShadow:
              "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          }}
        >
          <img
            src={"/landing/portfolio-example.png"}
            className="text-sm rounded-xl"
            alt="thumbnail"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
