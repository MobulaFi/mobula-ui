"use client";

import { CodeiumEditor, Document, Language } from "@codeium/react-code-editor";
import React, { useState } from "react";
import { default as ChartAnalytic } from "./components/chart";
import { fakeData } from "./constants";

export const Analytic = () => {
  const [activeLanguage, setActiveLanguage] = useState("javascript");

  const changeLanguage = (language: string) => {
    setActiveLanguage(language);
  };

  const html = `<html>
    <body>
      <h1>Contact Us</h1>
      <form>
        <label>Name:</label>
        <input id="name" type="text" />
        <label>Email:</label>
        <input id="email" type="text" />
      </form>
    </body>
  </html>`;

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-4xl">Analytics</h1>
      <div>
        <p className="text-center mt-5">
          Here's an AI-powered Python editor using Codeium.
        </p>
        <div className="flex items-center justify-center mt-5">
          <button
            className="px-2.5 mx-1.5 py-1 rounded bg-dark-font-40"
            onClick={() => changeLanguage("javascript")}
          >
            JavaScript
          </button>
          <button
            className="px-2.5 mx-1.5 py-1 rounded bg-dark-font-40"
            onClick={() => changeLanguage("python")}
          >
            Python
          </button>
          <button
            className="px-2.5 mx-1.5 py-1 rounded bg-dark-font-40"
            onClick={() => changeLanguage("html")}
          >
            HTML
          </button>
        </div>
        <div className="flex w-[800px] mt-5">
          <CodeiumEditor
            language={activeLanguage}
            theme="vs-dark"
            otherDocuments={[
              new Document({
                absolutePath: "/app/index.html",
                relativePath: "index.html",
                text: html,
                editorLanguage: "html",
                language: Language.HTML,
              }),
            ]}
          />
        </div>
      </div>
      <div className="max-w-[800px] w-full mx-auto mt-10">
        <ChartAnalytic
          chartOptions={{
            data: fakeData,
            type: "line",
            name: "Profit",
            colors: {
              up: "#00C087",
              down: "#FF3B30",
            },
          }}
        />
        <div className="my-5 h-[20px]" />
        <ChartAnalytic
          chartOptions={{
            data: fakeData,
            type: "area-large",
            name: "Profit",
          }}
        />
        <div className="my-5 h-[20px]" />
        <ChartAnalytic
          chartOptions={{
            data: fakeData,
            type: "bar",
            name: "Profit",
            colors: {
              up: "orange",
              down: "orange",
            },
          }}
        />
        <div className="my-5 h-[20px]" />
        <ChartAnalytic
          chartOptions={{
            data: [
              ["Testing", 40],
              ["Testing 2", 60],
              ["Testing 3", 20],
              ["Testing 4", 80],
            ],
            type: "pie",
            name: "Profit",
          }}
        />
      </div>
    </div>
  );
};
