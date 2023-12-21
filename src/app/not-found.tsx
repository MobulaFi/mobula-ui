import React from "react";
import NotFound from "../features/misc/not-found";

export default function NotFoundPage({ error, reset }) {
  console.error(error);
  return <NotFound />;
}
