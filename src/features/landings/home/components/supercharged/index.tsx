import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useEffect, useRef } from "react";
import { containerStyle } from "../../style";
import { blurEffectAnimation } from "../../utils";

export const IndexingSupercharged = () => {
  const liveRef = useRef<HTMLDivElement>(null);
  const mulitRef = useRef<HTMLDivElement>(null);
  const surcharge = useRef<HTMLDivElement>(null);
  const chains = Object.values(blockchainsContent);
  const firstChains = chains.filter((_, i) => i < 6);
  const secChains = chains.filter((_, i) => i >= 6 && i < 13);
  const thirdChains = chains.filter((_, i) => i >= 13 && i < 20);
  const quarthChains = chains.filter((_, i) => i >= 20);

  useEffect(() => {
    blurEffectAnimation(liveRef.current);
    blurEffectAnimation(mulitRef.current);
    blurEffectAnimation(surcharge.current);
  }, []);
  return (
    <section
      className="w-screen flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center py-[100px]"
      style={{
        backgroundImage: `radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
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
              className="text-[72px] md:text-[56px] md:leading-[56px] font-bold font-poppins w-fit mx-auto text-transparent 
                text-fill-color tracking-[-0.08em] bg-gradient-to-br from-[rgba(0,0,0,0.95)]
                to-[rgba(0,0,0,0.35)] dark:from-[rgba(255,255,255,0.95)]
                 dark:to-[rgba(255,255,255,0.35)] dark:text-transparent bg-clip-text md:text-start"
            >
              Indexing Supercharged
            </h1>
          </div>
          <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-6 text-xl md:text-base text-center md:text-start">
            A new way of using subgraphs, livestreamed, multi-chain & enriched
          </p>
          <div
            className="p-8 md:p-4 flex items-center shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border mt-[50px] 
                   border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-full h-[400px] 
                   overflow-hidden rotating-effect md:h-[450px] md:flex-col md:mt-5"
            ref={liveRef}
          >
            <div className="w-2/4 md:w-full flex flex-col">
              <h2 className="text-light-font-100 dark:text-dark-font-100 tracking-tight font-poppins text-4xl md:text-2xl font-medium">
                Livestreamed to your DB
              </h2>
              <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-7 text-lg mb-9 md:text-sm md:mt-3 md:mb-4 max-w-[500px]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore,
                facilis consequuntur quasi corrupti sequi, minima sit aspernatur
                ea ullam aut corporis dolores ut vel ratione porro voluptate
              </p>
              <button
                className="shadow-xl bg-[rgba(23, 27, 43, 0.22)] backdrop-blur-md
                 rounded h-[35px] w-fit px-2.5 border border-light-border-primary dark:border-dark-border-primary 
                 text-light-font-100 dark:text-dark-font-100"
              >
                Read Docs
              </button>
            </div>
            <div className="w-2/4 md:w-full flex flex-col">
              <div
                className="rounded-lg shadow-2xl w-fit h-fit md:h-[170px] absolute bottom-[-20px]
               right-[-20px] md:bottom-[50px] md:right-auto md:left-[30px]"
              >
                <img src="/landing/supercharged/db.png" />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-between md:flex-col md:justify-start">
            <div
              className=" flex items-center shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border mt-[50px] 
                   border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-[40%] md:mt-5 
                   overflow-hidden p-5 pb-0 rotating-effect md:w-full"
              ref={mulitRef}
            >
              <div className="w-full flex flex-col">
                <div className="scrollerAnimated ">
                  <div className="scrollerAnimated-inner flex">
                    {firstChains?.map((content, i) => (
                      <div
                        key={content.chainId}
                        className="flex justify-center items-center p-2.5 rounded-xl shadow-xl m-2.5 md:m-1  
                   border border-light-border-primary dark:border-dark-border-primary shadow-4xl skewBox "
                        style={{
                          background:
                            "radial-gradient(at left bottom, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
                          // background: "radial-gradient(at right top, #112B52, #131627)",
                        }}
                      >
                        <img
                          className="h-[45px] w-[45px] md:w-[30px] md:h-[30px] md:min-w-[30px] md:min-h-[30px]
                           rounded-full opacity-80 shadow-4xl min-w-[45px] min-h-[45px]"
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
                        className="flex justify-center items-center p-2.5 rounded-xl shadow-xl m-2.5 md:m-1
                 border border-light-border-primary dark:border-dark-border-primary shadow-4xl skewBox "
                        style={{
                          background:
                            "radial-gradient(at left bottom, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
                          // background: "radial-gradient(at right top, #112B52, #131627)",
                        }}
                      >
                        <img
                          className="h-[45px] w-[45px] rounded-full opacity-80 shadow-4xl 
                          shadow-2xl min-w-[45px] min-h-[45px] md:w-[30px] md:h-[30px] md:min-w-[30px] md:min-h-[30px]"
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
                        className="flex justify-center items-center p-2.5 rounded-xl shadow-xl m-2.5 md:m-1
                   border border-light-border-primary dark:border-dark-border-primary shadow-4xl skewBox "
                        style={{
                          background:
                            "radial-gradient(at left top, rgba(11, 32, 64, 1.0), rgba(19, 22, 39, 1.0))",
                          // background: "radial-gradient(at right top, #112B52, #131627)",
                        }}
                      >
                        <img
                          className="h-[45px] w-[45px] rounded-full opacity-80 shadow-4xl shadow-2xl min-w-[45px]
                           min-h-[45px] md:w-[30px] md:h-[30px] md:min-w-[30px] md:min-h-[30px]"
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
                        className="flex justify-center items-center p-2.5 rounded-xl shadow-xl m-2.5 md:m-1 
                   border border-light-border-primary dark:border-dark-border-primary shadow-4xl skewBox "
                        style={{
                          background:
                            "radial-gradient(at right top, rgba(11, 32, 64, 0.4), rgba(19, 22, 39, 0.4))",
                          // background: "radial-gradient(at right top, #112B52, #131627)",
                        }}
                      >
                        <img
                          className="h-[45px] w-[45px] rounded-full opacity-80 shadow-2xl min-w-[45px]
                           min-h-[45px] md:w-[30px] md:h-[30px] md:min-w-[30px] md:min-h-[30px]"
                          src={content?.logo}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8 md:mt-4 p-3 md:p-0 pb-0">
                  <h2 className="text-light-font-100 dark:text-dark-font-100 tracking-tight font-poppins text-4xl md:text-2xl font-medium ">
                    Multi-chain Indexing
                  </h2>
                  <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-7 md:mt-4 text-lg mb-9 md:mb-5 md:text-sm max-w-[500px]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolore, facilis consequuntur quasi corrupti sequi, minima
                    sit aspernatur ea ullam aut corporis dolores ut vel ratione
                    porro voluptate
                  </p>{" "}
                </div>
              </div>
            </div>
            <div
              className=" flex items-center shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border mt-[50px] 
                   border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-[55%]  
                   overflow-hidden p-5 pb-0 rotating-effect md:mt-5 md:w-full md:h-[420px]"
              ref={surcharge}
            >
              <div className="w-full flex flex-col mt-3 md:mt-0 mb-auto">
                <div className="p-3 md:p-0 pt-0">
                  <h2 className="text-light-font-100 dark:text-dark-font-100 tracking-tight font-poppins text-4xl md:text-2xl font-medium mt-4 md:mt-0">
                    Multi-chain Indexing
                  </h2>
                  <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-7 md:mt-4 text-lg mb-9 md:text-sm max-w-[500px]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolore, facilis consequuntur quasi corrupti sequi, minima
                    sit aspernatur ea ullam aut corporis dolores ut vel ratione
                    porro voluptate
                  </p>{" "}
                </div>
                <div
                  className="rounded-lg shadow-2xl w-fit h-fit md:h-[170px] absolute bottom-[-10px]
               left-[-10px] md:bottom-[50px] md:right-auto md:left-[30px]"
                >
                  <img src="/landing/supercharged/dashboard.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
