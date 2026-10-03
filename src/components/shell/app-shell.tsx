"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Header from "./header";

// Public routes jahan Sidebar aur Header NAHI dikhna chahiye
const PUBLIC_ROUTES = [
  "/",
  "/signup",
  "/reset-password",
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Landing page + authentication pages
  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }

    return (
      pathname === route ||
      pathname.startsWith(`${route}/`)
    );
  });

  // Public/Auth pages:
  // NO Sidebar
  // NO Header
  if (isPublicRoute) {
    return (
      <main className="min-h-screen w-full overflow-y-auto bg-[#070A11]">
        {children}
      </main>
    );
  }

  // Dashboard routes:
  // Sidebar + Header visible
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070A11]">
      <Sidebar />

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#070A11] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}