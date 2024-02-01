import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { BiArrowToRight } from "react-icons/bi";
import { pushData } from "../../../../lib/mixpanel";
import { addressSlicer } from "../../../../utils/formaters";
import { SearchbarContext } from "../../context-manager";
import { Lines } from "../ui/lines";
import { Title } from "../ui/title";

interface UnknownResultProps {
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  isUnknownUser: boolean;
  callback?: (value: { content: string; type: string; label: string }) => void;
}

export const UnknownResult = ({
  setTrigger,
  isUnknownUser,
  callback,
}: UnknownResultProps) => {
  const router = useRouter();
  const { token, setActive } = useContext(SearchbarContext);

  const clickEvent = () => {
    if (callback)
      callback({
        content: token,
        type: "wallet",
        label: addressSlicer(token),
      });
    else {
      setTrigger(false);
      pushData("Searchbar", { type: "wallet", name: token });
      router.push(`/wallet/${token}`);
    }
  };
  return (
    isUnknownUser && (
      <>
        <Title extraCss="mt-[5px]">Unknown Wallet</Title>
        <Lines
          onClick={clickEvent}
          isLottie
          token={{
            name: addressSlicer(token),
          }}
          index={0}
          setActive={setActive}
          active
        >
          <BiArrowToRight className="text-light-font-60 dark:text-dark-font-60 text-sm" />
        </Lines>
      </>
    )
  );
};
