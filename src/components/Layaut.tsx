// components/Layout.tsx

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";
import { UserDetailProvider } from "../context/UserDetailContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE}>
      <UserDetailProvider>
        <div className="bg-neutral-900 min-h-screen w-screen">{children}</div>
      </UserDetailProvider>
    </GoogleOAuthProvider>
  );
}
