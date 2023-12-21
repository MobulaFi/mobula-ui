"use client";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useEffect, useRef, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { NextChakraLink } from "../../../components/link";
import "../../../styles/global.css";
import { CuratedBox } from "./components/curated-box";
import { GridBox } from "./components/grid-box";
import { curatedDatasets, gridBoxContent, questions } from "./constant";
import { useHomeLanding } from "./context-manager";

gsap.registerPlugin(MotionPathPlugin);

export const dynamic = "force-static";

export const HomeLanding = () => {
  const containerStyle = "flex flex-col max-w-[1200px] w-[90%] lg:w-[95%]";
  const [triggerAccordion, setTriggerAccordion] = useState<number>(0);
  const { activeDataset, setActiveDataset } = useHomeLanding();
  const [datasetHover, setDatasetHover] = useState<number>(0);

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

  const scrollers = useRef(null);
  const chains = Object.values(blockchainsContent);
  const firstChains = chains.filter((_, i) => i < 6);
  const secChains = chains.filter((_, i) => i >= 6 && i < 13);
  const thirdChains = chains.filter((_, i) => i >= 13 && i < 20);
  const quarthChains = chains.filter((_, i) => i >= 20);

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
    if (container && indexing) {
      container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // const dx = x - rect.width / 2;
        // const dy = y - rect.height / 2;
        // const tiltX = dy / rect.height;
        // const tiltY = -dx / rect.width;

        container.style.setProperty("--x", x + "px");
        container.style.setProperty("--y", y + "px");

        // container.style.setProperty("--rotateX", tiltX * 20 + "deg");
        // container.style.setProperty("--rotateY", tiltY * 20 + "deg");
      });
      indexing.addEventListener("mousemove", (e) => {
        const rectIndexing = indexing.getBoundingClientRect();
        const xIndexing = e.clientX - rectIndexing.left;
        const yIndexing = e.clientY - rectIndexing.top;
        indexing.style.setProperty("--x", xIndexing + "px");
        indexing.style.setProperty("--y", yIndexing + "px");
      });
    }
  }, []);

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
                  WebkitTextFillColor: "transparent",
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
                  WebkitTextFillColor: "transparent",
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
                className="text-[72px] font-bold leading-[75px]  font-poppins w-fit mx-auto text-transparent 
                text-fill-color tracking-[-0.08em] bg-gradient-to-br from-[rgba(0,0,0,0.95)]
                to-[rgba(0,0,0,0.35)] dark:from-[rgba(255,255,255,0.95)]
                 dark:to-[rgba(255,255,255,0.35)] dark:text-transparent bg-clip-text"
              >
                Curated datasets
              </h1>
            </div>
            <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-6 text-xl text-center">
              A new way of using subgraphs, livestreamed, multi-chain & enriched
            </p>
            <div className="max-w-[900px] mx-auto">
              <div className="flex items-center mt-[50px] w-full justify-around">
                {curatedDatasets.map((dataset) => (
                  <button
                    key={dataset.id}
                    className={`${
                      datasetHover === dataset.id ||
                      activeDataset.id === dataset.id
                        ? "opacity-100"
                        : "opacity-40"
                    } flex flex-col items-center justify-start h-[130px] w-[33.33%] transition-all duration-300 ease-in-out`}
                    onMouseEnter={() => setDatasetHover(dataset.id)}
                    onMouseLeave={() => setDatasetHover(0)}
                    onClick={() => setActiveDataset(dataset)}
                  >
                    <img
                      className="w-[40px] h-[40px] rounded-full"
                      src={dataset.image}
                      alt={`${dataset.title} logo`}
                    />
                    <p className="text-light-font-100 dark:text-dark-font-100 font-poppins tracking-tight mt-3 text-4xl text-center font-medium ">
                      {dataset.title}
                    </p>
                    <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-3 text-xl text-center">
                      {dataset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[2px] w-full bg-light-font-10 dark:bg-dark-font-10 mt-[40px]">
              <div className="h-full w-full max-w-[900px] relative mx-auto">
                <div
                  className="h-full w-[33.33%] absolute bg-blue dark:bg-blue transition-all duration-300 ease-in-out"
                  style={{
                    left:
                      ((datasetHover !== 0 ? datasetHover : activeDataset.id) -
                        1) *
                        33.33 +
                      "%",
                  }}
                />{" "}
              </div>
            </div>
            <div className="flex w-full justify-between mt-[100px]">
              <div className="flex flex-col max-w-[650px]">
                <h2
                  className="text-[64px] font-bold leading-[65px] font-['Poppins'] w-fit  
              dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color 
              bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none"
                  style={{
                    WebkitTextFillColor: "transparent",
                    ...{ "--text-wrap": "balance" },
                  }}
                >
                  Serverless SQL for
                  <br />
                  the frontend cloud
                </h2>
                <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-10 text-xl ">
                  Mobula prioritizes privacy by employing{" "}
                  <span className="text-light-font-100 dark:text-dark-font-100">
                    decentralized servers
                  </span>
                  , ensuring that user data is not stored at all. This approach
                  guarantees that sensitive
                </p>
                <div className="w-full my-[50px] flex items-center">
                  <div className="border-[2px] border-light-font-10 dark:border-dark-font-10 h-[8px] w-[8px] rotate-[45deg]" />
                  <div className="bg-light-font-10 dark:bg-dark-font-10 h-[2px] w-full mx-2" />
                  <div className="border-[2px] border-light-font-10 dark:border-dark-font-10 h-[8px] w-[8px] rotate-[45deg]" />
                </div>
                <div
                  className="p-5 rounded-2xl shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
                   border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-full"
                  ref={containerRef}
                >
                  <div className="flex items-center">
                    <div
                      className="p-1 flex items-center justify-center shadow-xl bg-[rgba(23, 27, 43, 0.22)] backdrop-blur-md border
                   border-light-border-primary dark:border-dark-border-primary rounded-lg"
                    >
                      <img
                        className="w-[30px] h-[30px]"
                        src="/landing/curated-datasets/octopus.svg"
                        alt="secure"
                      />
                    </div>
                    <p className="text-light-font-100 dark:text-dark-font-100 font-poppins text-xl ml-2.5">
                      30+ Blockchains
                    </p>
                  </div>
                  <p className="text-light-font-60 dark:text-dark-font-60 font-poppins text-base mt-4">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Quos, odit deleniti? Explicabo laborum eveniet facere,
                    asperiores repellendus, sed voluptatum dolorem illo soluta
                    consectetur laudantium quos libero optio maxime consequatur
                    commodi.
                  </p>
                </div>
              </div>
              <div className="flex flex-col max-w-[450px] justify-between">
                {activeDataset.contents.map((content, i) => (
                  <CuratedBox key={i} content={content} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION INDEXING */}

      <section
        className="w-screen flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center py-[100px]"
        style={{
          backgroundImage: `radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))`,
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
                Indexing Supercharged
              </h1>
            </div>
            <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-6 text-xl text-center">
              A new way of using subgraphs, livestreamed, multi-chain & enriched
            </p>
            <div
              className="p-8 flex items-center shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border mt-[50px] 
                   border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-full h-[400px] 
                   overflow-hidden"
              ref={indexingRef}
            >
              <div className="w-2/4 flex flex-col">
                <h2 className="text-light-font-100 dark:text-dark-font-100 tracking-tight font-poppins text-4xl font-medium">
                  Livestreamed to your DB
                </h2>
                <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-7 text-lg mb-9 max-w-[500px]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolore, facilis consequuntur quasi corrupti sequi, minima sit
                  aspernatur ea ullam aut corporis dolores ut vel ratione porro
                  voluptate
                </p>
                <button
                  className="shadow-xl bg-[rgba(23, 27, 43, 0.22)] backdrop-blur-md
                 rounded h-[35px] w-fit px-2.5 border border-light-border-primary dark:border-dark-border-primary 
                 text-light-font-100 dark:text-dark-font-100"
                >
                  Read Docs
                </button>
              </div>
              <div className="w-2/4 flex flex-col">
                <div className="rounded-lg shadow-2xl w-fit h-fit">
                  <img
                    className="absolute bottom-[-20px] right-[-20px]"
                    src="/landing/supercharged/db.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section
        className="h-[70vh] w-screen flex justify-center items-center relative snap-center"
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
                  WebkitTextFillColor: "transparent",
                  ...{ "--text-wrap": "balance" },
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
              WebkitTextFillColor: "transparent",
              ...{ "--text-wrap": "balance" },
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
      {/* QUERY SECTION */}
      <section
        className="h-screen w-screen flex justify-center items-center snap-center"
        style={{
          background:
            "radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
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
      {/* NETWORKS SECTION */}
      <section
        className="h-[60vh] w-screen flex justify-center items-center snap-center"
        style={{
          background:
            "radial-gradient(at right top, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
          // background: "radial-gradient(at right top, #112B52, #131627)",
        }}
      >
        <div className={containerStyle}>
          <div className="w-full flex items-center justify-between">
            <div className="w-2/4 flex flex-col">
              <h2
                className="text-[72px] font-bold leading-[75px] font-['Poppins'] w-fit mx-auto 
              dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color 
              bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none"
                style={{
                  WebkitTextFillColor: "transparent",
                  ...{ "--text-wrap": "balance" },
                }}
              >
                Get any data downloaded to your database
              </h2>
              <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-10 text-xl max-w-[800px]">
                Mobula prioritizes privacy by employing{" "}
                <span className="text-light-font-100 dark:text-dark-font-100 font-medium">
                  decentralized servers
                </span>
                , ensuring that user data is not stored at all. This approach
                guarantees that sensitive
              </p>
            </div>
            {/* TODO: COMPONENTS */}
            <div className="w-2/4 ml-auto flex flex-col items-end">
              <div className="scrollerAnimated ">
                <div className="scrollerAnimated-inner flex">
                  {firstChains?.map((content, i) => (
                    <div
                      key={content.chainId}
                      className="flex justify-center items-center p-2.5 rounded-xl shadow-xl m-2.5 
                   border border-light-border-primary dark:border-dark-border-primary shadow-4xl skewBox "
                      style={{
                        background:
                          "radial-gradient(at left bottom, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
                        // background: "radial-gradient(at right top, #112B52, #131627)",
                      }}
                    >
                      <img
                        className="h-[45px] w-[45px] rounded-full opacity-80 shadow-4xl min-w-[45px] min-h-[45px]"
                        src={content?.logo}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="scrollerAnimated" data-direction="right">
                <div className="scrollerAnimated-inner flex">
                  {secChains?.map((content, i) => (
                    <div
                      key={content.chainId}
                      className="flex justify-center items-center p-2.5 rounded-xl shadow-xl m-2.5 
                 border border-light-border-primary dark:border-dark-border-primary shadow-4xl skewBox "
                      style={{
                        background:
                          "radial-gradient(at left bottom, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
                        // background: "radial-gradient(at right top, #112B52, #131627)",
                      }}
                    >
                      <img
                        className="h-[45px] w-[45px] rounded-full opacity-80 shadow-4xl shadow-2xl min-w-[45px] min-h-[45px]"
                        src={content?.logo}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="scrollerAnimated">
                <div className="scrollerAnimated-inner flex">
                  {thirdChains?.map((content, i) => (
                    <div
                      key={content.chainId}
                      className="flex justify-center items-center p-2.5 rounded-xl shadow-xl m-2.5 
                   border border-light-border-primary dark:border-dark-border-primary shadow-4xl skewBox "
                      style={{
                        background:
                          "radial-gradient(at left top, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
                        // background: "radial-gradient(at right top, #112B52, #131627)",
                      }}
                    >
                      <img
                        className="h-[45px] w-[45px] rounded-full opacity-80 shadow-4xl shadow-2xl min-w-[45px] min-h-[45px]"
                        src={content?.logo}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="scrollerAnimated" data-direction="right">
                <div className="scrollerAnimated-inner flex">
                  {quarthChains?.map((content, i) => (
                    <div
                      key={content.chainId}
                      className="flex justify-center items-center p-2.5 rounded-xl shadow-xl m-2.5 
                   border border-light-border-primary dark:border-dark-border-primary shadow-4xl skewBox "
                      style={{
                        background:
                          "radial-gradient(at right top, rgba(11, 32, 64, 0.4), rgba(19, 22, 39, 0.4))",
                        // background: "radial-gradient(at right top, #112B52, #131627)",
                      }}
                    >
                      <img
                        className="h-[45px] w-[45px] rounded-full opacity-80 shadow-2xl min-w-[45px] min-h-[45px]"
                        src={content?.logo}
                      />
                    </div>
                  ))}
                </div>
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
