import React, { useMemo, useState } from "react";

interface ICommonPageContext {
  isMenuMobile: boolean;
  setIsMenuMobile: React.Dispatch<React.SetStateAction<boolean>>;
  extended: { [entry: string]: boolean };
  setExtended: React.Dispatch<
    React.SetStateAction<{
      [entry: string]: boolean;
    }>
  >;
}

export const CommonPageContext = React.createContext({} as ICommonPageContext);

export const CommonPageProvider = ({ children }) => {
  const [extended, setExtended] = useState<{ [entry: string]: boolean }>({});
  const [isMenuMobile, setIsMenuMobile] = useState(false);

  const value = useMemo(
    () => ({
      isMenuMobile,
      setIsMenuMobile,
      extended,
      setExtended,
    }),
    [isMenuMobile, extended]
  );

  return (
    <CommonPageContext.Provider value={value}>
      {children}
    </CommonPageContext.Provider>
  );
};
