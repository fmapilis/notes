import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useCallback } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const handleHomeClick = useCallback(() => {
    if (router.pathname === "/") {
      router.reload();
    }
  }, [router]);

  return (
    <>
      <header className="font-alt bg-green text-white text-center p-4 text-3xl max-h-[var(--header-height)]">
        <Link onClick={handleHomeClick} href="/">
          Notes
        </Link>
      </header>
      <main className="max-w-7xl mx-auto pt-12 px-4 pb-4">{children}</main>
    </>
  );
};

export default Layout;
