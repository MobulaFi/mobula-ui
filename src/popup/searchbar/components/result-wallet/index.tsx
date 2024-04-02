import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { BiArrowToRight } from "react-icons/bi";
import { pushData } from "../../../../lib/mixpanel";
import { addressSlicer } from "../../../../utils/formaters";
import { SearchbarContext } from "../../context-manager";
import { NewWalletProps, User } from "../../models";
import { Lines } from "../ui/lines";
import { Title } from "../ui/title";

interface WalletResultProps {
  firstIndex: number;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  callback?: (value: { content: string; type: string; label: string }) => void;
}

export const WalletResult = ({
  firstIndex,
  setTrigger,
  callback,
}: WalletResultProps) => {
  const router = useRouter();
  const { users, results, active, setActive, token } =
    useContext(SearchbarContext);

  const clickEvent = (newWallet: NewWalletProps, wallet: User) => {
    if (callback)
      callback({
        content: newWallet.address,
        type: "wallet",
        label: newWallet.name || addressSlicer(newWallet.address),
      });
    else {
      setTrigger(false);
      // const isUsername =
      //   token &&
      //   !token.includes(".eth") &&
      //   token.toLowerCase() !== wallet.address.toLowerCase();
      pushData("Searchbar", {
        type: "wallet",
        name: newWallet.address,
      });
      router.push(`/wallet/${newWallet.address}`);
    }
  };

  return (
    <div className={`${users.length > 0 ? "mt-[10px]" : "mt-0 hidden"}`}>
      {users.length > 0 && (
        <Title extraCss="mt-[5px]">Wallets ({users.length})</Title>
      )}
      {users.map((wallet, index: number) => {
        const newWallet = {
          ...wallet,
          name: wallet.username,
          logo: wallet.profile_pic || null,
        };
        return (
          <Lines
            key={wallet.name + "-" + index}
            onClick={() =>
              clickEvent(newWallet as NewWalletProps, wallet as User)
            }
            isImage
            token={newWallet as NewWalletProps}
            active={active === index + firstIndex}
            index={index + firstIndex}
            setActive={setActive}
          >
            <BiArrowToRight className="text-light-font-60 dark:text-dark-font-60 text-sm" />
          </Lines>
        );
      })}
    </div>
  );
};
