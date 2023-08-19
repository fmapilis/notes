import { useHelpers } from "@remirror/react";
import { useRouter } from "next/navigation";
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
  const { getMarkdown } = useHelpers();
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const markdown = getMarkdown();

      if (!title?.trim()) {
        alert("Please enter a title for your note");
        return;
      } else if (!markdown?.trim()) {
        alert("Please enter some content for your note");
        return;
      }
      await onSave(title, markdown);
      setLoading(false);
    } catch (e) {
      alert("There was an unexpected issue saving your note");
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <Button
      className="mt-8 w-full md:w-fit"
      onClick={handleClick}
      loading={loading}
    >
      {loading ? "Saving..." : "Save note"}
    </Button>
  );
};

export default SaveButton;
