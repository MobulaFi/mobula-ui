import Image from "next/legacy/image";
import React, { useState } from "react";

export function NextImageFallback({
  fallbackSrc,
  ...props
}: { fallbackSrc: string } & React.ComponentProps<typeof Image>) {
  const [imgSrc, setImgSrc] = useState(props.src);
  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
