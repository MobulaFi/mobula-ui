import { useTheme } from "next-themes";
import React from "react";

interface CryptoFearAndGreedChartProps {
  fearLevel: number;
  fearClassification: string;
}

const CryptoFearAndGreedChart = ({
  fearLevel,
  fearClassification,
}: CryptoFearAndGreedChartProps) => {
  const { theme } = useTheme();
  const radius = 88;
  const centerX = radius;
  const centerY = radius;
  const strokeWidth = 15; // épaisseur des segments
  const innerRadius = radius - strokeWidth; // rayon interne

  const categories = [
    { color: "#0ECB81" },
    { color: "#93D900" },
    { color: "#F3D42F" },
    { color: "#EA8C00" },
    { color: "#EA3943" },
  ];

  const paths = categories.map((category, index) => {
    const startAngle = (index * Math.PI) / 5;
    const endAngle = ((index + 1) * Math.PI) / 5;

    const startXOuter = centerX + radius * Math.cos(startAngle);
    const startYOuter = centerY - radius * Math.sin(startAngle);
    const endXOuter = centerX + radius * Math.cos(endAngle);
    const endYOuter = centerY - radius * Math.sin(endAngle);

    const startXInner = centerX + innerRadius * Math.cos(startAngle);
    const startYInner = centerY - innerRadius * Math.sin(startAngle);
    const endXInner = centerX + innerRadius * Math.cos(endAngle);
    const endYInner = centerY - innerRadius * Math.sin(endAngle);

    let pathData = `
      M ${startXOuter} ${startYOuter}
      A ${radius} ${radius} 0 0 0 ${endXOuter} ${endYOuter}
      L ${endXInner} ${endYInner}
      A ${innerRadius} ${innerRadius} 0 0 1 ${startXInner} ${startYInner}
      Z
    `;
    if (index === 0) {
      // Ajouter un petit arc pour le premier segment
      pathData += `
        L ${startXInner + strokeWidth * Math.cos(startAngle)} ${
        startYInner - strokeWidth * Math.sin(startAngle)
      }
        A ${strokeWidth} ${strokeWidth} 0 0 1 ${startXOuter} ${startYOuter}
      `;
    } else if (index === categories.length - 1) {
      // Ajouter un petit arc pour le dernier segment
      pathData += `
        L ${endXOuter - strokeWidth * Math.cos(endAngle)} ${
        endYOuter + strokeWidth * Math.sin(endAngle)
      }
        A ${strokeWidth} ${strokeWidth} 0 0 1 ${endXInner} ${endYInner}
      `;
    } else {
      pathData += "Z"; // Fermer le chemin pour les autres segments
    }

    return (
      <path
        key={`segment${Math.random()}`}
        d={pathData}
        fill={category.color}
      />
    );
  });

  const determineCirclePosition = () => {
    const categoryIndex = categories.length - 1 - Math.floor(fearLevel / 20);
    const percentageWithinCategory = 1 - (fearLevel % 20) / 20;

    const segmentStartAngle = (categoryIndex * Math.PI) / 5;
    const angleOffsetWithinCategory = (percentageWithinCategory * Math.PI) / 5;

    const circleAngle = segmentStartAngle + angleOffsetWithinCategory;
    const circleX =
      centerX + (radius - 0.5 * strokeWidth) * Math.cos(circleAngle);
    const circleY =
      centerY - (radius - 0.5 * strokeWidth) * Math.sin(circleAngle);

    return { x: circleX, y: circleY };
  };

  const circlePosition = determineCirclePosition();

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 -10 177 110"
      key={Math.random()}
      transform="translate(0, 10)"
    >
      {paths}
      <circle
        cx={circlePosition.x}
        cy={circlePosition.y}
        r="10"
        fill="white"
        stroke="text_primary"
      />
      <text
        x={centerX}
        y={centerY - 20}
        textAnchor="middle"
        fontSize="30"
        fontWeight="bold"
        fill={theme === "light" ? "rgab(0,0,0,0.95)" : "rgba(255,255,255,0.95)"}
      >
        {fearLevel}
      </text>
      <text
        x={centerX}
        y={centerY + 5}
        textAnchor="middle"
        fontSize="14"
        fontWeight="500"
        fill={theme === "light" ? "rgab(0,0,0,0.95)" : "rgba(255,255,255,0.95)"}
      >
        {fearClassification || "Neutral"}
      </text>
    </svg>
  );
};

export default CryptoFearAndGreedChart;
