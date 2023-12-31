import { EditorComponent, Remirror, useRemirror } from "@remirror/react";
import { ChangeEvent, useCallback, useState } from "react";
import {
  BoldExtension,
  HeadingExtension,
  HistoryExtension,
  ItalicExtension,
  MarkdownExtension,
  UnderlineExtension,
} from "remirror/extensions";

import EditorToolbar from "./EditorToolbar";
import SaveButton from "./SaveButton";

const TextEditor = ({
  initialContent = "",
  initialTitle = "",
  onSave,
}: {
  initialContent?: string;
  initialTitle?: string;
  onSave: (title: string, content: string) => Promise<void>;
}) => {
  const [title, setTitle] = useState(initialTitle);
  const { manager, state } = useRemirror({
    content: initialContent,
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new UnderlineExtension(),
      new HeadingExtension(),
      new HistoryExtension(),
      new MarkdownExtension(),
    ],
    stringHandler: "markdown",
  });

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    [setTitle]
  );

  return (
    <>
      <input
        className="font-alt text-5xl mb-6 w-full overflow-x-auto border-b border-sage"
        placeholder="Untitled Note"
        value={title}
        onChange={handleTitleChange}
      />
      <Remirror
        manager={manager}
        initialContent={state}
        placeholder="Write something about today"
      >
        <div className="h-[calc(100%-169px)] grow md:px-8 md:py-8 md:shadow-sm md:border md:border-sage md:rounded-xl prose">
          <EditorToolbar />
          <EditorComponent />
        </div>
        <SaveButton title={title} onSave={onSave} />
        <style jsx global>
          {`
            .remirror-editor-wrapper {
              margin-top: 16px;
              height: calc(100% - 46px);
            }

            .remirror-editor {
              padding: 16px;
              border: solid 1px var(--color-sage);
              overflow-y: auto;
              resize: none;
              height: 100%;
            }
          `}
        </style>
      </Remirror>
    </>
  );
};

export default TextEditor;
