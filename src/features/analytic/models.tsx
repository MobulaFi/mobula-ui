export interface OptionsProps {
  chartOptions: {
    data: number[][] | [string, number][];
    colors?: {
      up: string;
      down: string;
    };
    type: string;
    name: string;
    width: string;
    title: string;
    description: string;
  };
}

export interface selectedOptionProps {
  data: number[][] | [string, number][];
  colors?: {
    up: string;
    down: string;
  };
  type: string;
  name: string;
  width: string;
  title: string;
  description: string;
}

export interface AnalyticsContextProps {
  selectedOption: selectedOptionProps;
  setSelectedOption: React.Dispatch<React.SetStateAction<selectedOptionProps>>;
  views: selectedOptionProps[];
  setViews: React.Dispatch<React.SetStateAction<selectedOptionProps[]>>;
}
