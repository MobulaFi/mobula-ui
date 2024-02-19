import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

function ThemedImage({ ...props }) {
  const { resolvedTheme } = useTheme();
  let src;

  switch (resolvedTheme) {
    case "light":
      src = "/mobula/mobula-logo-light.svg";
      break;
    case "dark":
      src = "/mobula/mobula-logo.svg";
      break;
    default:
      src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      break;
  }

  return <Image alt="Mobula logo" src={src} {...props} />;
}

export default ThemedImage;
