import type { Metadata } from "next";
import Sidebar from "@/components/shell/sidebar";
import { ProfileProvider } from "@/context/ProfileContext"; // check context file path
import "./globals.css";

export const metadata: Metadata = {
  title: "CliniVision — AI Chest X-Ray Clinical Intelligence",
  description: "AI-assisted pneumonia screening system and clinical decision support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0F17] text-slate-100 antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
        <ProfileProvider>
          <div className="min-h-screen flex">
            <Sidebar />
            <div className="w-full lg:pl-64 flex flex-col min-h-screen">
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-12">
                {children}
              </main>
            </div>
          </div>
        </ProfileProvider>
      </body>
    </html>
  );
}