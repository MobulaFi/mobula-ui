import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import { ImageTool } from "./class";

export const TextEditor = () => {
  const editor = new EditorJS({
    /**
     * Id of Element that should contain Editor instance
     */
    holder: "editorjs",
    tools: {
      header: Header,
      list: List,
      imageTool: ImageTool,
    },
  });

  return (
    <div className="bg-dark-bg-hover w-[800px] h-[500px" id="editorjs">
      <h1 className="text-red">Text Editor</h1>
    </div>
  );
};
