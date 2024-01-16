import React, { useContext } from "react";
import { BsCheckLg } from "react-icons/bs";
import { useFeeData, useNetwork } from "wagmi";
import { SwapContext } from "../..";
import { LargeFont, SmallFont } from "../../../../components/fonts";
import { Modal } from "../../../../components/modal-container";
import { floors } from "../../constants";
import { cleanNumber } from "../../utils";
import { InputLines } from "./lines";

interface SettingsProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
}

export const Settings = ({ setVisible, visible }: SettingsProps) => {
  const { settings, setSettings, chainNeeded } = useContext(SwapContext);
  const { chain } = useNetwork();
  const { data: gasData } = useFeeData({
    chainId: chainNeeded || chain?.id || 1,
  });
  return (
    <Modal
      isOpen={visible}
      title="Settings"
      onClose={() => setVisible(false)}
      extraCss="max-w-[420px]"
    >
      <InputLines
        settings={settings}
        title="slippage"
        setSettings={setSettings}
      >
        Slippage
      </InputLines>
      <div className="my-2.5 flex items-center justify-between w-full">
        <p className="text-light-font-100 dark:text-dark-font-100 text-sm text-normal">
          Auto-Tax
        </p>
        <button
          onClick={() =>
            setSettings((prev) => ({
              ...prev,
              ["autoTax"]: !settings?.["autoTax"],
            }))
          }
        >
          <div
            className="flex items-center justify-center p-[1px] bg-light-bg-terciary
            dark:bg-dark-bg-terciary rounded-md w-[15px] h-[15px] min-w-[15px] border border-light-border-primary dark:border-dark-border-primary"
          >
            <BsCheckLg
              className={`text-[11px] text-light-font-80 dark:text-dark-font-80 transition-all ${
                settings?.["autoTax"] ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </button>
      </div>
      <InputLines
        settings={settings}
        title="maxAutoTax"
        setSettings={setSettings}
      >
        Max Auto-Tax
      </InputLines>{" "}
      <div className="h-[1px] my-3 bg-light-border-primary dark:bg-dark-border-primary  w-full" />
      <LargeFont extraCss="mb-[10px] mr-[10px]">Advanced Settings</LargeFont>
      <InputLines
        settings={settings}
        title="routeRefresh"
        setSettings={setSettings}
        isSeconds
      >
        Route Refresh Time
      </InputLines>
      <div className="h-[1px] my-3 bg-light-border-primary dark:bg-dark-border-primary  w-full" />
      <div className="flex items-center justify-between w-full mb-[10px]">
        <LargeFont extraCss="mr-[10px]">Gas Price</LargeFont>
        <SmallFont extraCss="ml-2.5">
          Current:{" "}
          <span className="transition-all text-light-font-100 dark:text-dark-font-100 font-medium">
            {`${(
              cleanNumber(gasData?.gasPrice, 9) * settings.gasPriceRatio
            ).toFixed(2)} Gwei`}
          </span>
        </SmallFont>
      </div>
      <div className="flex flex-col">
        {floors.map((floor) => (
          <div
            className="flex mx-auto mb-[15px] w-full items-center justify-between"
            key={floor.ratio}
          >
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  gasPriceRatio: floor.ratio,
                })
              }
            >
              <div className="flex items-center">
                <div
                  className="flex items-center justify-center p-[1px] bg-light-bg-terciary mr-2 
            dark:bg-dark-bg-terciary rounded-md w-[15px] h-[15px] min-w-[15px] border border-light-border-primary dark:border-dark-border-primary"
                >
                  <BsCheckLg
                    className={`text-[11px] text-light-font-80 dark:text-dark-font-80 transition-all ${
                      floor.ratio === settings.gasPriceRatio
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </div>
                <SmallFont>{floor.title}</SmallFont>
              </div>
            </button>
            <p className="text-sm md:text-xs text-light-font-60 dark:text-dark-font-60">
              {`${(cleanNumber(gasData?.gasPrice, 9) * floor.ratio).toFixed(
                2
              )} Gwei`}
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
};
