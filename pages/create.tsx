import { useCallback } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const TextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
});

const CreateNotePage = () => {
  const router = useRouter();

  const handleSaveNote = useCallback(
    async (title: string, markdown: string) => {
      try {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content: markdown }),
        });
        const data = await response.json();
        router.push(`/notes/${data._id}`);
      } catch (e) {
        alert("There was an unexpected issue saving your note");
        console.error(e);
      }
    },
    [router]
  );

  return (
    <div className="h-[calc(100vh-var(--header-height)-4rem)]">
      <Head>
        <title>Create New Note</title>
      </Head>
      <TextEditor onSave={handleSaveNote} />
    </div>
  );
};

CreateNotePage.requireSession = true;

export default CreateNotePage;
