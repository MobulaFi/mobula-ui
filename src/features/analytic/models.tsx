export interface OptionsProps {
  chartOptions: selectedQueryProps;
}

export interface selectedQueryProps {
  data: (string | number)[][];
  type: string;
  width: number;
  id: number;
  query: string;
  colors?: {
    up: string;
    down: string;
  };
  infos: {
    title: string;
    subtitle: string;
    description: string;
    text: string;
    amount: number;
    symbol: string;
  };
}

export interface AnalyticsContextProps {
  selectedQuery: selectedQueryProps;
  setSelectedQuery: React.Dispatch<React.SetStateAction<selectedQueryProps>>;
  views: selectedQueryProps[];
  setViews: React.Dispatch<React.SetStateAction<selectedQueryProps[]>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
