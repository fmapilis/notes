import { ReactNode } from "react";
import { useSession, signIn } from "next-auth/react";
import Button from "@/components/Button";

const Auth = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();

  if (session) {
    return children;
  }

  return (
    <div className="text-center">
      <p className="font-alt text-5xl mb-6">
        Looks like you don&apos;t have access to this page
      </p>
      <p className="text-xl mb-6">You&apos;ll need to sign in first</p>
      <Button className="mx-auto" onClick={() => signIn()}>
        Sign in
      </Button>
    </div>
  );
};

export default Auth;
