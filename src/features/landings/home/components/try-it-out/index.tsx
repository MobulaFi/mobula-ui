import React, { useEffect, useRef } from "react";
import { containerStyle } from "../../style";
import { blurEffectAnimation } from "../../utils";

export const TryItOut = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleWidth = titleRef.current?.offsetWidth;
  const [activeData, setActiveData] = React.useState<string>("market");
  const [queryResult, setQueryResult] = React.useState<any>(null);
  //   const [isHover, setIsHover] = React.useState<boolean>(false);

  useEffect(() => {
    if (containerRef.current && codeRef.current) {
      blurEffectAnimation(containerRef.current);
      blurEffectAnimation(codeRef.current);
    }
  }, []);
  return (
    <section
      className="w-screen flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center py-[100px]"
      style={{
        background:
          "radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), #131627 80%, #131627)",
      }}
      //   onMouseEnter={() => setIsHover(true)}
      //   onMouseLeave={() => setIsHover(false)}
    >
      <div className={containerStyle}>
        <div className="relative flex justify-center">
          <h2
            id="text"
            ref={titleRef}
            style={{
              WebkitTextFillColor: "transparent",
            }}
            className="text-[72px] font-bold font-poppins w-fit mx-auto text-transparent 
                  text-fill-color tracking-[-0.08em] bg-gradient-to-br from-[rgba(0,0,0,0.95)]
                  to-[rgba(0,0,0,0.35)] dark:from-[rgba(255,255,255,0.95)]
                   dark:to-[rgba(255,255,255,0.35)] dark:text-transparent bg-clip-text mb-[60px]"
          >
            Try it out!
          </h2>
          {/* <div
              className="absolute top-[100px] h-[2px] w-full bg-gradient-to-br 
                     from-[rgba(0,0,0,0.95)] to-[rgba(0,0,0,0.35)] 
                     dark:from-[rgba(255,255,255,0.95)] dark:to-[rgba(255,255,255,0.35)] 
                     mt-2 text-center transition-all duration-300 ease-in-out"
              style={{
                width: isHover ? titleWidth + "px" : "0px",
              }}
            /> */}
        </div>
      </div>
    </section>
  );
};
