import React, { useContext } from "react";
import { BsLink45Deg } from "react-icons/bs";
import { FaDiscord, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { Button } from "../../../../../components/button";
import { MediumFont, SmallFont } from "../../../../../components/fonts";
import { ModalContainer } from "../../../../../components/modal-container";
import { BaseAssetContext } from "../../../context-manager";
import { mainButtonStyle } from "../../../style";

export const PopupSocialMobile = () => {
  const { baseAsset, setShowPopupSocialMobile, showPopupSocialMobile } =
    useContext(BaseAssetContext);

  const links = [
    {
      title: "Official Links",
      content:
        baseAsset?.website || baseAsset?.white_paper
          ? [
              {
                title: "Website",
                link: baseAsset?.website,
                icon: (
                  <BsLink45Deg className="text-base text-light-font-100 dark:text-dark-font-100" />
                ),
              },
              {
                title: "Whitepaper",
                link: baseAsset?.white_paper,
                icon: (
                  <HiOutlineDocumentText className="text-sm text-light-font-100 dark:text-dark-font-100" />
                ),
              },
            ]
          : null,
    },
    {
      title: "Social Links",
      content:
        baseAsset?.telegram ||
        baseAsset?.chat ||
        baseAsset?.twitter ||
        baseAsset?.discord
          ? [
              {
                title: "Telegram",
                link: baseAsset?.telegram || baseAsset?.chat,
                icon: (
                  <FaTelegramPlane className="text-telegram dark:text-telegram" />
                ),
              },
              {
                title: "Twitter",
                link: baseAsset?.twitter,
                icon: <FaTwitter className="text-twitter dark:text-twitter" />,
              },
              {
                title: "Discord",
                link: baseAsset?.discord,
                icon: <FaDiscord className="text-discord dark:text-discord" />,
              },
            ]
          : null,
    },
    {
      title: "Audit & KYC",
      content:
        baseAsset?.audit || baseAsset?.kyc
          ? [
              {
                title: "Audit",
                link: baseAsset?.audit,
              },
              {
                title: "KYC",
                link: baseAsset?.kyc,
              },
            ]
          : null,
    },
  ];

  return (
    <>
      <ModalContainer
        extraCss="max-w-[400px]"
        isOpen={showPopupSocialMobile}
        onClose={() => setShowPopupSocialMobile(false)}
        title="Links"
      >
        {links.map((link) => (
          <div
            className={`flex flex-col ${
              link.content !== null ? "flex" : "hidden"
            }`}
            key={link.title}
          >
            <MediumFont extraCss="ml-2.5 text-[15px] text-light-font-100 dark:text-dark-font-100 my-2.5">
              {link.title}
            </MediumFont>
            <div className="flex items-center flex-wrap">
              {link.content?.map((item) => (
                <Button
                  extraCss={`${mainButtonStyle} mb-2.5 ${
                    item.link ? "flex" : "hidden"
                  } w-fit`}
                  key={item.title}
                  onClick={() => window.open(item.link, "_blank")}
                >
                  {item.icon}
                  <SmallFont extraCss="ml-[5px]">{item.title}</SmallFont>
                  <FiExternalLink className="text-light-font-60 dark:text-dark-font-60 ml-[7.5px]" />
                </Button>
              ))}{" "}
            </div>
          </div>
        ))}
      </ModalContainer>
    </>
  );
};
