import React from "react";

interface IInputLines {
  children: string;
  title: string;
  setSettings: any;
  settings?: any;
  isSeconds?: boolean;
  isMobile?: boolean;
}

export const InputLines = ({
  children,
  title,
  setSettings,
  settings,
  isSeconds,
  isMobile,
}: IInputLines) => {
  return (
    <div className="my-2.5 flex items-center justify-between w-full">
      <p className="text-light-font-100 dark:text-dark-font-100 text-sm text-normal">
        {children}
      </p>
      <div
        className={`${
          isMobile ? "mr-2.5" : "mr-0"
        } border border-light-border-primary flex items-center 
           dark:border-dark-border-primary rounded-md h-[30px] md:h-[25px] min-w-[50px] bg-light-bg-terciary dark:bg-dark-bg-terciary`}
      >
        <input
          className="text-light-font-80 dark:text-dark-font-80 text-sm text-normal border-none
           bg-light-bg-secondary dark:bg-dark-bg-secondary w-[50px] h-full pl-2.5 pr-1.5 flex items-center"
          type="number"
          value={settings?.[title]}
          name={title}
          onChange={(e) => {
            setSettings((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }));
          }}
        />
        <p className="text-light-font-100 dark:text-dark-font-100 text-sm pr-2.5">
          {isSeconds ? "sec" : "%"}
        </p>
      </div>
    </div>
  );
};
