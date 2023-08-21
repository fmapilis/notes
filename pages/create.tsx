import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

const TextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
});

const CreateNotePage = () => {
  useSession({ required: true });

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

        if (data.error) {
          throw new Error(data.error);
        }

        router.push(`/notes/${data.insertedId}`);
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

export default CreateNotePage;
