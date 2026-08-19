"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "./ui/Reveal";
import SplitText from "./ui/SplitText";

const TOPICS = [
  "A new product",
  "An existing system that's struggling",
  "Applied AI / machine learning",
  "Security or compliance",
  "Joining Scalar",
];

function CustomSelect({
  id,
  name,
  options,
  value,
  onChange,
}: {
  id: string;
  name: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <input type="hidden" id={id} name={name} value={value} />
      <button
        type="button"
        id={`${id}-button`}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between border-0 border-b border-ink-950/20 bg-transparent py-3 text-left text-[16px] text-ink-950 outline-none transition-colors hover:border-ink-950 focus:border-ink-950"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-labelledby={`topic-label ${id}-button`}
      >
        <span className="font-medium text-ink-950">{value}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="h-4 w-4 text-ink-700"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={`${id}-listbox`}
            role="listbox"
            aria-labelledby="topic-label"
            initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 4, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 z-50 overflow-hidden border border-ink-800 bg-ink-950 py-1.5 shadow-2xl"
          >
            {options.map((opt, i) => {
              const isSelected = opt === value;
              return (
                <li key={opt} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-200 ${isSelected
                        ? "bg-ink-850 font-medium text-paper"
                        : "text-ink-300 hover:bg-ink-900 hover:text-paper"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-ink-500">
                        0{i + 1}
                      </span>
                      <span className="text-[14.5px]">{opt}</span>
                    </div>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-paper" />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState(TOPICS[0]);

  // Time-to-submit is one of the two bot signals the API checks. A human cannot
  // fill this form in under a couple of seconds.
  const mountedAt = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    // Read the form before any await — currentTarget is nulled once the
    // synchronous part of the event handler returns.
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      org: String(data.get("org") ?? ""),
      topic,
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
      elapsed_ms: Date.now() - mountedAt.current,
    };

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      setError(
        res.status === 422
          ? "Something there didn't look right. Check the email address, and make sure the message is at least a few words."
          : res.status === 429
            ? "That's several enquiries in quick succession. Give it a few minutes and try again."
            : "We couldn't send that just now. Please try again, or email info@scalar-ai.co directly."
      );
      setStatus("error");
    } catch {
      setError(
        "Couldn't reach the server. Check your connection and try again, or email info@scalar-ai.co directly."
      );
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="lip relative z-[2] -mt-8 bg-paper py-[clamp(64px,8vw,128px)] text-ink-950"
    >
      <div className="shell">
        <div className="grid gap-[clamp(36px,5vw,88px)] lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal>
              <span className="eyebrow mb-5 block text-ink-400">Contact</span>
            </Reveal>
            <SplitText
              as="h2"
              text="Got something complicated?"
              className="display block text-[clamp(32px,4.8vw,68px)]"
              stagger={0.05}
            />
            <Reveal delay={0.2}>
              <p className="mt-7 max-w-[42ch] text-[15px] leading-[1.7] text-ink-500">
                Tell us what&rsquo;s breaking, what&rsquo;s slow, or what you
                can&rsquo;t get a straight answer on. We&rsquo;ll tell you
                honestly whether we&rsquo;re the right people for it.
              </p>
            </Reveal>

            <Reveal delay={0.28}>
              <dl className="mt-10 grid gap-6">
                <div>
                  <dt className="eyebrow mb-1.5 text-ink-400">Enquiries</dt>
                  <dd>
                    <a
                      href="mailto:info@scalar-ai.co"
                      className="text-[17px] underline decoration-ink-300 underline-offset-[6px] transition-colors hover:decoration-ink-950"
                    >
                      info@scalar-ai.co
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow mb-1.5 text-ink-400">LinkedIn</dt>
                  <dd>
                    <a
                      href="https://www.linkedin.com/company/scalarinc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[17px] underline decoration-ink-300 underline-offset-[6px] transition-colors hover:decoration-ink-950"
                    >
                      linkedin.com/company/scalarinc
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow mb-1.5 text-ink-400">Studio</dt>
                  <dd className="text-[15px] text-ink-500">
                    Remote-first, building across five tracks
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.16} y={36}>
            <AnimatePresence mode="wait" initial={false}>
              {status === "success" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  // Dark slab rather than an outline box: the section alternates
                  // dark and light everywhere else, so a solid panel reads as a
                  // deliberate state change rather than an empty frame.
                  className="grain relative overflow-hidden bg-ink-950 p-[clamp(28px,3.4vw,52px)] text-paper"
                >
                  {/* above the grain overlay */}
                  <div className="relative z-[2]">
                    <div className="mb-9 flex items-center gap-4">
                      <motion.span
                        className="grid h-12 w-12 flex-none place-items-center rounded-full border border-paper/25"
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="square"
                          aria-hidden="true"
                        >
                          <motion.path
                            d="M4 12.5l5.5 5.5L20 7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                          />
                        </svg>
                      </motion.span>
                      <span className="eyebrow text-ink-300">Enquiry received</span>
                    </div>

                    <h3 className="display mb-4 text-[clamp(26px,3vw,42px)]">
                      Message
                      <br />
                      <span className="italic font-serif font-normal normal-case text-[1.08em] tracking-tight">
                        received.
                      </span>
                    </h3>

                    <p className="max-w-[44ch] text-[15px] leading-[1.72] text-ink-300">
                      Thanks for getting in touch. Someone will read it properly
                      and come back to you &mdash; usually within a couple of
                      working days.
                    </p>

                    <div className="hairline my-9" />

                    <motion.button
                      type="button"
                      onClick={() => {
                        mountedAt.current = Date.now();
                        setStatus("idle");
                      }}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      transition={{ duration: 0.25 }}
                      className="group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-paper px-8 py-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-950"
                    >
                      <span className="absolute inset-0 origin-left scale-x-0 bg-ink-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                      <span className="relative">Send another</span>
                      <svg
                        className="relative h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-6"
                >
                  {/* Honeypot. Positioned off-screen rather than display:none,
                      which some bots specifically check for. Hidden from
                      keyboard, autofill and assistive tech alike. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-9999px] h-px w-px overflow-hidden opacity-0"
                  >
                    <label htmlFor="website">Leave this field empty</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      defaultValue=""
                    />
                  </div>

                  {[
                    { id: "name", label: "Name", type: "text", auto: "name" },
                    { id: "email", label: "Email", type: "email", auto: "email" },
                    {
                      id: "org",
                      label: "Organisation",
                      type: "text",
                      auto: "organization",
                    },
                  ].map((f) => (
                    <div key={f.id} className="group grid gap-2">
                      <label
                        htmlFor={f.id}
                        className="eyebrow text-ink-400 transition-colors group-focus-within:text-ink-950"
                      >
                        {f.label}
                      </label>
                      <input
                        id={f.id}
                        name={f.id}
                        type={f.type}
                        autoComplete={f.auto}
                        required={f.id !== "org"}
                        maxLength={f.id === "org" ? 120 : 100}
                        disabled={status === "submitting"}
                        className="border-0 border-b border-ink-950/15 bg-transparent py-3 text-[16px] text-ink-950 outline-none transition-colors focus:border-ink-950 disabled:opacity-50"
                      />
                    </div>
                  ))}

                  <div className="group grid gap-2">
                    <label
                      id="topic-label"
                      htmlFor="topic"
                      className="eyebrow text-ink-400 transition-colors group-focus-within:text-ink-950"
                    >
                      What&rsquo;s this about?
                    </label>
                    <CustomSelect
                      id="topic"
                      name="topic"
                      options={TOPICS}
                      value={topic}
                      onChange={setTopic}
                    />
                  </div>

                  <div className="group grid gap-2">
                    <label
                      htmlFor="message"
                      className="eyebrow text-ink-400 transition-colors group-focus-within:text-ink-950"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      minLength={10}
                      maxLength={5000}
                      disabled={status === "submitting"}
                      className="resize-y border-0 border-b border-ink-950/15 bg-transparent py-3 text-[16px] text-ink-950 outline-none transition-colors focus:border-ink-950 disabled:opacity-50"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    whileHover={status === "submitting" ? undefined : { scale: 1.015 }}
                    whileTap={status === "submitting" ? undefined : { scale: 0.985 }}
                    transition={{ duration: 0.25 }}
                    className="group relative mt-2 inline-flex items-center justify-center gap-3 overflow-hidden bg-ink-950 px-8 py-5 font-mono text-[11px] uppercase tracking-[0.16em] text-paper justify-self-start disabled:cursor-wait disabled:opacity-70"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-ink-700 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-disabled:scale-x-0" />
                    <span className="relative">
                      {status === "submitting" ? "Sending" : "Send enquiry"}
                    </span>
                    {status === "submitting" ? (
                      <motion.span
                        className="relative h-3.5 w-3.5 rounded-full border border-paper/30 border-t-paper"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        aria-hidden="true"
                      />
                    ) : (
                      <svg
                        className="relative h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </motion.button>

                  <p
                    className={`font-mono text-[11.5px] ${status === "error" ? "text-ink-950" : "text-ink-400"
                      }`}
                    role="status"
                    aria-live="polite"
                  >
                    {status === "error"
                      ? error
                      : status === "submitting"
                        ? "Sending your enquiry…"
                        : "We read every message. No newsletter, no follow-up sequence."}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
