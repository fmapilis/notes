import Head from "next/head";
import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
});

const CreateNotePage = () => {
  return (
    <div className="h-[calc(100vh-var(--header-height)-4rem)]">
      <Head>
        <title>Create New Note</title>
      </Head>
      <TextEditor />
    </div>
  );
};

CreateNotePage.requireSession = true;

export default CreateNotePage;
