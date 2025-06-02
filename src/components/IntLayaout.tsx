import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function IntLayaout({ children }: LayoutProps) {
  return (
    <>
      <div className="flex flex-col items-center bg-neutral-900 min-h-screen w-screen">
        <Header />
        <div className="pt-16">{children}</div>
        <Footer />
      </div>
    </>
  );
}
