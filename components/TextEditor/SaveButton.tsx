import { useHelpers } from "@remirror/react";
import { useState } from "react";

import Button from "@/components/Button";

// <SaveButton> has been abstracted into its own component since
// `useHelpers` can only be called within the context of a <Remirror> component.

const SaveButton = ({
  title,
  onSave,
}: {
  title?: string;
  onSave: (title: string, content: string) => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const { getMarkdown, getText } = useHelpers();

  const handleClick = async () => {
    setLoading(true);
    try {
      // `markdown` includes all formatting, while `text` is just the plain text
      // This is useful for validation, since we don't want to count the markup
      // against their total text length.
      const markdown = getMarkdown();
      const text = getText();

      const trimmedTitle = (title || "").trim();
      const trimmedContent = (text || "").trim();

      const validationErrors = [];

      if (!trimmedTitle) {
        validationErrors.push("Please enter a title for your note");
      } else if (trimmedTitle.length > 100) {
        validationErrors.push(
          "Please enter a title that is less than 100 characters"
        );
      }

      if (trimmedContent.length < 20) {
        validationErrors.push("Please enter some more content for your note");
      } else if (trimmedContent.length > 300) {
        validationErrors.push(
          "Maximum note length is 300 characters, please shorten your note"
        );
      }

      if (validationErrors.length) {
        alert(validationErrors.join("\n"));
      } else {
        await onSave(title as string, markdown);
      }

      setLoading(false);
    } catch (e) {
      alert("There was an unexpected issue saving your note");
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <Button
      className="mt-8 w-full md:w-fit justify-center"
      onClick={handleClick}
      loading={loading}
    >
      {loading ? "Saving..." : "Save note"}
    </Button>
  );
};

export default SaveButton;
