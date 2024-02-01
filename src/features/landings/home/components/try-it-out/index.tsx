import React, { useEffect, useRef } from "react";
import { containerStyle } from "../../style";
import { blurEffectAnimation } from "../../utils";
import { TryItOutBox } from "../try-it-out-box";
import { Title } from "../ui/title";

export const TryItOut = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstBoxRef = useRef<HTMLDivElement>(null);
  const secondBoxRef = useRef<HTMLDivElement>(null);
  const thirdBoxRef = useRef<HTMLDivElement>(null);
  const titleWidth = titleRef.current?.offsetWidth;
  const [activeData, setActiveData] = React.useState<string>("market");
  const [queryResult, setQueryResult] = React.useState<any>(null);

  useEffect(() => {
    if (firstBoxRef.current && secondBoxRef.current && thirdBoxRef.current) {
      blurEffectAnimation(firstBoxRef.current);
      blurEffectAnimation(secondBoxRef.current);
      blurEffectAnimation(thirdBoxRef.current);
    }
    // const sectionEl = document.getElementById("section-try-it-out");
    // gsap.to("#slideUp", {
    //   y: -100,
    //   opacity: 0,
    //   duration: 0,
    // });
    // gsap.to("#slideUpSecond", {
    //   y: -100,
    //   opacity: 0,
    //   duration: 0,
    // });
    // gsap.to("#slideUpThird", {
    //   y: -100,
    //   opacity: 0,
    //   duration: 0,
    // });
    // gsap.to("#slideUp", {
    //   y: 0,
    //   opacity: 1,
    //   duration: 5,
    //   scrollTrigger: {
    //     trigger: sectionEl,
    //     start: "top 60%",
    //     end: "center 90%",
    //     toggleActions: "restart none none reverse",
    //     scrub: 2,
    //   },
    // });
    // gsap.to("#slideUpSecond", {
    //   y: 0,
    //   opacity: 1,
    //   duration: 5,
    //   scrollTrigger: {
    //     trigger: sectionEl,
    //     start: "top 55%",
    //     end: "center 85%",
    //     toggleActions: "restart none none reverse",
    //     scrub: 2,
    //   },
    // });
    // gsap.to("#slideUpThird", {
    //   y: 0,
    //   opacity: 1,
    //   duration: 5,
    //   scrollTrigger: {
    //     trigger: sectionEl,
    //     start: "top 50%",
    //     end: "center 80%",
    //     toggleActions: "restart none none reverse",
    //     scrub: 2,
    //   },
    // });
  }, []);

  return (
    <section
      className="w-full flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center py-[150px] md:py-[50px]"
      style={{
        background:
          "radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), #131627 80%, #131627)",
      }}
      //   onMouseEnter={() => setIsHover(true)}
      //   onMouseLeave={() => setIsHover(false)}
      id="section-try-it-out"
    >
      <div className={containerStyle}>
        <div className="relative flex justify-center flex-col items-center md:items-start">
          <Title title="Try it out!" />
          <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-2 text-xl md:text-base mx-auto text-center w-fit">
            Get started for free, in minutes, no credit card required.
          </p>
        </div>
        <div className="flex items-center justify-between md:flex-col max-w-[95%] mx-auto md:max-w-full md:mt-6">
          <TryItOutBox
            ref={firstBoxRef}
            idx={0}
            url="https://docs.mobula.io/api-reference/endpoint/wallet-portfolio"
          />
          <TryItOutBox
            ref={secondBoxRef}
            idx={1}
            url="https://docs.mobula.io/api-reference/endpoint/market-data"
          />
          <TryItOutBox
            ref={thirdBoxRef}
            idx={2}
            url="https://docs.mobula.io/api-reference/endpoint/all"
          />
        </div>
      </div>
    </section>
  );
};
