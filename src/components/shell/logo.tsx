"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="CliniVision Logo"
        width={38}
        height={38}
        className="h-[38px] w-[38px] shrink-0 object-contain"
        priority
      />

      <div className="flex flex-col">
        <span className="text-sm font-bold leading-none tracking-tight text-white">
          Clini<span className="text-[#7DD3FC]">Vision</span>
        </span>

        <span className="mt-1 text-[8px] font-mono uppercase tracking-[0.18em] text-slate-500">
          CLINICAL AI
        </span>
      </div>
    </Link>
  );
}