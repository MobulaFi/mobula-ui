import React from "react";
import {
  BsFacebook,
  BsGlobe,
  BsLinkedin,
  BsReddit,
  BsTelegram,
  BsThreeDotsVertical,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import { FaMedium } from "react-icons/fa";
import { SiCrunchbase } from "react-icons/si";
import { SmallFont } from "../../../../../components/fonts";
import { Modal } from "../../../../../components/modal-container";
import { Popover } from "../../../../../components/popover";
import { Investors } from "../../../models";

interface ActorsPopupProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  data: Investors[];
}

export const ActorsPopup = ({
  visible,
  setVisible,
  data,
}: ActorsPopupProps) => {
  const getIconFromType = (type: string) => {
    const socials = {
      CRUNCHBASE: (
        <SiCrunchbase className="mr-[7.5px] w-[18px] h-[18px] md:w-[14px] md:h-[14px] text-[#0C4163] dark:text-[#0C4163]" />
      ),
      TWITTER: (
        <BsTwitter className="mr-[7.5px] w-[18px] h-[18px] md:w-[14px] md:h-[14px] text-twitter dark:text-twitter" />
      ),
      LINKEDIN: (
        <BsLinkedin className="mr-[7.5px] w-[18px] h-[18px] md:w-[14px] md:h-[14px] text-[#0A66C2] dark:text-[#0A66C2]" />
      ),
      WEBSITE: (
        <BsGlobe className="mr-[7.5px] w-[16px] h-[16px] md:w-[12px] md:h-[12px] text-light-font-100 dark:text-dark-font-100" />
      ),
      MEDIUM: (
        <FaMedium className="mr-[7.5px] w-[19px] h-[19px] md:w-[15px] md:h-[15px] text-light-font-100 dark:text-dark-font-100" />
      ),
      YOUTUBE: (
        <BsYoutube className="mr-[7.5px] w-[19px] h-[19px] md:w-[15px] md:h-[15px] text-[#FF0000] dark:text-[#FF0000]" />
      ),
      REDDIT: (
        <BsReddit className="mr-[7.5px] w-[19px] h-[19px] md:w-[15px] md:h-[15px] text-[#ff4500] dark:text-[#ff4500]" />
      ),
      FACEBOOK: (
        <BsFacebook className="mr-[7.5px] w-[19px] h-[19px] md:w-[15px] md:h-[15px] text-[#3b5998] dark:text-[#3b5998]" />
      ),
      TELEGRAM_ANN: (
        <BsTelegram className="mr-[7.5px] w-[19px] h-[19px] md:w-[15px] md:h-[15px] text-telegram dark:text-telegram" />
      ),
      TELEGRAM_CHAT: (
        <BsTelegram className="mr-[7.5px] w-[19px] h-[19px] md:w-[15px] md:h-[15px] text-telegram dark:text-telegram" />
      ),
    };
    return socials[type] || null;
  };

  return (
    <Modal
      extraCss="max-w-[500px] min-h-fit"
      title="Core Actors"
      isOpen={visible}
      onClose={() => setVisible((prev) => !prev)}
    >
      <div className="flex flex-col h-fit w-full max-h-[445px] md:max-h-[440px] overflow-y-scroll">
        {data.map((item) => (
          <div
            className="flex items-center mb-[15px] justify-between"
            key={item.name}
          >
            <div className="flex items-center">
              <div className="flex relative">
                <img
                  className="w-[38px] h-[38px] min-w-[38px] md:w-[32px] md:h-[32px] md:min-w-[32px] rounded-full mr-2.5 shadow-md"
                  src={item.image}
                  alt={`${item.name} logo`}
                />
                {item.country?.flag ? (
                  <img
                    src={item.country.flag}
                    alt={`${item.name} flag`}
                    className="w-[15px] h-[15px] min-w-[15px] md:w-[12px] md:h-[12px] md:min-w-[12px] rounded-full absolute -bottom-[3px] right-2"
                  />
                ) : null}
              </div>
              <div className="flex flex-col">
                <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 mb-0.5 font-medium">
                  {item.type}
                </SmallFont>
                <SmallFont extraCss="font-medium">{item.name}</SmallFont>
              </div>
            </div>
            {item?.links?.length > 0 ? (
              <Popover
                visibleContent={
                  <BsThreeDotsVertical className="text-light-font-100 dark:text-dark-font-100 text-lg" />
                }
                position="end"
                hiddenContent={item.links?.map((link, i) => (
                  <div
                    className={`flex flex-col bg-light-bg-secondary dark:bg-dark-bg-secondary
                       transition-all duration-200 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover 
                       text-sm lg:text-[13px] md:text-xs text-light-font-100 dark:text-dark-font-100 ${
                         i !== 0 ? "mt-2.5" : ""
                       }`}
                    key={link.link}
                    onClick={() => window.open(link.link, "_blank")}
                  >
                    <div className="flex items-center">
                      {getIconFromType(link.type)}{" "}
                      {link.type.toLowerCase().slice(0, 1).toUpperCase() +
                        link.type.toLowerCase().slice(1)}
                    </div>
                  </div>
                ))}
              />
            ) : null}
          </div>
        ))}
      </div>
    </Modal>
  );
};
