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
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between border-0 border-b border-ink-950/20 bg-transparent py-3 text-left text-[16px] text-ink-950 outline-none transition-colors hover:border-ink-950 focus:border-ink-950"
        aria-expanded={open}
        aria-haspopup="listbox"
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
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 4, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 z-50 overflow-hidden border border-ink-800 bg-ink-950 py-1.5 shadow-2xl"
          >
            {options.map((opt, i) => {
              const isSelected = opt === value;
              return (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-200 ${
                      isSelected
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

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0]);

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
                      href="mailto:hello@scalar.dev"
                      className="text-[17px] underline decoration-ink-300 underline-offset-[6px] transition-colors hover:decoration-ink-950"
                    >
                      hello@scalar.dev
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="grid gap-6"
            >
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
                    className="border-0 border-b border-ink-950/15 bg-transparent py-3 text-[16px] text-ink-950 outline-none transition-colors focus:border-ink-950"
                  />
                </div>
              ))}

              <div className="group grid gap-2">
                <label
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
                  className="resize-y border-0 border-b border-ink-950/15 bg-transparent py-3 text-[16px] text-ink-950 outline-none transition-colors focus:border-ink-950"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.25 }}
                className="group relative mt-2 inline-flex items-center justify-center gap-3 overflow-hidden bg-ink-950 px-8 py-5 font-mono text-[11px] uppercase tracking-[0.16em] text-paper justify-self-start"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-ink-700 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                <span className="relative">Send enquiry</span>
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

              <p
                className="font-mono text-[11.5px] text-ink-400"
                role="status"
                aria-live="polite"
              >
                {sent
                  ? "Demo form — nothing was sent. Wire this up to your own endpoint."
                  : "This is a static demonstration; the form has no backend yet."}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
