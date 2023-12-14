import Image from "next/image";
import React, { useState } from "react";

export function NextImageFallback({
  fallbackSrc,
  ...props
}: { fallbackSrc: string } & React.ComponentProps<typeof Image>) {
  const [imgSrc, setImgSrc] = useState(props.src);
  return (
    <Image
      unoptimized
      {...props}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
