import { faqs } from "@/lib/faq";

/**
 * Visible counterpart of the FAQPage JSON-LD. Deliberately a server component
 * with no reveal animation: this text has to be readable in the initial HTML
 * and in a non-scrolling render, not only after an IntersectionObserver fires.
 */
export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative bg-ink-950 pb-[clamp(96px,10vw,160px)] pt-[clamp(32px,4vw,64px)] text-paper"
    >
      <div className="shell">
        <div className="grid gap-[clamp(32px,4vw,72px)] lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="eyebrow mb-4 block text-ink-400">FAQ</span>
            <h2
              id="faq-heading"
              className="display text-[clamp(26px,3.4vw,48px)]"
            >
              Questions about
              <br />
              <span className="italic font-serif font-normal normal-case text-[1.08em] tracking-tight text-paper/95">
                Scalar Inc.
              </span>
            </h2>
          </div>

          <div className="grid gap-px self-start bg-ink-800">
            {faqs.map((f) => (
              <article key={f.question} className="bg-ink-950 py-6 first:pt-0">
                <h3 className="font-mono text-[clamp(12.5px,1.15vw,16px)] font-medium uppercase tracking-[0.03em] text-paper">
                  {f.question}
                </h3>
                <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.72] text-ink-300">
                  {f.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
