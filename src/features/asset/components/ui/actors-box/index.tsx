import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SmallFont } from "../../../../../components/fonts";
import { boxStyle } from "../../../../user/portfolio/style";
import { Investors } from "../../../models";
import { ActorsPopup } from "../popup-actors";

interface ActorsBoxProps {
  data: Investors[];
  title: string;
}

export const ActorsBox = ({ data, title }: ActorsBoxProps) => {
  const [showActors, setShowActors] = useState(false);
  const router = useRouter();
  return (
    <>
      <div
        className={`${boxStyle} flex border border-light-border-primary dark:border-dark-border-primary
       bg-light-bg-terciary dark:bg-dark-bg-terciary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover items-center
        w-full hover:cursor-pointer transition-all duration-200 mt-[15px] lg:mt-2.5 md:mt-[7.5px]`}
        onClick={() => {
          if (data?.[0].name === "Click here to add some") router.push("/list");
          else setShowActors(true);
        }}
      >
        <img
          className="w-[34px] h-[34px] min-w-[34px] lg:w-[30px] lg:h-[30px] lg:min-w-[30px] md:w-[28px] md:h-[28px] md:min-w-[28px] mr-2.5 rounded-full"
          src={data?.[0]?.image || "/empty/unknown.png"}
          alt={data?.[0]?.name}
        />

        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col mb-1">
              <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 max-w-[120px] text-overlfow-ellipsis whitespace-nowrap">
                {title}
              </SmallFont>
              <SmallFont>{data[0]?.name}</SmallFont>
            </div>
            {data.length > 1 ? (
              <div className="flex items-end flex-col ml-[15px]">
                <div className="flex items-center">
                  {data
                    .filter((_, i) => i !== 0)
                    .map((item, i) => {
                      if (i < 5)
                        return (
                          <img
                            className="bg-light-bg-hover dark:bg-dark-bg-hover border border-light-border-primary
                         dark:border-dark-border-primary h-[20px] w-[20px] rounded-full ml-[-5px]"
                            alt={item.name}
                            src={item.image || "/empty/unknown.png"}
                            key={item.image}
                          />
                        );
                      return null;
                    })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <ActorsPopup
        data={data}
        visible={showActors}
        setVisible={setShowActors}
      />
    </>
  );
};
