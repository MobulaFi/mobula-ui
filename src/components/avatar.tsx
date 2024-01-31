import { cn } from "lib/shadcn/lib/utils";
import React, { useEffect, useState } from "react";

const imageCache: { [address: string]: string } = {};

interface AddressAvatarProps {
  address: string;
  extraCss?: string;
}

const colorPalette = [
  "#69D2E7",
  "#A7DBD8",
  "#E0E4CC",
  "#F38630",
  "#FA6900",
  "#FF4E50",
  "#F9D423",
  "#EDE574",
  "#F9C80E",
  "#FC6170",
  "#5C2A9D",
  "#365D8D",
  "#9FD356",
  "#F0C808",
  "#FF9000",
];

// Function to get 3 random colors from the palette
function getRandomColors() {
  const shuffled = [...colorPalette].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

async function generateImageFromAddress(address: string): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create canvas context");
  }

  // Set the canvas dimensions
  canvas.width = 256;
  canvas.height = 256;

  const gridSize = Math.ceil(Math.sqrt(address.length));
  const rectSize = Math.floor(Math.min(canvas.width, canvas.height) / gridSize);

  // Get 3 random colors for this address
  const randomColors = getRandomColors();

  // Draw the image using the unique hash and random colors
  for (let i = 0; i < gridSize; i += 1) {
    for (let j = 0; j < gridSize; j += 1) {
      const x = i % canvas.width;
      const y = j % canvas.height;
      const uniqueIndex = i * gridSize + j;

      if (uniqueIndex < address.length) {
        const charIndex = parseInt(address[uniqueIndex], 16); // Convert hex char to int
        const color = randomColors[charIndex % randomColors.length]; // Use modulo to select color
        ctx.fillStyle = color;
        ctx.fillRect(x * rectSize, y * rectSize, rectSize, rectSize);
      }
    }
  }

  return canvas.toDataURL("image/png");
}

async function cachedGenerateImageFromAddress(
  address: string
): Promise<string> {
  if (imageCache[address]) {
    return imageCache[address];
  }

  const dataURI = await generateImageFromAddress(address);
  imageCache[address] = dataURI;
  return dataURI;
}

export const AddressAvatar: React.FC<AddressAvatarProps> = ({
  address,
  extraCss,
}) => {
  const [dataURI, setDataURI] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const imageDataURI = await cachedGenerateImageFromAddress(
          address.slice(2, 38)
        );
        setDataURI(imageDataURI);
      } catch (err) {
        console.error("Error generating image:", err);
      }
    })();
  }, [address]);

  return (
    <img
      src={dataURI || "/empty/unknown.png"}
      alt="user default avatar"
      className={cn(`rounded-full`, extraCss)}
    />
  );
};
