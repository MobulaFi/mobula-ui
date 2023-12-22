import React from "react";
import { containerStyle } from "../../style";

export const GetInTouch = () => {
  return (
    <section
      className="w-screen flex justify-center items-center pt-[100px] pb-[200px] snap-center"
      style={{
        background:
          "radial-gradient(at right top, rgba(11, 32, 64, 1.0), #131627 80%, #131627)",
      }}
    >
      <div className={containerStyle}>
        <div className="w-full flex items-center">
          <div className="w-[55%] mr-[30px]">
            <img src="/landing/map.png" alt="world map" className="w-full" />
          </div>
          <div className="w-[45%] pl-5">
            <h2
              id="text"
              style={{
                WebkitTextFillColor: "transparent",
              }}
              className="text-[72px] font-bold font-poppins w-fit text-transparent 
                text-fill-color tracking-[-0.08em] bg-gradient-to-br from-[rgba(0,0,0,0.95)]
                to-[rgba(0,0,0,0.35)] dark:from-[rgba(255,255,255,0.95)]
                 dark:to-[rgba(255,255,255,0.35)] dark:text-transparent bg-clip-text mb-2.5 text-start"
            >
              Get in touch
            </h2>
            <div
              className="rounded-lg shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
            border-light-border-primary dark:border-dark-border-primary flex items-center
             h-[45px] w-full relative mb-5"
            >
              <input
                type="text"
                placeholder="Telegram username"
                className="h-full w-full px-2.5 bg-[#101A32]
                       text-light-font-100 dark:text-dark-font-100 font-poppins "
                style={{
                  background: "transparent",
                }}
              />
            </div>
            <div
              className="rounded-lg shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
            border-light-border-primary dark:border-dark-border-primary flex items-center
             h-[45px] w-full relative mb-5"
            >
              <input
                type="text"
                placeholder="Email"
                className="h-full w-full px-2.5 bg-[#101A32]
                       text-light-font-100 dark:text-dark-font-100 font-poppins "
                style={{
                  background: "transparent",
                }}
              />
            </div>
            <div
              className="rounded-lg shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
            border-light-border-primary dark:border-dark-border-primary flex items-center
             h-[230px] w-full relative"
            >
              <textarea
                placeholder="Describe your query or issue here."
                className="h-full w-full px-2.5 bg-[#101A32]
                       text-light-font-100 dark:text-dark-font-100 font-poppins"
                style={{
                  background: "transparent",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
