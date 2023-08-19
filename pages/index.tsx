import { signIn, useSession } from "next-auth/react";

import Button from "@/components/Button";

const HomePage = () => {
  const { data: session } = useSession();
  return (
    <div>
      {!session ? (
        <div className="text-center">
          <p className="font-alt text-5xl mb-6">Looking for your notes?</p>
          <p className="text-xl mb-6">You&apos;ll need to sign in first</p>
          <Button className="mx-auto" onClick={() => signIn()}>
            Sign in
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center">
            <p className="font-alt text-5xl mb-6">
              Welcome back, {session.user?.name}
            </p>
            <Button className="mx-auto" href="/create">
              Create a new note
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
