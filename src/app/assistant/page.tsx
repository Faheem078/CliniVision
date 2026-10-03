"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  Bot,
  CheckCheck,
  Download,
  Mic,
  MoreVertical,
  PanelLeft,
  Paperclip,
  Send,
  Sparkles,
  Trash2,
  Volume2,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface Session {
  id: string;
  title: string;
  context: string;
  timestamp: string;
}

interface LesionCard {
  label: string;
  status: string;
  probabilityPct: number;
  volumeDelta: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  lesionCard?: LesionCard;
}

/* ------------------------------------------------------------------ */
/* Mock session data */
/* ------------------------------------------------------------------ */

const SESSIONS: Session[] = [
  {
    id: "pt8892",
    title: "PT-8892 MRI Analysis",
    context: "PT-8892",
    timestamp: "Today, 09:42 AM",
  },
  {
    id: "aamina",
    title: "Aamina Bibi Report",
    context: "PT-7781",
    timestamp: "Yesterday, 14:15 PM",
  },
  {
    id: "fracture",
    title: "Bone Fracture Consult",
    context: "PT-6542",
    timestamp: "Oct 24, 11:30 AM",
  },
  {
    id: "thoracic",
    title: "Thoracic Screening",
    context: "PT-9981",
    timestamp: "Oct 18, 3:00 PM",
  },
];

/* ------------------------------------------------------------------ */
/* Initial messages */
/* ------------------------------------------------------------------ */

const INITIAL_MESSAGES: Record<string, Message[]> = {
  pt8892: [
    {
      id: "m1",
      role: "user",
      content:
        "Analyze PT-8892's latest MRI. Are there any indications of demyelination? Cross-reference with the scan from 3 months ago.",
    },
    {
      id: "m2",
      role: "ai",
      content:
        "I have analyzed the recent T2-weighted FLAIR MRI for patient PT-8892. There are multiple hyperintense periventricular and juxtacortical white matter lesions present, which align with demyelinating pathology. Compared to the previous scan (dated 3 months prior), there are two new active lesions demonstrating faint contrast enhancement.",
      lesionCard: {
        label: "Lesion Cluster Alpha",
        status: "Active",
        probabilityPct: 85,
        volumeDelta: "+2.4mm³",
      },
    },
  ],

  aamina: [
    {
      id: "m1",
      role: "user",
      content:
        "Summarize the chest X-ray findings for Aamina Bibi and flag anything requiring urgent follow-up.",
    },
    {
      id: "m2",
      role: "ai",
      content:
        "Dense consolidation is present in the right upper lobe, consistent with pneumonia at 94% confidence. Costophrenic angles remain sharp with low probability of pleural effusion. Recommend antibiotic therapy review and a follow-up scan in 7-10 days.",
    },
  ],

  fracture: [
    {
      id: "m1",
      role: "user",
      content:
        "Review the wrist X-ray for a suspected distal radius fracture and estimate displacement.",
    },
    {
      id: "m2",
      role: "ai",
      content:
        "A transverse fracture line is identified at the distal radius metaphysis with approximately 4mm dorsal displacement and mild angulation. No intra-articular extension detected. Recommend orthopedic consult for reduction planning.",
    },
  ],

  thoracic: [
    {
      id: "m1",
      role: "user",
      content:
        "Run a routine screening summary on the latest thoracic series for PT-9981.",
    },
    {
      id: "m2",
      role: "ai",
      content:
        "Lung fields are clear bilaterally with no focal consolidation, nodules, or pleural abnormality. Cardiac silhouette is within normal limits. No acute findings — study classified as normal.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Simulated AI replies */
/* ------------------------------------------------------------------ */

const SIMULATED_REPLIES = [
  "CliniVision analysis complete. Findings have been cross-referenced against previous imaging. No additional critical abnormalities detected. Physician review recommended.",
  "Processing complete. The requested region shows no significant interval change compared to prior studies. Confidence interval remains above 90%.",
  "Analysis finished. One area of moderate concern was flagged for radiologist confirmation — recommend prioritizing this case in the review queue.",
];

/* ------------------------------------------------------------------ */
/* Sessions Panel */
/* ------------------------------------------------------------------ */

function SessionsPanelContent({
  activeSessionId,
  onSelectSession,
  onClose,
}: {
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Sessions
          </h2>

          <span className="mt-3 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            {SESSIONS.length} ACTIVE CONTEXTS
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sessions"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-900 hover:text-slate-200 xl:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mt-6 flex-1 space-y-3 overflow-y-auto pr-1">
        {SESSIONS.map((session) => {
          const isActive = session.id === activeSessionId;

          return (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelectSession(session.id)}
              className={`w-full rounded-2xl border p-4 text-left transition-all ${
                isActive
                  ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_20px_rgba(0,240,255,0.06)]"
                  : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-white">
                  {session.title}
                </span>

                {isActive ? (
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                    }}
                  >
                    <Volume2 className="h-4 w-4 shrink-0 text-cyan-400" />
                  </motion.span>
                ) : (
                  <CheckCheck className="h-4 w-4 shrink-0 text-slate-500" />
                )}
              </div>

              <p className="mt-2 text-xs text-slate-400">
                {session.timestamp}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chat Options */
/* ------------------------------------------------------------------ */

function ChatOptionsMenu({
  onClearHistory,
}: {
  onClearHistory: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleExport = () => {
    setIsOpen(false);
    setToast("Chat exported successfully");

    window.setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const handleClear = () => {
    setIsOpen(false);
    onClearHistory();
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label="Chat options"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.97,
            }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#182030] p-1.5 shadow-2xl"
          >
            <button
              type="button"
              onClick={handleExport}
              className="flex min-h-[40px] w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100"
            >
              <Download className="h-4 w-4" />
              Export Chat
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="flex min-h-[40px] w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 8,
            }}
            className="absolute right-0 top-11 z-50 whitespace-nowrap rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lesion Card */
/* ------------------------------------------------------------------ */

function LesionCardView({
  card,
}: {
  card: LesionCard;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-wide text-white">
          {card.label}
        </span>

        <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-2 py-0.5 text-[11px] font-semibold text-rose-300">
          {card.status.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 flex h-28 items-center justify-center rounded-xl bg-black">
        <Activity className="h-10 w-10 text-cyan-400" />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>Probability Match</span>

        <span className="font-semibold text-cyan-400">
          {card.probabilityPct}%
        </span>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${card.probabilityPct}%`,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="h-full rounded-full bg-cyan-400"
        />
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Volume Change: {card.volumeDelta}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Assistant Page */
/* ------------------------------------------------------------------ */

export default function AssistantPage() {
  const [activeSessionId, setActiveSessionId] =
    useState<string>(SESSIONS[0].id);

  const [messagesBySession, setMessagesBySession] =
    useState<Record<string, Message[]>>(INITIAL_MESSAGES);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSessionsOpen, setIsSessionsOpen] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const scrollRef =
    useRef<HTMLDivElement>(null);

  const activeSession =
    SESSIONS.find(
      (session) =>
        session.id === activeSessionId
    ) ?? SESSIONS[0];

  const activeMessages =
    messagesBySession[activeSessionId] ?? [];

  /* Scroll chat to bottom */
  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth",
    });
  }, [activeMessages, isTyping]);

  /* Append message */
  const appendMessage = (
    sessionId: string,
    message: Message
  ) => {
    setMessagesBySession((previous) => ({
      ...previous,
      [sessionId]: [
        ...(previous[sessionId] ?? []),
        message,
      ],
    }));
  };

  /* Send message */
  const sendMessage = async () => {
    const trimmed = input.trim();

    if (!trimmed || isTyping) return;

    const sessionId = activeSessionId;

    appendMessage(sessionId, {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    });

    setInput("");
    setIsTyping(true);

    await new Promise((resolve) =>
      window.setTimeout(resolve, 1000)
    );

    const reply =
      SIMULATED_REPLIES[
        Math.floor(
          Math.random() * SIMULATED_REPLIES.length
        )
      ];

    appendMessage(sessionId, {
      id: `a-${Date.now()}`,
      role: "ai",
      content: reply,
    });

    setIsTyping(false);
  };

  /* Enter key */
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  /* Session selection */
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setIsSessionsOpen(false);
  };

  /* Clear chat */
  const handleClearHistory = () => {
    setMessagesBySession((previous) => ({
      ...previous,
      [activeSessionId]: [],
    }));
  };

  /* Attachment */
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    appendMessage(activeSessionId, {
      id: `file-${Date.now()}`,
      role: "user",
      content: `📎 Attached: ${file.name}`,
    });

    event.target.value = "";
  };

  /* Mic */
  const handleMicClick = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);

    window.setTimeout(() => {
      setIsListening(false);

      setInput((previous) =>
        previous.length > 0
          ? previous
          : "Show me the ASPECTS score trend for this patient over the last year."
      );
    }, 2500);
  };

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden rounded-2xl border border-[#1E2638] bg-[#06090E] text-slate-200">
      {/* ---------------------------------------------------------- */}
      {/* Sessions panel - Desktop */}
      {/* ---------------------------------------------------------- */}

      <aside className="hidden w-80 shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#111827]/95 p-5 xl:flex">
        <SessionsPanelContent
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
        />
      </aside>

      {/* ---------------------------------------------------------- */}
      {/* Sessions drawer - Mobile / Tablet */}
      {/* ---------------------------------------------------------- */}

      <AnimatePresence>
        {isSessionsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setIsSessionsOpen(false)
              }
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm xl:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 34,
              }}
              className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col overflow-hidden border-r border-white/10 bg-[#111827] p-5 shadow-2xl xl:hidden"
            >
              <SessionsPanelContent
                activeSessionId={activeSessionId}
                onSelectSession={handleSelectSession}
                onClose={() =>
                  setIsSessionsOpen(false)
                }
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------- */}
      {/* Chat area */}
      {/* ---------------------------------------------------------- */}

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Chat header */}

        <header className="flex min-h-[72px] shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setIsSessionsOpen(true)
              }
              aria-label="Open sessions"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-cyan-400 hover:bg-white/5 xl:hidden"
            >
              <PanelLeft className="h-5 w-5" />
            </button>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">
              <BrainCircuit className="h-5 w-5 text-cyan-400" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-white sm:text-base">
                CliniVision Diagnostic Core
              </h1>

              <p className="flex items-center gap-1.5 truncate text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                Neural Engine Online — Sub-millimeter accuracy
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300 sm:inline-flex">
              CONTEXT: {activeSession.context}
            </span>

            <ChatOptionsMenu
              onClearHistory={handleClearHistory}
            />
          </div>
        </header>

        {/* ------------------------------------------------------ */}
        {/* Messages */}
        {/* ------------------------------------------------------ */}

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 space-y-6 overflow-y-auto overflow-x-hidden p-4 sm:p-6"
        >
          {activeMessages.length === 0 && (
            <div className="flex min-h-full flex-col items-center justify-center text-center text-slate-500">
              <Sparkles className="mb-3 h-8 w-8 text-slate-700" />

              <p className="text-sm">
                No messages in this session yet.
              </p>

              <p className="text-xs">
                Ask CliniVision anything about{" "}
                {activeSession.context}.
              </p>
            </div>
          )}

          {activeMessages.length > 0 && (
            <p className="text-center text-xs uppercase tracking-wider text-slate-600">
              Session initiated{" "}
              {activeSession.timestamp}
            </p>
          )}

          {activeMessages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start gap-3"
              }
            >
              {message.role === "ai" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-400">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[90%] rounded-3xl border p-4 sm:max-w-2xl sm:p-5 ${
                  message.role === "user"
                    ? "border-white/10 bg-[#1E293B]"
                    : "border-cyan-400/20 bg-[#111827]"
                }`}
              >
                {message.role === "ai" && (
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-400">
                    <Sparkles className="h-4 w-4" />
                    CliniVision
                  </div>
                )}

                <p className="text-sm leading-relaxed text-slate-200">
                  {message.content}
                </p>

                {message.lesionCard && (
                  <LesionCardView
                    card={message.lesionCard}
                  />
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 pl-1 text-sm text-cyan-400">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <BrainCircuit className="h-4 w-4" />
              </motion.span>

              CliniVision is analyzing DICOM telemetry...
            </div>
          )}
        </div>

        {/* ------------------------------------------------------ */}
        {/* Input dock */}
        {/* ------------------------------------------------------ */}

        <div className="shrink-0 border-t border-white/10 bg-[#06090E] p-4 sm:p-5">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".dcm,.dicom,.nii,.nii.gz,.png,.jpg,.jpeg,.pdf"
            onChange={handleFileSelected}
          />

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#111827] px-3 py-2 sm:gap-3 sm:px-5 sm:py-3">
            <button
              type="button"
              onClick={handleAttachmentClick}
              aria-label="Attach file"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Message CliniVision..."
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
            />

            <button
              type="button"
              onClick={handleMicClick}
              aria-label="Voice input"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                isListening
                  ? "bg-rose-500/20 text-rose-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <motion.span
                animate={
                  isListening
                    ? { scale: [1, 1.15, 1] }
                    : { scale: 1 }
                }
                transition={{
                  duration: 0.9,
                  repeat: isListening
                    ? Infinity
                    : 0,
                }}
              >
                <Mic className="h-5 w-5" />
              </motion.span>
            </button>

            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-black transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-slate-500">
            CliniVision can make mistakes. Always verify findings
            with standard diagnostic protocol.
          </p>
        </div>
      </section>
    </div>
  );
}