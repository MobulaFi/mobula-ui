import React, { useContext } from "react";
import { BsCheckLg } from "react-icons/bs";
import { SwapContext } from "../..";
import { LargeFont } from "../../../../components/fonts";
import { ModalContainer } from "../../../../components/modal-container";
import { InputLines } from "./lines";

interface SettingsProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
}

export const Settings = ({ setVisible, visible }: SettingsProps) => {
  const { settings, setSettings } = useContext(SwapContext);
  return (
    <ModalContainer
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
            dark:bg-dark-bg-terciary rounded w-[15px] h-[15px] min-w-[15px] border border-light-border-primary dark:border-dark-border-primary"
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
      <LargeFont extraCss="mb-[10px] mr-[10px]">Gwei Settings</LargeFont>
    </ModalContainer>
  );
};
