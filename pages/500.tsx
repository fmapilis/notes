import Head from "next/head";

import Button from "@/components/Button";

const Custom500 = () => {
  return (
    <div className="text-center">
      <Head>
        <title>500 - Internal Server Error</title>
      </Head>
      <h1 className="font-alt text-5xl mb-6">
        Whoops, something went wrong on our end
      </h1>
      <Button className="text-xl mb-6 m-auto" href="/">
        Go back home
      </Button>
    </div>
  );
};

export default Custom500;
2;
