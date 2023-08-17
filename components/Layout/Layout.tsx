import { ReactNode } from "react";
import Link from "next/link";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header className="font-alt bg-green text-white text-center p-4 text-3xl">
        <Link href="/">Notes</Link>
      </header>
      <main className="max-w-7xl mx-auto px-4 pt-12 pb-20">{children}</main>
    </>
  );
};

export default Layout;
