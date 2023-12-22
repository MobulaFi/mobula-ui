import React, { useEffect, useRef } from "react";
import { BiCopy } from "react-icons/bi";
import { containerStyle } from "../../style";
import { blurEffectAnimation } from "../../utils";

export const Playground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleWidth = titleRef.current?.offsetWidth;
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
            Mobula Playground
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
        <div className="flex items-center justify-between">
          <div
            className="p-5 rounded-2xl shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
              border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking flex flex-col w-[48%]"
            ref={containerRef}
          >
            <div className="flex justify-between items-center">
              <button className="water-button h-[35px] w-[30%] border border-light-border-primary dark:border-dark-border-primary">
                Market Data
              </button>
              <button className="water-button h-[35px] w-[30%] text-sm border border-light-border-primary dark:border-dark-border-primary">
                Wallet Data
              </button>
              <button className="water-button h-[35px] w-[30%] text-sm border border-light-border-primary dark:border-dark-border-primary">
                Meta Data
              </button>
            </div>
            <p className="text-base text-light-font-80 dark:text-dark-font-80 font-['Poppins'] mt-6 mb-2.5">
              asset string <span className="text-red dark:text-red">*</span>
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
            <p className="text-base text-light-font-80 dark:text-dark-font-80 font-['Poppins'] mt-5 mb-2.5">
              blockchain string{" "}
              <span className="text-red dark:text-red">*</span>
            </p>
            <div
              className="rounded-lg shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
            border-light-border-primary dark:border-dark-border-primary flex items-center
             h-[38px] w-full relative"
            >
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
          <div
            className="shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
                    border-light-border-primary dark:border-dark-border-primary flex items-center
                     relative flex-col h-fit min-h-[270px] max-h-[270px] w-[48%] mouse-cursor-gradient-tracking"
            ref={codeRef}
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
  );
};
