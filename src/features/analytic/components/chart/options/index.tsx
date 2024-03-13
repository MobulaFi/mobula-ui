import {
  getFormattedAmount,
  getFormattedDate,
} from "../../../../../utils/formaters";

export const graphic = {
  elements: [
    {
      type: "image",
      style: {
        image: "/mobula/mobula-logo.svg",
        width: 75,
        height: 75,
        opacity: 0.5,
      },
      left: "center",
      top: "center",
    },
  ],
};

export const tooltipHTML = (
  value: number | string,
  title?: string | number,
  color?: string
) => {
  return `
    <div class="flex items-center p-2.5 rounded-lg bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary
       dark:border-dark-border-primary">
        <div class=" text-light-font-100 dark:text-dark-font-100 ">
            <div class="mb-1">${title}</div>
            <div class="flex items-center justify-between font-medium">
                <div class="flex items-center mr-2.5 w-full">
                    <div class="h-[10px] w-[10px] min-w-[10px] rounded-full mr-2.5 " style="background:${color}" />
                </div>
                ${getFormattedAmount(value)}$
            </div> 
        </div>
    </div>`;
};

export const getTooltip = (type: string) => {
  const isPieChart = type === "pie";
  return {
    trigger: isPieChart ? "item" : "axis",
    confine: true,
    padding: 0,
    backgroundColor: "transparent",
    borderColor: "transparent",
    formatter: (params: any) => {
      const value = params?.[0]?.value[1] || params?.value;
      const color = params?.[0]?.color || params?.color;
      const title = params?.name || getFormattedDate(params?.[0]?.value[0]);
      const html = tooltipHTML(value, title, color);
      return html;
    },
  };
};

export const grid = {
  left: "0%",
  right: "0%",
  bottom: "0%",
  top: "5%",
  containLabel: true,
};

export const yAxis = (resolvedTheme: string) => {
  return [
    {
      type: "value",
      axisLabel: {
        formatter(value: number) {
          return getFormattedAmount(value);
        },
        color:
          resolvedTheme === "dark"
            ? "rgba(255,255,255,0.8)"
            : "rgba(0,0,0,0.8)",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.8)",
          borderColor: "red",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.05)",
          width: 1,
        },
      },
    },
  ];
};

export const xAxis = (resolvedTheme: string) => {
  return [
    {
      type: "time",
      axisLabel: {
        color:
          resolvedTheme === "dark"
            ? "rgba(255,255,255,0.8)"
            : "rgba(0,0,0,0.8)",
      },
      axisLine: {
        lineStyle: {
          color:
            resolvedTheme === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.05)",
        },
      },
    },
  ];
};
