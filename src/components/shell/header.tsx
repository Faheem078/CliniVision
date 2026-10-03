"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Check,
  ChevronDown,
  ClipboardList,
  FileText,
  LogOut,
  ScanLine,
  Search,
  Settings,
  ShieldAlert,
  X,
} from "lucide-react";

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "scan" | "alert" | "report";
  read: boolean;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "New CT Scan Uploaded",
    description: "A new CT study is available for review.",
    time: "2 min ago",
    type: "scan",
    read: false,
  },
  {
    id: 2,
    title: "High Priority Pathology Alert",
    description: "Fracture detected with high clinical priority.",
    time: "8 min ago",
    type: "alert",
    read: false,
  },
  {
    id: 3,
    title: "Report Ready for Review",
    description: "AI-generated report is ready for radiologist review.",
    time: "24 min ago",
    type: "report",
    read: true,
  },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle outside clicks and keyboard ESC dismiss
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsNotificationOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotificationOpen(false);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const markNotificationRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = useCallback(() => {
    setIsProfileOpen(false);
    setIsNotificationOpen(false);

    try {
      const authKeys = [
        "profile",
        "auth",
        "authToken",
        "token",
        "user",
        "session",
        "accessToken",
        "refreshToken",
      ];
      authKeys.forEach((key) => {
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
      });
    } catch (error) {
      console.warn("Error clearing session storage:", error);
    }

    router.push("/signup");
  }, [router]);

  const renderNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "scan":
        return <ScanLine className="h-4 w-4 text-cyan-400" />;
      case "alert":
        return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      default:
        return <FileText className="h-4 w-4 text-violet-400" />;
    }
  };

  const getBadgeStyle = (type: NotificationItem["type"]) => {
    switch (type) {
      case "scan":
        return "border-cyan-400/20 bg-cyan-500/10";
      case "alert":
        return "border-rose-400/20 bg-rose-500/10";
      default:
        return "border-violet-400/20 bg-violet-500/10";
    }
  };

  return (
    <header
      ref={headerRef}
      className="relative z-50 flex h-[70px] w-full shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#070A11]/95 px-4 backdrop-blur-xl sm:px-6"
    >
      {/* Left / Search Form */}
      <div className="min-w-0 flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="hidden sm:block">
          <div className="relative flex h-11 w-full items-center rounded-full border border-slate-800 bg-[#0B121E]/80 px-4 transition-colors focus-within:border-cyan-500/50">
            <Search className="mr-3 h-4 w-4 shrink-0 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient or scan ID..."
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
              aria-label="Search patient or scan ID"
            />
          </div>
        </form>

        <div className="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-[#0B121E]">
          <ClipboardList className="h-4 w-4 text-cyan-400" />
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="ml-4 flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Live System Indicator */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-500/[0.04] px-3 py-1.5 lg:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            System Online
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleNotifications}
            aria-haspopup="true"
            aria-expanded={isNotificationOpen}
            aria-label={`Notifications (${unreadCount} unread)`}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              isNotificationOpen
                ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-400"
                : "border-transparent text-slate-400 hover:border-slate-800 hover:bg-[#0B121E] hover:text-white"
            }`}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]" />
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <section
              aria-label="Notifications Panel"
              className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-32px)] max-w-[380px] overflow-hidden rounded-xl border border-slate-800 bg-[#0B121E]/95 shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="rounded px-2 py-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsNotificationOpen(false)}
                    aria-label="Close notifications"
                    className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No notifications right now
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markNotificationRead(n.id)}
                      className={`group flex w-full gap-3 p-3.5 text-left transition hover:bg-slate-800/40 ${
                        n.read ? "opacity-75" : "bg-cyan-500/[0.03]"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${getBadgeStyle(
                          n.type
                        )}`}
                      >
                        {renderNotificationIcon(n.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-400">
                          {n.description}
                        </p>
                        <span className="mt-1 block text-[10px] text-slate-500">
                          {n.time}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="border-t border-slate-800/80 bg-[#070A11]/60 p-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationOpen(false);
                    router.push("/reports");
                  }}
                  className="w-full rounded-lg border border-slate-800 bg-[#0B121E] py-2 text-center text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/30"
                >
                  View All Alerts
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="hidden h-7 w-px bg-slate-800 sm:block" />

        {/* Profile Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleProfile}
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
            aria-label="User account menu"
            className={`flex items-center gap-2.5 rounded-xl p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              isProfileOpen ? "bg-[#0B121E]" : "hover:bg-[#0B121E]"
            }`}
          >
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-500/10">
              <span className="text-xs font-bold text-cyan-300">
                RM
              </span>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#070A11] bg-emerald-400" />
            </div>

            <div className="hidden text-left md:block">
              <p className="max-w-[130px] truncate text-xs font-bold text-slate-200">
                RAMUS
              </p>
              <p className="max-w-[130px] truncate text-[10px] font-medium text-cyan-400 uppercase tracking-wider">
                Head Radiologist
              </p>
            </div>

            <ChevronDown
              className={`hidden h-3.5 w-3.5 text-slate-500 transition-transform sm:block ${
                isProfileOpen ? "rotate-180 text-cyan-400" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-800 bg-[#0B121E]/95 shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3 border-b border-slate-800/80 p-3.5">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-500/10">
                  <span className="text-sm font-bold text-cyan-300">
                    RM
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white">
                    RAMUS
                  </p>
                  <p className="truncate text-[10px] font-medium text-cyan-400 uppercase tracking-wider">
                    Head Radiologist
                  </p>
                </div>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Profile & Settings</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>

              <div className="border-t border-slate-800/80 bg-[#070A11]/60 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[10px] font-medium text-slate-400">
                    Secure Session Verified
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}