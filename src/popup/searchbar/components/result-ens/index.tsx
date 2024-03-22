import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { MdPersonSearch } from "react-icons/md";
import { pushData } from "../../../../lib/mixpanel";
import { addressSlicer } from "../../../../utils/formaters";
import { SearchbarContext } from "../../context-manager";
import { Lines } from "../ui/lines";
import { Title } from "../ui/title";

interface EnsResultsProps {
  firstIndex: number;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  callback?: (value: { content: string; type: string; label: string }) => void;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

export const EnsResults = ({
  firstIndex,
  setTrigger,
  callback,
  setToken,
}: EnsResultsProps) => {
  const { active, setActive, ens, setEns } = useContext(SearchbarContext);
  const router = useRouter();
  const ensName = {
    name: ens.name,
    symbol: addressSlicer(ens.address as string),
    url: `/wallet/${ens.address}`,
    logo: "https://cryptologos.cc/logos/ethereum-name-service-ens-logo.png",
  };

  const clickEvent = () => {
    if (callback)
      callback({
        content: ensName.url.split("/")[2],
        type: "wallet",
        label: ensName.name,
      });
    else {
      pushData("Searchbar", { type: "ENS", name: ensName.name });
      router.push(ensName.url);
      setTrigger(false);
    }
    setToken("");
    setEns({ name: "", address: "" || null });
  };

  return ens.address ? (
    <>
      <Title extraCss="mt-[5px]">ENS (1)</Title>
      <Lines
        isImage
        token={ensName}
        key={ens.address}
        active={active === firstIndex}
        index={firstIndex}
        setActive={setActive}
        onClick={clickEvent}
      >
        <MdPersonSearch className="text-light-font-60 dark:text-dark-font-60 text-sm" />
      </Lines>
    </>
  ) : null;
};
