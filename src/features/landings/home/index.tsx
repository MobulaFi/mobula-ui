"use client";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import React, { useEffect, useRef, useState } from "react";

import { CuratedDataset } from "./components/curated-dataset";
import { GetInTouch } from "./components/get-in-touch";
import { LegacyStack } from "./components/legacy-stack";
import { Playground } from "./components/playground";
import { IndexingSupercharged } from "./components/supercharged";
import { containerStyle } from "./style";
import { blurEffectAnimation } from "./utils";

gsap.registerPlugin(MotionPathPlugin);

export const dynamic = "force-static";

export const HomeLanding = () => {
  const [triggerAccordion, setTriggerAccordion] = useState<number>(0);

  // Gsap animation
  useEffect(() => {
    let tl = gsap.timeline({ defaults: { ease: "slowMo.easeOut" } });
    tl.fromTo(
      "#text",
      {
        y: "100%",
        duration: 0.4,
        stagger: 0.25,
        opacity: 0,
      },
      {
        y: "0%",
        stagger: 0.25,
        opacity: 1,
      }
    );
    gsap.from("#planets", { x: "-50%", y: "-50%" });
    gsap.to("#planets", {
      x: "-50%",
      y: "-50%",
      rotate: 360,
      duration: 25,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  // Smooth scroll animation
  const lenis = new Lenis();

  lenis.on("scroll", (e) => {
    console.log(e);
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

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
    <div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.3/gsap.min.js"></script>
      {/* // url('https://c4.wallpaperflare.com/wallpaper/849/714/485/water-bubbles-wallpaper-preview.jpg
          https://cdn.dribbble.com/users/2119718/screenshots/9806865/media/1640987ab7ebad6c43be7cdf33e1a365.png?resize=1600x1200&vertical=center */}
      <section
        className="w-screen flex justify-center items-center bg-no-repeat bg-contain md:bg-cover bg-center relative snap-center"
        style={{
          height: "calc(100vh - 65px)",
          backgroundImage: `url('/landing/main-background.svg'), radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
        }}
      >
        <div className={containerStyle}>
          <div>
            <div className="h-fit w-fit overflow-hidden mx-auto">
              <h1
                //   className="text-[96px] font-bold leading-[90px] font-['Poppins'] w-fit mx-auto
                //   dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color
                //   bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none
                //  "
                //   id="text"
                //   style={{
                //     "-webkit-text-fill-color": "transparent",
                //   }}
                id="text"
                style={{
                  WebkitTextFillColor: "transparent",
                }}
                className="text-[96px] md:text-[56px] md:leading-[50px] font-bold leading-[90px] font-poppins w-fit mx-auto text-transparent 
                text-fill-color tracking-[-0.08em] bg-gradient-to-br from-[rgba(0,0,0,0.95)]
                to-[rgba(0,0,0,0.35)] dark:from-[rgba(255,255,255,0.95)]
                 dark:to-[rgba(255,255,255,0.35)] dark:text-transparent bg-clip-text text-center"
              >
                The last data provider
                <br />
                You&apos;ll ever need
              </h1>
            </div>

            <div className="flex items-center justify-center mt-[60px]">
              <button className="water-button w-[150px] h-[50px] text-[15px] font-medium">
                Get Started
              </button>
              <button className="water-button ml-8 w-[150px] h-[50px] text-[15px] font-medium">
                Learn More
              </button>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mt-[100px] md:mt-[75px]">
                <div className="bg-light-font-10 dark:bg-dark-font-10 h-[2px] w-full" />
                <p className="text-light-font-40 dark:text-dark-font-40 text-xl whitespace-nowrap mx-2.5 font-poppins">
                  They using our APIs
                </p>
                <div className="bg-light-font-10 dark:bg-dark-font-10 h-[2px] w-full" />
              </div>
              <div className="grid grid-cols-5 gap-10 md:grid-cols-3 md:gap-3 mt-[50px] md:mt-7 place-items-center">
                <img src="/landing/partner/nimbus.svg" alt="nimbus logo" />
                <img src="/landing/partner/supra.svg" alt="supra oracle logo" />
                <img src="/landing/partner/alchemy.png" alt="alchemy logo" />
                <img
                  src="/landing/partner/embr.svg"
                  alt="embr logo"
                  className="mx-auto"
                />
                <img
                  src="/landing/partner/etherspot.svg"
                  alt="etherspot logo"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <CuratedDataset />
      <IndexingSupercharged />
      <LegacyStack />
      <Playground />
      <GetInTouch />
    </div>
  );
};