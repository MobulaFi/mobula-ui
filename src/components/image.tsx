import NextImage from "next/legacy/image";
import React, { useState } from "react";

export function NextImageFallback({
  fallbackSrc,
  ...props
}: { fallbackSrc: string } & React.ComponentProps<typeof NextImage>) {
  const [imgSrc, setImgSrc] = useState(props.src);
  return (
    <NextImage
      {...props}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
