export interface OptionsProps {
  chartOptions: {
    data: number[][] | [string, number][];
    colors?: {
      up: string;
      down: string;
    };
    type: string;
    name: string;
  };
}
