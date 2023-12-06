import React from "react";
import { toast } from "react-toastify";

export const triggerAlert = (type: string, text: string) => {
  const Msg = () => (
    <div className="flex flex-col items-start text-light-font-100 dark:text-dark-font-100 text-sm font-bold pr-2.5">
      <p className="text-[15px]">{type}</p>
      <p className="text-sm text-light-font-60 dark:text-dark-font-60 font-medium ml-[-24px] mt-1.5">
        {text}
      </p>
    </div>
  );

  const progressBar = {
    progressStyle: { position: "absolute", top: 0, height: "4px" },
  };

  const toastType = {
    Success: () => toast.success(<Msg />, progressBar as never),
    Error: () => toast.error(<Msg />, progressBar as never),
    Information: () => toast.info(<Msg />, progressBar as never),
    Warning: () => toast.warning(<Msg />, progressBar as never),
  };

  toastType[type]();
};
