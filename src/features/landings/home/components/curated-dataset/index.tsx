import { useEffect, useRef, useState } from "react";
import { curatedDatasets } from "../../constant";
import { useHomeLanding } from "../../context-manager";
import { containerStyle } from "../../style";
import { blurEffectAnimation } from "../../utils";
import { CuratedBox } from "../curated-box";
import { Title } from "../ui/title";

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
      className="w-full flex justify-center items-center bg-no-repeat bg-cover bg-center relative snap-center py-[150px] lg:py-[50px]"
      style={{
        backgroundImage: `radial-gradient(at right top, rgba(11, 32, 64, 1.0), #131627 80%, #131627)`,
      }}
    >
      <div className={containerStyle}>
        <div>
          <Title title="Curated datasets" extraCss="md:text-center" />
          <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-4 text-xl text-center lg:text-center lg:text-base lg:max-w-[95%] lg:mx-auto">
            Build apps & analytics with curated blockchain & crypto data
          </p>
          <div className="max-w-[900px] mx-auto">
            <div className="flex items-center mt-[50px] lg:mt-6 w-full justify-around">
              {curatedDatasets.map((dataset) => (
                <button
                  key={dataset.id}
                  className={`${
                    datasetHover === dataset.id ||
                    activeDataset.id === dataset.id
                      ? "opacity-100"
                      : "opacity-40"
                  } flex flex-col items-center justify-start h-[130px] w-[33.33%] lg:h-fit transition-all duration-300 ease-in-out`}
                  onMouseEnter={() => setDatasetHover(dataset.id)}
                  onMouseLeave={() => setDatasetHover(0)}
                  onClick={() => setActiveDataset(dataset)}
                >
                  <img
                    className="w-[40px] h-[40px] lg:w-[30px] lg:h-[30px] rounded-full"
                    src={dataset.image}
                    alt={`${dataset.title} logo`}
                  />
                  <p className="text-light-font-100 dark:text-dark-font-100 font-poppins tracking-tight mt-3 lg:mt-2 text-4xl text-center font-medium lg:text-lg">
                    {dataset.title}
                  </p>
                  <p className="text-light-font-60 dark:text-dark-font-60 font-poppins mt-3 lg:mt-1 text-xl text-center lg:text-sm">
                    {dataset.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className="h-[2px] w-full bg-light-font-10 dark:bg-dark-font-10 mt-[40px] lg:mt-5">
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
          <div className="flex w-full lg:flex-col justify-between mt-[100px] lg:mt-10 items-center">
            <div className="flex flex-col max-w-[650px] lg:max-w-full">
              <h2
                className="text-[58px] font-bold leading-[70px] lg:text-[32px] lg:leading-[44px] font-poppins w-fit  
              dark:text-transparent tracking-tighter bg-clip-text text-transparent text-fill-color 
              bg-gradient-to-br from-[rgba(255,255,255,0.95)] to-[rgba(255,255,255,0.35)] pointer-events-none lg:ml-2.5"
                style={{
                  WebkitTextFillColor: "transparent",
                  ...{ "--text-wrap": "balance" },
                }}
              >
                {activeDataset.headline}
              </h2>
              {activeDataset.description ? (
                <p className="text-light-font-60 dark:text-dark-font-60 font-[Poppins] mt-10 lg:mt-4 text-xl lg:text-base lg:ml-2.5">
                  {activeDataset.description}
                </p>
              ) : null}
              <div className="w-full my-[50px] lg:my-[30px] flex items-center">
                <div className="border-[2px] border-light-font-10 dark:border-dark-font-10 h-[8px] w-[8px] rotate-[45deg]" />
                <div className="bg-light-font-10 dark:bg-dark-font-10 h-[2px] w-full mx-2" />
                <div className="border-[2px] border-light-font-10 dark:border-dark-font-10 h-[8px] w-[8px] rotate-[45deg]" />
              </div>
              <div
                className="p-8 lg:p-5 rounded-2xl shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
                   border-light-border-primary dark:border-dark-border-primary mouse-cursor-gradient-tracking w-full"
                ref={containerRef}
              >
                <div className="flex items-center">
                  <div
                    className="p-1 flex items-center justify-center shadow-xl bg-hover backdrop-blur-md border
                   border-light-border-primary dark:border-dark-border-primary rounded-lg"
                  >
                    {activeDataset.contents[3].icon}
                  </div>
                  <p className="text-light-font-100 dark:text-dark-font-100 font-poppins text-xl ml-2.5">
                    {activeDataset.contents[3].title}
                  </p>
                </div>
                <p className="text-light-font-60 dark:text-dark-font-60 font-poppins text-base mt-4 lg:text-sm lg:mt-3">
                  {activeDataset.contents[3].description}
                </p>
              </div>
            </div>
            <div className="flex flex-col max-w-[450px] lg:max-w-full justify-between ml-5 lg:ml-0">
              {activeDataset.contents.slice(0, 3).map((content, i) => (
                <CuratedBox key={i} content={content} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
