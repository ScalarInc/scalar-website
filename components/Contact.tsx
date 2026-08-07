"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Reveal from "./ui/Reveal";
import SplitText from "./ui/SplitText";

export default function Contact() {
  const [sent, setSent] = useState(false);

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
                <select
                  id="topic"
                  name="topic"
                  className="border-0 border-b border-ink-950/15 bg-transparent py-3 text-[16px] text-ink-950 outline-none transition-colors focus:border-ink-950"
                >
                  <option>A new product</option>
                  <option>An existing system that&rsquo;s struggling</option>
                  <option>Applied AI / machine learning</option>
                  <option>Security or compliance</option>
                  <option>Joining Scalar</option>
                </select>
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
