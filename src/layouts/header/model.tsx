export interface Extends {
  name: string;
  url: string;
  description?: string;
  icon?: any;
}

export interface Navigation {
  name: string;
  extends: Extends[];
  url?: string;
}

export interface ICommonPageContext {
  isMenuMobile: boolean;
  setIsMenuMobile: React.Dispatch<React.SetStateAction<boolean>>;
  extended: { [entry: string]: boolean };
  setExtended: React.Dispatch<
    React.SetStateAction<{ [entry: string]: boolean }>
  >;
}
