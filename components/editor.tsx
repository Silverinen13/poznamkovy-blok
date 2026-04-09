"use client";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/shadcn/style.css";

interface EditorProps {
  initialContent?: string;
  onChange: (json: string) => void;
}

export default function Editor({ initialContent, onChange }: EditorProps) {

  const getInitialBlocks = () => {
    if (!initialContent) return undefined;

    try {
      return JSON.parse(initialContent);
    } catch (e) {
      return [
        {
          type: "paragraph",
          content: [{ type: "text", text: initialContent, styles: {} }],
        },
      ];
    }
  };

  const editor = useCreateBlockNote({
    initialContent: getInitialBlocks(),
  });

  return (
    <div className="min-h-full">
      <BlockNoteView
        editor={editor}
        onChange={() => {
          onChange(JSON.stringify(editor.document));
        }}
        theme="light"
      />
    </div>
  );
}