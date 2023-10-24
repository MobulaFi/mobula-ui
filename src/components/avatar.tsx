import { Avatar, AvatarProps } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const imageCache: { [address: string]: string } = {};

interface AddressAvatarProps extends AvatarProps {
  address: string;
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

  // Draw the image using the unique hash
  for (let i = 0; i < gridSize; i += 1) {
    for (let j = 0; j < gridSize; j += 1) {
      const x = i % canvas.width;
      const y = j % canvas.height;
      const uniqueIndex = i * gridSize + j;

      if (uniqueIndex < address.length) {
        const number = parseInt(address.substr(uniqueIndex, 1), 16);
        const hue = 200 + ((number * 15) % 100);

        const color = `hsl(${hue}, 50%, 50%)`;
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
  ...props
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

  return <Avatar src={dataURI} {...props} />;
};
