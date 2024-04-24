"use client";
import { useEffect, useRef, useState } from "react";
import { NextChakraLink } from "../../../components/link";
import { CuratedDataset } from "./components/curated-dataset";
import { GetInTouch } from "./components/get-in-touch";
import { LegacyStack } from "./components/legacy-stack";
import { IndexingSupercharged } from "./components/supercharged";
import { TryItOut } from "./components/try-it-out";
import { containerStyle } from "./style";
import { blurEffectAnimation } from "./utils";

export const dynamic = "force-static";

export const HomeLanding = () => {
  const [triggerAccordion, setTriggerAccordion] = useState<number>(0);

  // Gsap animation
  // useEffect(() => {
  //   let tl = gsap.timeline({ defaults: { ease: "slowMo.easeOut" } });
  //   tl.fromTo(
  //     "#text",
  //     {
  //       y: "100%",
  //       duration: 0.4,
  //       stagger: 0.25,
  //       opacity: 0,
  //     },
  //     {
  //       y: "0%",
  //       stagger: 0.25,
  //       opacity: 1,
  //     }
  //   );
  //   gsap.from("#planets", { x: "-50%", y: "-50%" });
  //   gsap.to("#planets", {
  //     x: "-50%",
  //     y: "-50%",
  //     rotate: 360,
  //     duration: 25,
  //     repeat: -1,
  //     ease: "linear",
  //   });
  // }, []);

  // Smooth scroll animation
  // const lenis = new Lenis();

  // function raf(time) {
  //   lenis.raf(time);
  //   requestAnimationFrame(raf);
  // }

  // requestAnimationFrame(raf);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const scrollers = document.querySelectorAll(".scrollerAnimated");

      scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", "true");
        const scrollerInner: any = scroller.querySelector(
          ".scrollerAnimated-inner"
        );
        const scrollerContent: any = Array.from(scrollerInner.children);

        scrollerContent.forEach((item) => {
          const duplicated: any = item?.cloneNode(true);
          duplicated.setAttribute("aria-hidden", "true");
          scrollerInner.appendChild(duplicated);
        });
      });
    }
  }, []);

  const containerRef = useRef(null);
  const indexingRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const indexing = indexingRef.current;
    blurEffectAnimation(container);
    blurEffectAnimation(indexing);
  }, []);

  return (
    <div className="overflow-y-scroll">
      <section
        className="w-full flex justify-center items-center bg-no-repeat bg-contain md:bg-cover bg-center relative snap-center h-screen md:h-screenMain md:pb-[50px] md:py-[100px]"
        style={{
          backgroundImage: `url('/landing/main-background.svg'), radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
        }}
      >
        <div className={containerStyle}>
          <div>
            <div className="h-fit w-fit overflow-hidden mx-auto">
              <h1
                id="text"
                style={{
                  WebkitTextFillColor: "transparent",
                  // @ts-ignore
                  "text-wrap": "balance",
                }}
                className="text-[85px] md:text-[65px] md:leading-[70px] font-bold leading-[95px] font-poppins w-fit mx-auto text-transparent 
                text-fill-color tracking-tighter bg-gradient-to-br from-[rgba(0,0,0,1)]
                to-[rgba(0,0,0,0.40)] dark:from-[rgba(255,255,255,1)]
                 dark:to-[rgba(255,255,255,0.40)] dark:text-transparent bg-clip-text text-center"
              >
                The last onchain data provider you&apos;ll ever need
              </h1>
            </div>

            <div className="flex items-center justify-center flex-col mt-[60px]">
              <button
                className=" w-[250px] h-[45px] text-xl font-medium bg-[#253558] hover:bg-[#415288] border hover:border-blue
               dark:border-darkblue water-button  md:h-[40px] md:w-[190px] md:text-sm md:font-normal"
              >
                <NextChakraLink
                  href="https://admin.mobula.fi/?utm_source=landing&utm_medium=cta&utm_campaign=origin_main_landing"
                  target="_blank"
                  rel="noopener noreferrer"
                  extraCss="text-base md:text-sm"
                >
                  Get Started for free
                  {/* Start your journey here */}
                </NextChakraLink>
              </button>
              <button
                className="dark:text-dark-font-100 font-poppins md:h-[40px] md:w-[132px] md:text-sm md:font-normal
               w-[150px] h-[50px] text-[15px] font-medium hover:tracking-[0.5px] transition-all duration-300 ease-in-out mt-5 md:mt-3"
              >
                <NextChakraLink
                  href="https://docs.mobula.io/api-reference/introduction?utm_source=landing&utm_medium=cta&utm_campaign=origin_main_landing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Docs {">"}
                </NextChakraLink>
              </button>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mt-[100px] md:mt-[75px]">
                <div className="w-full flex items-center">
                  <div className="border-[2px] border-light-font-10 dark:border-dark-font-10 h-[8px] w-[8px] rotate-[45deg]" />
                  <div className="bg-light-font-10 dark:bg-dark-font-10 h-[2px] w-full mx-2" />
                </div>
                <p className="text-light-font-40 dark:text-dark-font-40 text-xl whitespace-nowrap mx-2.5 font-poppins md:text-lg">
                  Powering the best
                </p>
                <div className="w-full flex items-center">
                  <div className="bg-light-font-10 dark:bg-dark-font-10 h-[2px] w-full mx-2" />
                  <div className="border-[2px] border-light-font-10 dark:border-dark-font-10 h-[8px] w-[8px] rotate-[45deg]" />
                </div>
              </div>
              <div className="grid grid-cols-5 sm:col-end-2 gap-10 md:grid-cols-3 md:gap-3 mt-[50px] md:mt-7 place-items-center sm:justify-items-center">
                <img
                  src="/landing/partner/embr.svg"
                  alt="embr logo"
                  className="mx-auto md:hidden"
                />
                <img src="/landing/partner/supra.svg" alt="supra oracle logo" />
                <img src="/landing/partner/alchemy.png" alt="alchemy logo" />
                <img src="/landing/partner/op.svg" alt="optimism logo" />
                <img
                  src="/landing/partner/stripe.svg"
                  alt="stripe logo"
                  className="md:hidden h-[42px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <CuratedDataset />
      <IndexingSupercharged />
      <LegacyStack />
      <TryItOut />
      <GetInTouch />
    </div>
  );
};
