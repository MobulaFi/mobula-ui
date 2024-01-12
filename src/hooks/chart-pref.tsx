import { useEffect, useState } from "react";

const useChartState = () => {
  const [chartPreference, setChartPreference] = useState("");

  useEffect(() => {
    const storedChartPreference = localStorage.getItem("chartPreference");
    if (storedChartPreference) {
      setChartPreference(storedChartPreference);
    }
  }, []);

  const changeChart = (newChartType) => {
    setChartPreference(newChartType);
    localStorage.setItem("chartPreference", newChartType);
  };

  return { chartPreference, changeChart };
};

export default useChartState;
