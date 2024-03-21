export interface OptionsProps {
  chartOptions: selectedOptionProps;
}

export interface selectedOptionProps {
  data: (string | number)[][];
  type: string;
  width: string;
  id: number;
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
  selectedOption: selectedOptionProps;
  setSelectedOption: React.Dispatch<React.SetStateAction<selectedOptionProps>>;
  views: selectedOptionProps[];
  setViews: React.Dispatch<React.SetStateAction<selectedOptionProps[]>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
