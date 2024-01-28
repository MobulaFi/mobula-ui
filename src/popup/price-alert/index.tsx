import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { Button } from "../../components/button";
import { SmallFont } from "../../components/fonts";
import { Input } from "../../components/input";
import { Modal } from "../../components/modal-container";
import { PopupUpdateContext } from "../../contexts/popup";
import { UserContext } from "../../contexts/user";
import { BaseAssetContext } from "../../features/asset/context-manager";
import { TableAsset } from "../../interfaces/assets";
import { pushData } from "../../lib/mixpanel";
import { GET } from "../../utils/fetch";
import { getFormattedAmount, getTokenPercentage } from "../../utils/formaters";
import { PopupTelegram } from "../telegram-connect";

interface PriceAlertPopupProps {
  show: boolean | string;
  setShow: Dispatch<SetStateAction<boolean | string>>;
  asset?: TableAsset;
}

export const PriceAlertPopup = ({
  show,
  setShow,
  asset,
}: PriceAlertPopupProps) => {
  const { user } = useContext(UserContext);
  const [showSignTG, setShowSignTG] = useState(false);
  const { setConnect, setShowAlert } = useContext(PopupUpdateContext);
  const { baseAsset: token } = useContext(BaseAssetContext);
  const targetRef = useRef<HTMLInputElement>(null);
  const [isOnlyOnTargetPrice, setIsOnlyOnTargetPrice] = useState(true);
  const [targetPrice, setTargetPrice] = useState(
    getFormattedAmount(asset?.price || token?.price)
  );

  const percentageFromActualPrice = () =>
    getTokenPercentage(
      ((Number(targetPrice) - ((asset?.price as number) || token.price)) /
        ((asset?.price as number) || token.price)) *
        100
    );

  const handleSubmit = () => {
    if (!user) {
      setConnect(true);
      return;
    }

    GET("/user/alert", {
      asset: asset?.id || token.id,
      target: targetPrice as number,
      user: user.id,
      initial_value: asset?.price || token.price,
      account: user.address,
    });

    if (!isOnlyOnTargetPrice) {
      const targetMinusFive =
        (Number(targetPrice) - Number(targetPrice)) * 0.05 +
        Number(targetPrice);

      GET("/user/alert", {
        asset: asset?.id || token.id,
        target: targetMinusFive,
        user: user.id,
        account: user.address,
        initial_value: asset?.price || token.price,
      });
    }
    setShowAlert("");
    setShow(false);
  };

  return (
    <Modal
      title={
        showSignTG
          ? "Connect your telegram to receive notification!"
          : `Get a price alert for ${asset?.name || token.name}`
      }
      extraCss="max-w-[480px]"
      isOpen={show as boolean}
      onClose={() => {
        setShowAlert("");
        setShow(false);
      }}
    >
      {showSignTG ? (
        <PopupTelegram
          showPopup={showSignTG}
          setShowPopup={setShowSignTG}
          contentOnly
          hideTitle
        />
      ) : (
        <>
          <SmallFont extraCss="mb-2.5">Target Price</SmallFont>
          <Input
            placeholder={`$${targetPrice}`}
            type="number"
            ref={targetRef}
            onChange={(e) => setTargetPrice(Number(e.target.value))}
          />
          <SmallFont extraCss="mt-[15px] w-[80%] md:w-full text-light-font-60 dark:text-dark-font-100">
            {asset?.name || token.name} current price is{" "}
            <span className="font-medium text-light-font-100 dark:text-dark-font-100">
              ${getFormattedAmount(asset?.price || token.price)} USD.
            </span>{" "}
            <br />
            Your alert is {percentageFromActualPrice()}%{" "}
            {percentageFromActualPrice() > "0" ? "up" : "down"} from{" "}
            {asset?.name || token.name} price.
          </SmallFont>
          <div className="flex items-center flex-nowrap lg:flex-wrap">
            <Button
              extraCss="mr-[7.5px] mt-2.5"
              onClick={() => setIsOnlyOnTargetPrice(true)}
            >
              <BsCheckLg className="text-xs mr-[7.5px] text-blue" />
              Alert at Target Price
            </Button>
            <Button
              extraCss="mt-2.5"
              onClick={() => setIsOnlyOnTargetPrice((prev) => !prev)}
            >
              {!isOnlyOnTargetPrice ? (
                <BsCheckLg className="text-xs mr-[7.5px] text-blue" />
              ) : null}
              Also alert 5% before target
            </Button>{" "}
          </div>
          <Button
            extraCss="border border-blue mt-5 md:mt-[15px] sm:mt-2.5 text-normal"
            onClick={() => {
              pushData("Notification Asset", {
                "Asset Name": asset?.name || token.name,
                "Asset ID": asset?.id || token.id,
              });
              if (user?.telegram_id) handleSubmit();
              else setShowSignTG(true);
            }}
          >
            Submit
          </Button>
        </>
      )}
    </Modal>
  );
};
