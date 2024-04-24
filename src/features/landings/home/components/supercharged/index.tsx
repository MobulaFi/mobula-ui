import React, { useEffect, useRef } from "react";
import { containerStyle } from "../../style";
import { blurEffectAnimation } from "../../utils";
import { Title } from "../ui/title";

export const IndexingSupercharged = () => {
  const liveRef = useRef<HTMLDivElement>(null);
  const mulitRef = useRef<HTMLDivElement>(null);
  const surcharge = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = React.useState<number>(0);

  useEffect(() => {
    blurEffectAnimation(liveRef.current);
    blurEffectAnimation(mulitRef.current);
    blurEffectAnimation(surcharge.current);
  }, []);
  return (
    <section
      className="w-full flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center py-[150px] md:py-[50px]"
      style={{
        backgroundImage: `radial-gradient(at right bottom, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
      }}
    >
      <div className={containerStyle}>
        <div>
          <Title title="Analytics Supercharged" />
          <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-6 text-xl md:text-base text-center">
            Data warehousing, BI dashboards - consumed via REST or livestreamed
            to your DB.
          </p>
          <div
            className="p-8 md:p-4 flex items-center shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border mt-[50px] 
                   border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-full h-[400px] 
                   overflow-hidden rotating-effect md:h-[400px] md:flex-col md:mt-5"
            ref={liveRef}
            onMouseEnter={() => setIsHover(1)}
            onMouseLeave={() => setIsHover(0)}
          >
            <div className="w-2/4 md:w-full flex flex-col">
              <h2 className="text-light-font-100 dark:text-dark-font-100 tracking-tight font-poppins text-4xl md:text-2xl font-medium">
                Livestreamed to your DB
              </h2>
              <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-7 text-lg mb-9 md:text-sm md:mt-3 md:mb-4 max-w-[500px]">
                Get blockchain data feeds livestreamed to your database. No more
                polling, no more waiting, no infra to manage.
              </p>
              <button
                className="w-[150px] h-[40px] md:h-[35px] text-[15px] font-medium bg-[#253558] hover:bg-[#415288] border hover:border-blue
               dark:border-darkblue water-button md:w-[125px] md:text-sm md:font-normal md:hidden"
              >
                <a
                  href="mailto:contact@mobulalabs.org"
                  className="text-sm md:text-xs"
                >
                  Get in touch
                </a>
              </button>
            </div>
            <div className="w-2/4 md:w-full flex flex-col md:mt-2.5">
              <div
                className={`rounded-lg w-fit h-fit md:h-[170px] ${
                  isHover === 1 ? "scale-105" : "scale-100"
                } transition-all duration-500 ease-in-out`}
              >
                <img src="/landing/supercharged/livestream.png" />
              </div>
            </div>
            <div className="hidden md:flex w-fit h-fit">
              <button
                className="hidden w-[150px] h-[40px] md:h-[35px] text-[15px] font-medium bg-[#253558] hover:bg-[#415288] border hover:border-blue
               dark:border-darkblue water-button md:w-[125px] md:text-sm md:font-normal md:flex md:items-center md:justify-center mt-5"
              >
                <a
                  href="mailto:contact@mobulalabs.org"
                  className="text-sm md:text-xs"
                >
                  Get in touch
                </a>
              </button>
            </div>
          </div>
          <div className="w-full flex justify-between md:flex-col md:justify-start">
            <div
              className=" flex items-center shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border mt-[50px] 
                   border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-[45%] md:mt-5 
                   overflow-hidden  rotating-effect md:w-full"
              ref={mulitRef}
            >
              <div className="w-full flex flex-col">
                <div className={`rounded-lg h-fit md:h-[170px] w-full`}>
                  <img
                    src="/landing/supercharged/chains.png"
                    className="w-full object-cover"
                  />
                </div>
                <div className="mt-8 md:mt-4 p-3 px-8 md:p-5 pb-0">
                  <h2 className="text-light-font-100 dark:text-dark-font-100 tracking-tight font-poppins text-4xl md:text-2xl font-medium ">
                    Multi-chain Data Analytics
                  </h2>
                  <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-7 md:mt-4 text-lg mb-9 md:mb-5 md:text-sm max-w-[500px]">
                    Build data dashboards from any event, transaction, off-chain
                    dataset, on any blockchain.
                  </p>{" "}
                </div>
              </div>
            </div>
            <div
              className=" flex items-center shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border mt-[50px] 
                   border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-[50%]  
                   overflow-hidden p-5 pb-0 rotating-effect md:mt-5 md:w-full md:h-[420px]"
              onMouseEnter={() => setIsHover(2)}
              onMouseLeave={() => setIsHover(0)}
              ref={surcharge}
            >
              <div className="w-full flex flex-col mt-3 md:mt-0 mb-auto">
                <div className="p-3 pb-0 md:p-0 pt-0">
                  <h2 className="text-light-font-100 dark:text-dark-font-100 tracking-tight font-poppins text-4xl md:text-2xl font-medium mt-4 md:mt-0">
                    Open-source Business Intelligence
                  </h2>
                  <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-7 md:mt-4 text-lg mb-9 md:text-sm max-w-[500px]">
                    No more vendor lock-in, own your dashboards & data - extend
                    to any chain, any data source.
                  </p>{" "}
                </div>
                <div className="rounded-lg w-fit md:h-[170px] mx-auto">
                  <img
                    src="/landing/supercharged/subgraph.png"
                    className={`h-[405px] md:h-[auto] -mt-5 transition-all duration-500 ease-in-out ${
                      isHover === 2 ? "scale-105" : "scale-100"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
