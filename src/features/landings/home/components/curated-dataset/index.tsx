import React, { useEffect, useRef, useState } from "react";
import { curatedDatasets } from "../../constant";
import { useHomeLanding } from "../../context-manager";
import { containerStyle } from "../../style";
import { blurEffectAnimation } from "../../utils";
import { CuratedBox } from "../curated-box";

export const CuratedDataset = () => {
  const { activeDataset, setActiveDataset } = useHomeLanding();
  const [datasetHover, setDatasetHover] = useState<number>(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    blurEffectAnimation(container);
  }, []);
  return (
    <section
      className="w-screen flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center py-[100px] md:py-[50px]"
      style={{
        backgroundImage: `radial-gradient(at right top, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
      }}
    >
      <div className={containerStyle}>
        <div>
          <div className="h-fit w-fit overflow-hidden mx-auto">
            <h2
              id="text"
              style={{
                WebkitTextFillColor: "transparent",
              }}
              className="text-[72px] font-bold leading-[75px] md:text-[56px] md:leading-[56px] font-poppins w-fit mx-auto text-transparent 
                text-fill-color tracking-[-0.08em] bg-gradient-to-br from-[rgba(0,0,0,0.95)]
                to-[rgba(0,0,0,0.35)] dark:from-[rgba(255,255,255,0.95)]
                 dark:to-[rgba(255,255,255,0.35)] dark:text-transparent bg-clip-text md:text-center"
            >
              Curated datasets
            </h2>
          </div>
          <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-6 text-xl text-center md:text-center md:text-base md:max-w-[95%] md:mx-auto">
            A new way of using subgraphs, livestreamed, multi-chain & enriched
          </p>
          <div className="max-w-[900px] mx-auto">
            <div className="flex items-center mt-[50px] md:mt-6 w-full justify-around">
              {curatedDatasets.map((dataset) => (
                <button
                  key={dataset.id}
                  className={`${
                    datasetHover === dataset.id ||
                    activeDataset.id === dataset.id
                      ? "opacity-100"
                      : "opacity-40"
                  } flex flex-col items-center justify-start h-[130px] w-[33.33%] md:h-fit transition-all duration-300 ease-in-out`}
                  onMouseEnter={() => setDatasetHover(dataset.id)}
                  onMouseLeave={() => setDatasetHover(0)}
                  onClick={() => setActiveDataset(dataset)}
                >
                  <img
                    className="w-[40px] h-[40px] md:w-[30px] md:h-[30px] rounded-full"
                    src={dataset.image}
                    alt={`${dataset.title} logo`}
                  />
                  <p className="text-light-font-100 dark:text-dark-font-100 font-poppins tracking-tight mt-3 md:mt-2 text-4xl text-center font-medium md:text-lg">
                    {dataset.title}
                  </p>
                  <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-3 md:mt-1 text-xl text-center md:text-sm">
                    {dataset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className="h-[2px] w-full bg-light-font-10 dark:bg-dark-font-10 mt-[40px] md:mt-5">
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
          <div className="flex w-full md:flex-col justify-between mt-[100px] md:mt-10">
            <div className="flex flex-col max-w-[650px] md:max-w-auto">
              <h2
                className="text-[64px] font-bold leading-[65px] md:text-[32px] md:leading-[36px] font-poppins w-fit  
              dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color 
              bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none md:ml-2.5"
                style={{
                  WebkitTextFillColor: "transparent",
                  ...{ "--text-wrap": "balance" },
                }}
              >
                Serverless SQL for
                <br />
                the frontend cloud
              </h2>
              <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-10 md:mt-4 text-xl md:text-base md:ml-2.5">
                Mobula prioritizes privacy by employing{" "}
                <span className="text-light-font-100 dark:text-dark-font-100">
                  decentralized servers
                </span>
                , ensuring that user data is not stored at all. This approach
                guarantees that sensitive
              </p>
              <div className="w-full my-[50px] md:my-[30px] flex items-center">
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
                <p className="text-light-font-60 dark:text-dark-font-60 font-poppins text-base mt-4 md:text-sm md:mt-3">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Quos, odit deleniti? Explicabo laborum eveniet facere,
                  asperiores repellendus, sed voluptatum dolorem illo soluta
                  consectetur laudantium quos libero optio maxime consequatur
                  commodi.
                </p>
              </div>
            </div>
            <div className="flex flex-col max-w-[450px] md:max-w-full justify-between">
              {activeDataset.contents.map((content, i) => (
                <CuratedBox key={i} content={content} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
