import { BlockchainParams } from "mobula-lite/lib/model";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { BiArrowToRight } from "react-icons/bi";
import { Button } from "../../../../components/button";
import { pushData } from "../../../../lib/mixpanel";
import { addressSlicer } from "../../../../utils/formaters";
import { SearchbarContext } from "../../context-manager";
import { Lines } from "../ui/lines";
import { Title } from "../ui/title";

interface NotListedProps {
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  unknownSC: { name: string; blockchain: BlockchainParams } | null;
  setUnknownSC: React.Dispatch<
    React.SetStateAction<{
      name: string;
      blockchain: BlockchainParams;
    }>
  >;
}

export const NotListed = ({
  setTrigger,
  unknownSC,
  setUnknownSC,
}: NotListedProps) => {
  const router = useRouter();
  const { token, setActive } = useContext(SearchbarContext);

  const clickEvent = () => {
    setTrigger(false);
    pushData("Searchbar", { type: "wallet", name: token });
    router.push(`/wallet/${token}`);
  };

  return (
    <>
      <div className="flex mb-2.5 mt-[5px] items-center">
        <Title extraCss="mt-[5px]">
          {unknownSC?.name} isn&apos;t listed on Mobula.{" "}
        </Title>
        <Button
          extraCss="ml-0 mb-2.5 h-[28px] max-w-fit"
          onClick={() => {
            setTrigger(false);
            pushData("Searchbar", {
              type: "not listed",
              name: unknownSC?.name,
            });
            router.push("/list");
            setUnknownSC(null);
          }}
        >
          List it
        </Button>
      </div>
      <Lines
        onClick={clickEvent}
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
  );
};
