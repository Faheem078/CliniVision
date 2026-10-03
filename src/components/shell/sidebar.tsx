"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Users,
  FileText,
  Bot,
  Settings,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scans", href: "/scans", icon: Activity },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "AI Assistant", href: "/assistant", icon: Bot },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile & Tablet Header Bar (< 1024px) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-[#0B0F17]/90 backdrop-blur-md border-b border-[#1E2638] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-400">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">CliniVision</h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">Clinical Intel</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Toggle Navigation"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-[#111622] border border-[#1E2638] text-slate-200"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Dim Overlay for Mobile & Tablet */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Universal Responsive Sidebar: Slide-out drawer on Mobile/Tablet, Fixed panel on Laptop/Desktop */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-[#1E2638] bg-[#0B0F17] p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Logo (Desktop / Laptop View) */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                <Activity size={22} />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wide">CliniVision</h1>
                <p className="text-[10px] tracking-widest uppercase text-slate-500 font-semibold">Clinical Intelligence</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
                    isActive
                      ? "border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.08)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-cyan-400" : "text-slate-400"} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Status Footnote */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">System Status</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">All Systems Operational</span>
          </div>
        </div>
      </aside>
    </>
  );
}