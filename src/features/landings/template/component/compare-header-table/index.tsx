import React from "react";
import { AiFillGift, AiOutlineAreaChart } from "react-icons/ai";
import {
  BsDoorOpenFill,
  BsFillChatDotsFill,
  BsFilterCircleFill,
  BsShieldLockFill,
} from "react-icons/bs";
import { FiActivity } from "react-icons/fi";
import { GiThreeFriends } from "react-icons/gi";
import { MdNotifications, MdNotificationsActive } from "react-icons/md";
import { MediumFont } from "../../../../../components/fonts";

export const CompareHeaderTable = () => {
  const contents = [
    {
      icon: <BsDoorOpenFill className="mr-2.5" />,
      title: "Welcome Message",
    },
    {
      icon: <BsFilterCircleFill className="mr-2.5" />,
      title: "Message filters",
    },
    {
      icon: <BsShieldLockFill className="mr-2.5" />,
      title: "Captcha system",
    },
    {
      icon: <MdNotifications className="mr-2.5" />,
      title: "Buy notifications",
    },
    {
      icon: <BsFillChatDotsFill className="mr-2.5" />,
      title: "Buy custom notifications",
    },
    {
      icon: <MdNotificationsActive className="mr-2.5" />,
      title: "Multi-asset buy notifications",
    },
    {
      icon: <AiOutlineAreaChart className="mr-2.5" />,
      title: "Price charts",
    },
    {
      icon: <AiFillGift className="mr-2.5" />,
      title: "Manual on-chain rewards",
    },
    {
      icon: <FiActivity className="mr-2.5" />,
      title: "Activity leaderboard",
    },
    {
      icon: <GiThreeFriends className="mr-2.5" />,
      title: "Referral system",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-[340px] mr-2.5">
      {contents.map((entry, i) => (
        <div
          className={`flex items-center px-5 md:px-[15px] h-[53px] w-full border
         border-light-bg-primary dark:border-dark-bg-primary ${
           i === 0 ? "" : "border-t-0"
         }
          text-light-font-100 dark:text-dark-font-100`}
        >
          {entry.icon}
          <MediumFont extraCss="font-normal">{entry.title}</MediumFont>
        </div>
      ))}
    </div>
  );
};
