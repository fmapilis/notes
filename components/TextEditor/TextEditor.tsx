import { ChangeEvent, useCallback, useState } from "react";
import {
  BoldExtension,
  ItalicExtension,
  UnderlineExtension,
  HeadingExtension,
  HistoryExtension,
  MarkdownExtension,
} from "remirror/extensions";
import { EditorComponent, Remirror, useRemirror } from "@remirror/react";

import EditorToolbar from "./EditorToolbar";
import SaveButton from "./SaveButton";

const TextEditor = ({
  onSave,
}: {
  onSave: (title: string, content: string) => Promise<void>;
}) => {
  const [title, setTitle] = useState("");
  const { manager, state } = useRemirror({
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
        <div className="h-[calc(100%-169px)] grow md:px-8 md:py-8 md:shadow-sm md:border md:border-sage md:rounded-xl">
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

            .remirror-editor h1 {
              font-size: 2rem;
              font-weight: 900;
              margin-bottom: 1.25rem;
              font-family: var(--font-family-alt);
              border-bottom: solid 1px var(--color-sage);
            }

            .remirror-editor h2 {
              font-size: 1.5rem;
              font-family: var(--font-family-alt);
              margin-bottom: 0.5rem;
            }
          `}
        </style>
      </Remirror>
    </>
  );
};

export default TextEditor;
