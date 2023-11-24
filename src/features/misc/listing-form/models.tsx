export interface IListingContext {
  isLaunched: boolean;
  setIsLaunched: React.Dispatch<React.SetStateAction<boolean>>;
  actualPage: number;
  setActualPage: React.Dispatch<React.SetStateAction<number>>;
}
