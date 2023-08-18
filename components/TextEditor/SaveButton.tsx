import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHelpers } from "@remirror/react";

import Button from "@/components/Button";

// <SaveButton> has been abstracted into its own component since
// `useHelpers` can only be called within the context of a <Remirror> component.

const SaveButton = ({ title }: { title?: string }) => {
  const [loading, setLoading] = useState(false);
  const { getMarkdown } = useHelpers();
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);

    const markdown = getMarkdown();

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content: markdown }),
      });
      const data = await response.json();

      setLoading(false);
      router.push(`/notes/${data._id}`);
    } catch (e) {
      // TODO: Handle error
      console.log(e);
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
