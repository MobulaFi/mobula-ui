import { Editor as MonacoEditor } from "@monaco-editor/react";
import { useEditor } from "../../hooks/use-editor";
import { EditorFooter } from "./footer";

export const Editor = () => {
  const { handleEditorChange, setEditorInstance } = useEditor();
  return (
    <div className="w-calc-full-360 p-2.5 pt-5 pl-0 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary">
      <MonacoEditor
        height="450px"
        defaultLanguage="sql"
        defaultValue=""
        onMount={(editor) => {
          setEditorInstance(editor as never);
        }}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 14,
          cursorStyle: "block",
          wordWrap: "on",
        }}
        onChange={handleEditorChange}
      />
      <EditorFooter />
    </div>
  );
};
