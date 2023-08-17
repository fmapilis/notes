import Head from "next/head";
import Button from "@/components/Button";

const Custom404 = () => {
  return (
    <div className="text-center">
      <Head>
        <title>404 - Not Found</title>
      </Head>
      <h1 className="font-alt text-5xl mb-6">
        Looks like we couldn&apos;t find what you were looking for
      </h1>
      <Button className="text-xl mb-6 m-auto" href="/">
        Go back home
      </Button>
    </div>
  );
};

export default Custom404;
