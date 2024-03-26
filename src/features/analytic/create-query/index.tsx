"use client";
import { ExtraLargeFont } from "../../../components/fonts";
import { DataExplorer } from "./components/data-explorer";
import { Editor } from "./components/editor";

export const CreateQueryPage = () => {
  return (
    <div className="w-full max-w-[95%] flex flex-col mx-auto mt-[28px]">
      <ExtraLargeFont>Create SQL Query</ExtraLargeFont>
      <div className="flex mt-5 w-full">
        <DataExplorer />
        <Editor />
      </div>
    </div>
  );
};
