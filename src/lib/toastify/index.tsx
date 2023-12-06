import React from "react";
import { toast } from "react-toastify";

export const triggerAlert = (type: string, text: string) => {
  const Msg = () => (
    <div className="flex flex-col items-start text-light-font-100 dark:text-dark-font-100 text-sm">
      <p className="text-base">{type}</p>
      <p className="text-sm text-light-font-60 dark:text-dark-font-60">
        {text}
      </p>
    </div>
  );

  const toastType = {
    Success: () => toast.success(<Msg />),
    Error: () => toast.error(<Msg />),
    Information: () => toast.info(<Msg />),
    Warning: () => toast.warning(<Msg />),
  };

  toastType[type]();
};
