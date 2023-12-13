"use client";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
import React, { useEffect, useState } from "react";
import { NextChakraLink } from "../../../components/link";
import "../../../styles/global.css";
import { GridBox } from "./components/grid-box";
import { gridBoxContent, questions } from "./constant";

gsap.registerPlugin(MotionPathPlugin);

export const dynamic = "force-static";

export const HomeLanding = () => {
  const containerStyle = "flex flex-col max-w-[1200px] w-[90%] lg:w-[95%]";
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

  return (
    <div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.3/gsap.min.js"></script>

      <section
        className="w-screen flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center"
        style={{
          height: "calc(100vh - 65px)",
          backgroundImage: `url('/landing/main-background.svg'), radial-gradient(at right top, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))`,
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
                  "-webkit-text-fill-color": "transparent",
                }}
                className="text-[96px] font-bold leading-[90px] font-['Poppins'] w-fit mx-auto text-transparent 
                text-fill-color tracking-[-0.08em] bg-gradient-to-br from-[rgba(0,0,0,0.95)]
                to-[rgba(0,0,0,0.35)] dark:from-[rgba(255,255,255,0.95)]
                 dark:to-[rgba(255,255,255,0.35)] dark:text-transparent bg-clip-text"
              >
                The last web3 data
              </h1>
            </div>
            <div className="h-fit w-fit overflow-hidden mx-auto">
              <h1
                style={{
                  "-webkit-text-fill-color": "transparent",
                }}
                id="text"
                className="text-[96px] font-bold leading-[90px] font-['Poppins'] w-fit mx-auto text-transparent 
                text-fill-color tracking-[-0.08em] bg-gradient-to-br from-[rgba(0,0,0,0.95)]
                to-[rgba(0,0,0,0.35)] dark:from-[rgba(255,255,255,0.95)]
                 dark:to-[rgba(255,255,255,0.35)] dark:text-transparent bg-clip-text"
              >
                API you'll ever need
              </h1>
            </div>
            <div className="flex items-center justify-center mt-[60px]">
              <button className="w-[140px] mr-5 rounded h-[50px] bg-light-bg-terciary dark:bg-dark-bg-terciary">
                Get Started
              </button>
              <button className="w-[140px] ml-5 rounded h-[50px] bg-light-bg-terciary dark:bg-dark-bg-terciary">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
      <section
        className="h-screen w-screen flex justify-center items-center relative snap-center"
        style={{
          background:
            "radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
        }}
      >
        <div className={containerStyle}>
          <div className="flex items-center">
            <div className="w-2/4">
              <h2
                className="text-[64px] font-bold leading-[65px] font-['Poppins'] w-fit mx-auto 
              dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color 
              bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none"
                style={{
                  "-webkit-text-fill-color": "transparent",
                  "text-wrap": "balance",
                }}
              >
                Get any data downloaded to your database
              </h2>
              <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-10 text-xl">
                Mobula prioritizes privacy by employing{" "}
                <span className="text-light-font-100 dark:text-dark-font-100 font-medium">
                  decentralized servers
                </span>
                , ensuring that user data is not stored at all. This approach
                guarantees that sensitive
              </p>
              <div className="mt-8 flex items-center w-full max-w-[460px] rounded-xl p-2.5 justify-between">
                <div className="flex items-center">
                  <img src="/landing/icon-key.svg" alt="secure" />
                  <p className="text-light-font-100 dark:text-dark-font-100 font-[Poppins] ml-2.5 text-xl tracking-tighter">
                    Secure
                  </p>
                </div>
                <div className="flex items-center">
                  <img src="/landing/icon-lock.svg" alt="secure" />
                  <p className="text-light-font-100 dark:text-dark-font-100 font-[Poppins] ml-2.5 text-xl tracking-tighter">
                    Accurate
                  </p>
                </div>
                <div className="flex items-center">
                  <img src="/landing/icon-shield.svg" alt="secure" />
                  <p className="text-light-font-100 dark:text-dark-font-100 font-[Poppins] ml-2.5 text-xl tracking-tighter">
                    Transparent
                  </p>
                </div>
              </div>
            </div>
            <div className="w-2/4 flex justify-end">
              <div className="w-fit h-fit relative">
                <img src="/landing/ecosystem.svg" alt="ecosystem" />
                <img
                  src="/landing/ecosystem-planet.svg"
                  alt="ecosystem planet"
                  className="absolute top-1/2 left-1/2  z-[1]"
                  id="planets"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="h-screen w-screen flex justify-center items-center snap-center"
        style={{
          background:
            "radial-gradient(at right top, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
          // background: "radial-gradient(at right top, #112B52, #131627)",
        }}
      >
        <div className={containerStyle}>
          <h2
            className="text-[72px] font-bold leading-[75px] font-['Poppins'] w-fit mx-auto 
              dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color 
              bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none text-center"
            style={{
              "-webkit-text-fill-color": "transparent",
              "text-wrap": "balance",
            }}
          >
            Get any data downloaded to your database
          </h2>
          <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-10 text-xl max-w-[800px] text-center mx-auto">
            Mobula prioritizes privacy by employing{" "}
            <span className="text-light-font-100 dark:text-dark-font-100 font-medium">
              decentralized servers
            </span>
            , ensuring that user data is not stored at all. This approach
            guarantees that sensitive
          </p>
          <div className="grid grid-rows-2 grid-flow-col gap-10 mt-[100px]">
            {gridBoxContent.map((content) => (
              <GridBox
                key={content.title}
                title={content.title}
                image={content.image}
                description={content.description}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="h-screen w-screen flex justify-center items-center snap-center">
        <div className={containerStyle}>
          <div className="grid grid-rows-2 grid-flow-col gap-10 ">
            <div className="w-2/4 flex-col flex border border-light-border-primary dark:border-dark-border-primary rounded-b-xl rounded-xl">
              <div className="flex items-center justify-between bg-light-bg-terciary dark:bg-dark-bg-terciary py-3 rounded-t-xl">
                <div className="flex items-center">
                  <button className="mr-2.5 ml-5">cURL</button>
                  <button className="mr-2.5">Python</button>
                  <button className="mr-2.5">JavaScript</button>
                  <button className="mr-2.5">PHP</button>
                  <button className="mr-2.5">Go</button>
                  <button className="mr-2.5">Java</button>
                </div>
              </div>
              <div className="rounded-b-xl">
                <pre>
                  <code>{jsonContent}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-screen flex justify-center items-center h-screen snap-center">
        <div className={containerStyle}>
          <div>
            <h2
              className="text-[96px] font-bold leading-[90px] font-['Poppins'] w-fit mx-auto text-center 
              dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color 
              bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none"
              style={{
                "-webkit-text-fill-color": "transparent",
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
