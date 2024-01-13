import React from "react";

import PageChart from "../../lib/trading-view/component";
function Home() {
  return (
    <>
      <head>
        <title>Trading View Chart </title>
        <meta name="description" content="trading view chart" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <PageChart />
    </>
  );
}

export default Home;
