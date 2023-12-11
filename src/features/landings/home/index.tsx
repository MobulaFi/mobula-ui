import React from "react";
import { GridBox } from "./components/grid-box";
import { gridBoxContent } from "./constant";

export const HomeLanding = () => {
  const containerStyle = "flex flex-col max-w-[1200px] w-[90%] lg:w-[95%]";

  return (
    <div>
      <section
        className="w-screen flex justify-center items-center"
        style={{ height: "calc(100vh - 65px)" }}
      >
        <div className={containerStyle}>
          <div>
            <h1
              className="text-[96px] font-bold leading-[90px] font-['Poppins'] w-fit mx-auto 
              dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color 
              bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none"
              style={{
                "-webkit-text-fill-color": "transparent",
              }}
            >
              The last web3 data
              <br />
              API you&apos;ll ever need
            </h1>
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
      <section className="h-screen w-screen flex justify-center items-center">
        <div className={containerStyle}>
          <div className="flex">
            <div className="w-2/4">
              <h2
                className="text-[76px] font-bold leading-[75px] font-['Poppins'] w-fit mx-auto 
              dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color 
              bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none"
                style={{
                  "-webkit-text-fill-color": "transparent",
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
              <div
                className="mt-8 shadow-lg flex items-center w-full rounded-xl p-2.5 justify-around border
               border-light-border-secondary dark:border-dark-border-secondary bg-light-bg-secondary
                dark:bg-dark-bg-secondary"
              >
                <p className="text-light-font-100 dark:text-dark-font-100 font-[Poppins] text-xl">
                  Secure
                </p>
                <p className="text-light-font-100 dark:text-dark-font-100 font-[Poppins] text-xl">
                  Accurate
                </p>
                <p className="text-light-font-100 dark:text-dark-font-100 font-[Poppins] text-xl">
                  Transparent
                </p>
              </div>
            </div>
            <div className="w-2/4 flex justify-end">
              <img
                src="/mobula/ecosystem.png"
                alt="ecosystem"
                className="w-[400px] h-[400px] object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="h-screen w-screen flex justify-center items-center">
        <div className={containerStyle}>
          <div className="grid grid-rows-2 grid-flow-col gap-10">
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
    </div>
  );
};
