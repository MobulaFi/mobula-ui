"use client";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
import React, { useEffect, useRef, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { NextChakraLink } from "../../../components/link";
import "../../../styles/global.css";
import { CuratedDataset } from "./components/curated-dataset";
import { LegacyStack } from "./components/legacy-stack";
import { IndexingSupercharged } from "./components/supercharged";
import { questions } from "./constant";
import { containerStyle } from "./style";
import { blurEffectAnimation } from "./utils";

gsap.registerPlugin(MotionPathPlugin);

export const dynamic = "force-static";

export const HomeLanding = () => {
  const [triggerAccordion, setTriggerAccordion] = useState<number>(0);

  useEffect(() => {
    hljs.highlightAll();
  }, []);

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
  const jsonContent = `
    curl --request GET \\
      --url 'https://api.mobula.exchange/v1/market/data?
            asset=bitcoin&blockchain=ethereum'
  `;

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
        className="w-screen flex justify-center items-center bg-no-repeat bg-contain bg-center relative snap-center"
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
                className="text-[96px] font-bold leading-[90px] font-['Poppins'] w-fit mx-auto text-transparent 
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
              <button className="water-button">Get Started</button>
              <button className="water-button ml-8">Learn More</button>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mt-[100px]">
                <div className="bg-light-font-10 dark:bg-dark-font-10 h-[2px] w-full" />
                <p className="text-light-font-40 dark:text-dark-font-40 text-xl whitespace-nowrap mx-2.5">
                  They using our APIs
                </p>
                <div className="bg-light-font-10 dark:bg-dark-font-10 h-[2px] w-full" />
              </div>
              <div className="grid grid-cols-5 gap-10 mt-[50px]">
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

      {/* SECTION 2 */}
      <CuratedDataset />
      <IndexingSupercharged />
      <LegacyStack />

      {/* QUERY SECTION */}
      <section
        className="h-screen w-screen flex justify-center items-center snap-center"
        style={{
          background:
            "radial-gradient(at center bottom, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
        }}
      >
        <div className={containerStyle}>
          <div className="grid grid-rows-2 grid-flow-col gap-20 ">
            <div
              className="p-5 rounded-2xl shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
              border-light-border-primary dark:border-dark-border-primary flex flex-col"
            >
              <div className="flex justify-between items-center">
                <div
                  className="rounded-lg shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
            border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking flex items-center
             h-[38px] w-full"
                >
                  <div className="bg-darkblue dark:bg-darkblue rounded-md py-1 px-2 ml-1">
                    <p className="text-blue dark:text-blue text-sm font-medium font-['Poppins']">
                      GET
                    </p>
                  </div>
                </div>{" "}
                <button
                  className="border border-blue dark:border-blue h-[35px] px-2.5 rounded-lg 
                ml-2.5 text-sm text-light-font-100 dark:text-dark-font-100 font-[Poppins] "
                >
                  Send
                </button>
              </div>
              <div className="flex flex-col rounded-2xl mt-5">
                <div
                  className="flex items-center h-[42px] rounded-t-2xl bg-[rgba(23, 27, 43, 0.62)] text-light-font-100
                 dark:text-dark-font-100 border-light-border-primary dark:border-dark-border-primary border px-5 font-['Poppins']"
                >
                  Query
                </div>
                <div
                  className="rounded-b-lg shadow-xl bg-[rgba(23, 27, 43, 0.22)] backdrop-blur-md border
            border-light-border-primary dark:border-dark-border-primary flex
             w-full p-5 flex-col"
                >
                  <p className="text-base text-light-font-80 dark:text-dark-font-80 font-['Poppins'] mt-2 mb-2.5">
                    asset string{" "}
                    <span className="text-red dark:text-red">*</span>
                  </p>
                  <div
                    className="rounded-lg shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
            border-light-border-primary dark:border-dark-border-primary flex items-center
             h-[38px] w-full relative"
                  >
                    <input
                      type="text"
                      placeholder="Mobula"
                      className="h-full w-full px-2.5 bg-[#101A32]
                       text-light-font-100 dark:text-dark-font-100 font-[Poppins] "
                      style={{
                        background: "transparent",
                      }}
                    />
                  </div>
                  <p className="text-base text-light-font-80 dark:text-dark-font-80 font-['Poppins'] mt-7 mb-2.5">
                    blockchain string{" "}
                    <span className="text-red dark:text-red">*</span>
                  </p>
                  <div
                    className="shadow-xl bg-[#101A32] rounded-2xl backdrop-blur-md border
                    border-light-border-primary dark:border-dark-border-primary flex items-center
                    h-[38px] w-full  relative"
                  >
                    {/* <p className="text-sm absolute top-[-12px] left-[15px] text-light-font-100 dark:text-dark-font-100 font-['Source Code Pro']">
                      blockchain string
                    </p> */}
                    <input
                      type="text"
                      placeholder="Blockhain"
                      className="h-full w-full px-2.5 bg-[rgba(23, 27, 43, 0.22)] dark:bg-[rgba(23, 27, 43, 0.22)]
                       text-light-font-100 dark:text-dark-font-100 font-[Poppins]"
                      style={{
                        background: "transparent",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
                    border-light-border-primary dark:border-dark-border-primary flex items-center
                    w-full relative flex-col h-fit min-h-[270px]"
            >
              <div
                className="flex items-center justify-between py-3 rounded-t-xl w-full 
                bg-[rgba(139, 141, 149, 1)] dark:bg-[rgba(139, 141, 149, 1)] border-b border-light-border-primary dark:border-dark-border-primary"
              >
                <div className="flex items-center w-full justify-between px-5">
                  <div className="flex items-center">
                    <button className="mr-2.5 text-light-font-100 dark:text-dark-font-100">
                      cURL
                    </button>
                    <button className="mr-2.5 text-light-font-100 dark:text-dark-font-100">
                      Python
                    </button>
                    <button className="mr-2.5 text-light-font-100 dark:text-dark-font-100">
                      JavaScript
                    </button>
                    <button className="mr-2.5 text-light-font-100 dark:text-dark-font-100">
                      PHP
                    </button>
                    <button className="mr-2.5 text-light-font-100 dark:text-dark-font-100">
                      Go
                    </button>
                    <button className="mr-2.5 text-light-font-100 dark:text-dark-font-100">
                      Java
                    </button>
                  </div>
                  <BiCopy className="text-light-font-60 dark:text-dark-font-60 text-base" />
                </div>
              </div>
              <div className="rounded-b-xl p-0 mt-[-20px] ml-[-30px]">
                <pre className="p-0">
                  <code className="p-0 w-full">{jsonContent}</code>
                </pre>
              </div>
            </div>
            <div className="flex flex-col justify-center h-full">
              <h2
                className="text-[72px] font-bold leading-[75px] font-['Poppins'] w-fit 
              dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color 
              bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none"
                style={{
                  WebkitTextFillColor: "transparent",
                  ...{ "--text-wrap": "balance" },
                }}
              >
                Safer, faster
                <br /> and smarter
              </h2>
              <p className="text-light-font-60 dark:text-dark-font-60 text-xl max-w-[460px] mt-5">
                Mobula prioritizes privacy by employing{" "}
                <span className="text-light-font-100 dark:text-dark-font-100 font-medium">
                  decentralized servers
                </span>
                , ensuring that user data is not stored at all. This approach
                guarantees that sensitive information{" "}
                <span className="text-light-font-100 dark:text-dark-font-100 font-medium">
                  remains secure
                </span>{" "}
                and inaccessible to anyone.
              </p>
            </div>
            <div
              className="shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
                    border-light-border-primary dark:border-dark-border-primary flex items-center
                    w-full relative flex-col h-fit min-h-[270px] max-h-[270px]"
            >
              <div
                className="flex items-center justify-between py-3 rounded-t-xl w-full 
                bg-[rgba(139, 141, 149, 1)] dark:bg-[rgba(139, 141, 149, 1)] border-b border-light-border-primary dark:border-dark-border-primary"
              >
                <div className="flex items-center w-full justify-between px-5">
                  <p className="text-blue dark:text-blue text-base">200</p>
                  <BiCopy className="text-light-font-60 dark:text-dark-font-60 text-base" />
                </div>
              </div>
              <div className="rounded-b-xl p-0 mt-[-20px] ml-[-30px]">
                <pre className="p-0">
                  <code className="p-0 w-full">{`
                  {
                    "data": {
                      "asset": "bitcoin",
                      "blockchain": "ethereum",
                      "price": 0.000000000000000001,
                      "timestamp": 1634179200
                    }
                  }
                  `}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUESTIONS ASKED */}
      <section
        className="w-screen flex justify-center items-center h-screen snap-center"
        style={{
          background:
            "radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
          // background: "radial-gradient(at right top, #112B52, #131627)",
        }}
      >
        <div className={containerStyle}>
          <div>
            <h2
              className="text-[96px] font-bold leading-[90px] font-['Poppins'] w-fit mx-auto text-center 
              dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color 
              bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none"
              style={{
                WebkitTextFillColor: "transparent",
              }}
            >
              Frequently Asked
              <br />
              Questions
            </h2>
            <p className="text-xl font-[Poppins] text-light-font-60 dark:text-dark-font-60 mt-[70px] mb-[100px] text-center">
              Have more questions?{" "}
              <NextChakraLink
                className="text-xl font-[Poppins] text-light-font-100 dark:text-dark-font-100 underline 
              underline-offset-4 decoration-1 hover:text-blue hover:dark:text-blue cursor-pointer transition-all
               ease-in-out duration-200"
              >
                {" "}
                Contact us
              </NextChakraLink>
            </p>
            {questions.map((content, i) => (
              <div
                key={content.title}
                className={`flex flex-col cursor-pointer 
                border-b border-light-border-primary dark:border-dark-border-primary ${
                  triggerAccordion === i + 1 ? "h-[200px]" : "h-[97px] "
                }  transition-all duration-300 ease-in-out overflow-hidden`}
                onMouseEnter={() => setTriggerAccordion(i + 1)}
                onMouseLeave={() => setTriggerAccordion(0)}
              >
                <div className="w-full py-8">
                  <p className="text-2xl font-[Poppins] text-light-font-100 dark:text-dark-font-100">
                    {content.title}
                  </p>
                </div>
                <p className="text-lg font-[Poppins] text-light-font-60 dark:text-dark-font-60 pb-8">
                  {content.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
