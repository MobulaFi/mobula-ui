import React from "react";

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
          </div>
        </div>
      </section>
      <section className="h-screen w-screen dark:bg-dark-font-10 flex justify-center items-center">
        <div className={containerStyle}>
          <h1>Section 2</h1>
        </div>
      </section>
      <section className="h-screen w-screen dark:bg-dark-font-40 flex justify-center items-center">
        <div className={containerStyle}>
          <h1>Section 3</h1>
        </div>
      </section>
    </div>
  );
};
