export const withHashtagConversion = (editor) => {
  const { insertText } = editor;

  editor.insertText = (text) => {
    if (text.startsWith("### ")) {
      const withoutHashtag = text.substring(4);
      const newNodes = [
        { type: "heading", level: 3, children: [{ text: withoutHashtag }] },
        { type: "paragraph", children: [{ text: "" }] },
      ];
      return editor.insertFragment(newNodes);
    }
    return insertText(text);
  };

  return editor;
};
