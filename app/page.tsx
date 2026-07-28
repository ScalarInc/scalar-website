"use client";

import { useEffect, useState } from "react";

const patternData = {
  Screens: ["Checkout", "Settings", "Login", "Subscription & Paywall", "Home", "Account Setup", "Welcome", "Wallet"],
  "UI Elements": ["Slider", "Carousel", "Sidebar", "Bottom Sheet", "Icon", "Toast", "Progress Indicator", "Dialog"],
  Flows: ["Adding & Creating", "Adding to Cart", "Listening to Audio", "Searching", "Browsing Home", "Starting & Completing", "Onboarding", "Chatting"],
  "Text in Screenshots": ["Follow", "Recommend", "Explore", "Refund", "Payment", "Cashback", "Category", "Show All"],
};

const testimonials = [
  ["Maya Chen", "Form", "Scalar is the first place I look when I need to understand how great products solve a familiar problem."],
  ["Jon Bell", "Northstar", "The detail is exceptional. It turns hours of scattered research into a few focused minutes."],
  ["Alicia Torres", "Frame", "A genuinely indispensable library for anyone designing digital products with care."],
  ["Omar Malik", "Foundry", "Scalar keeps our team grounded in real-world patterns without narrowing our imagination."],
  ["Theo Martin", "Craft", "It is one of those tabs you never close. Organized, current, and remarkably useful."],
  ["Rina Sato", "Arcade", "The fastest way to study a journey, compare approaches, and move from inspiration to execution."],
];

function ScalarMark({ light = false }: { light?: boolean }) {
  return (
    <span className={`scalar-mark ${light ? "light" : ""}`} aria-label="Scalar">
      <i />
      <i />
      <i />
    </span>
  );
}

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export default function Home() {
  const [activePattern, setActivePattern] = useState<keyof typeof patternData>("Screens");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = document.querySelectorAll(
      ".section-heading, .stats > p, .feature-copy article, .creation-card, .testimonial, .closing-copy > *"
    );

    revealItems.forEach((item, index) => {
      item.classList.add("reveal");
      (item as HTMLElement).style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    });

    if (reduced) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealItems.forEach((item) => observer.observe(item));

    let frame = 0;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const y = window.scrollY;
      document.querySelector(".nav-pill")?.classList.toggle("is-scrolled", y > 420);

      const product = document.querySelector(".product-stage") as HTMLElement | null;
      if (product) {
        const rect = product.getBoundingClientRect();
        const progress = clamp(-rect.top / Math.max(1, rect.height - viewport));
        product.style.setProperty("--product-progress", progress.toFixed(4));
      }

      const stats = document.querySelector(".stats") as HTMLElement | null;
      if (stats) {
        const rect = stats.getBoundingClientRect();
        const progress = clamp(-rect.top / Math.max(1, rect.height - viewport));
        stats.style.setProperty("--stats-progress", progress.toFixed(4));
        const phase = progress * 2;
        const dominant = Math.round(phase);
        stats.querySelectorAll("strong").forEach((item, index) => {
          const distance = Math.abs(phase - index);
          const opacity = index === dominant
            ? 1 - distance * 0.45
            : clamp((0.60 - distance) * 2);
          (item as HTMLElement).style.opacity = opacity.toFixed(3);
          (item as HTMLElement).style.transform =
            `translate3d(0, ${(index - phase) * 185}px, 0) scale(${0.94 + opacity * 0.06})`;
        });
      }

      const patterns = document.querySelector(".patterns") as HTMLElement | null;
      if (patterns) {
        const rect = patterns.getBoundingClientRect();
        const progress = clamp(-rect.top / Math.max(1, rect.height - viewport));
        patterns.style.setProperty("--pattern-progress", progress.toFixed(4));
      }

      const flows = document.querySelector(".flows") as HTMLElement | null;
      if (flows) {
        const rect = flows.getBoundingClientRect();
        const progress = clamp((viewport - rect.top) / (viewport + rect.height));
        flows.style.setProperty("--flow-progress", progress.toFixed(4));
      }

      const closing = document.querySelector(".closing") as HTMLElement | null;
      if (closing) {
        const rect = closing.getBoundingClientRect();
        const progress = clamp((viewport - rect.top) / (viewport + rect.height));
        closing.style.setProperty("--closing-progress", progress.toFixed(4));
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main>
      <header className="nav-wrap">
        <nav className="nav-pill" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Scalar home">
            <ScalarMark />
            <span>scalar</span>
          </a>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#library" onClick={() => setMenuOpen(false)}>Explore</a>
            <a href="#stories" onClick={() => setMenuOpen(false)}>Awards</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#footer" onClick={() => setMenuOpen(false)}>Log in</a>
          </div>
          <a className="nav-cta" href="#library">Join for free</a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span />
            <span />
          </button>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="spark">
          <span /><span /><span /><span /><span /><span /><span />
        </div>
        <p className="eyebrow">THE WORLD&apos;S DESIGN LIBRARY</p>
        <h1>Discover real-world<br />design inspiration.</h1>
        <p className="hero-sub">Featuring over 1,000 iOS &amp; Web apps, and 200 sites —<br />New content weekly.</p>
        <div className="button-row">
          <a className="button primary" href="#library">Join for free</a>
          <a className="button secondary" href="#pricing">See our plans <Arrow /></a>
        </div>
        <p className="trusted-label">Trusted by design teams at</p>
        <div className="logo-row" aria-label="Trusted companies">
          <b>shopify</b><b>NIKE</b><b>Pinterest</b><b>duolingo</b><b>Disney+</b>
        </div>
      </section>

      <section className="product-stage" aria-label="Scalar product preview">
        <div className="product-window">
          <div className="product-top">
            <ScalarMark />
            <div className="product-switch"><strong>Apps</strong><span>Sites</span></div>
            <div className="search-bar">⌕&nbsp;&nbsp; Search on iOS... <span>⌗</span></div>
          </div>
          <div className="product-categories">
            <div><small>Categories</small><b>Finance</b><b>Food &amp; Drink</b><b>Travel</b><b>Shopping</b><b>Social</b></div>
            <div><small>Screens</small><b>Login</b><b>Home</b><b>Search</b><b>Checkout</b><b>Filter &amp; Sort</b></div>
            <div><small>UI Elements</small><b>Card</b><b>Button</b><b>Toast</b><b>Banner</b><b>Tab Bar</b></div>
          </div>
          <div className="product-filter">
            <span className="filter-chip">iOS</span><span>Web</span><b>Latest</b><span>Most popular</span><span>Top rated</span>
          </div>
          <div className="screen-grid">
            <div className="screen-card"><small>NEW</small><div className="phone phone-dark"><span>9:41</span><em>THE FUTURE AWAITS</em></div></div>
            <div className="screen-card"><small>UPDATED</small><div className="phone"><span>9:41</span><em>Home</em><i /></div></div>
            <div className="screen-card"><small>NEW</small><div className="phone phone-blue"><span>9:41</span><em>Explore</em><i /></div></div>
          </div>
        </div>
      </section>

      <section className="stats" id="library">
        <p><span>Scalar index</span>A growing library of real product decisions</p>
        <div className="stat-icons" aria-hidden="true">
          {["grid","orbit","wave","stack","spark","focus","flow","layers"].map((motif, index) => (
            <span className={`motif-tile motif-${motif}`} key={motif} data-index={index}>
              <i /><i /><i />
            </span>
          ))}
        </div>
        <div className="stat-stack">
          <strong><span>1,428</span><em>apps</em></strong>
          <strong><span>621,500+</span><em>screens</em></strong>
          <strong><span>323,900</span><em>flows</em></strong>
          <small>Curated by product and pattern · Updated weekly</small>
        </div>
      </section>

      <section className="patterns">
        <div className="section-heading">
          <p className="eyebrow">SEARCH WITH PRECISION</p>
          <h2>Find design patterns<br />in seconds.</h2>
        </div>
        <div className="pattern-browser">
          <div className="pattern-tabs" role="tablist" aria-label="Pattern types">
            {(Object.keys(patternData) as (keyof typeof patternData)[]).map((item) => (
              <button key={item} className={activePattern === item ? "active" : ""} onClick={() => setActivePattern(item)} role="tab" aria-selected={activePattern === item}>
                {item}
              </button>
            ))}
          </div>
          <div className="pattern-content">
            <div>
              <small>{activePattern}</small>
              <h3>{activePattern === "Screens" ? "Collections" : activePattern}</h3>
            </div>
            <ul>
              {patternData[activePattern].map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}<Arrow /></li>)}
            </ul>
          </div>
          <div className="pattern-rail" aria-hidden="true">
            {[...patternData[activePattern], ...patternData[activePattern]].map((item, index) => (
              <div className={`pattern-card pattern-card-${index % 4}`} key={`${item}-${index}`}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <div className="pattern-phone"><i /><i /><i /></div>
                <b>{item}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flows">
        <div className="flows-copy">
          <p className="eyebrow light-text">SEE THE WHOLE STORY</p>
          <h2>Explore entire user<br />journeys with flows.</h2>
          <div className="feature-copy">
            <article><span>01</span><h3>Video</h3><p>Experience flows in their natural form, complete with micro-interactions, animations and more.</p></article>
            <article><span>02</span><h3>Prototype</h3><p>Go through screen by screen using interactive hotspots at your own preferred pace.</p></article>
          </div>
        </div>
        <div className="flow-phones">
          <div className="flow-phone back"><div className="phone-head">9:41</div><div className="purple-orb" /><h4>Let&apos;s get you started</h4><div className="line" /><div className="line short" /></div>
          <div className="flow-phone front"><div className="phone-head">9:41</div><p>Welcome</p><h4>What are you<br />interested in?</h4><div className="tag-cloud"><span>Design</span><span>Music</span><span>Travel</span><span>Tech</span><span>Art</span></div><button>Continue</button></div>
        </div>
      </section>

      <section className="creation">
        <div className="section-heading">
          <p className="eyebrow">BUILT FOR YOUR WORKFLOW</p>
          <h2>From inspiration<br />to creation.</h2>
        </div>
        <div className="creation-grid">
          <article className="creation-card card-figma">
            <div className="mini-ui"><span>+</span><div><b>Copy to Figma</b><small>Ready to paste</small></div></div>
            <div><h3>Copy to Figma</h3><p>Download designs you like or copy them straight into Figma with our plugin.</p></div>
          </article>
          <article className="creation-card card-collections">
            <div className="collection-stack"><span>Mobile ideas</span><span>Checkout research</span><span>Onboarding ✦</span></div>
            <div><h3>Save to collections</h3><p>Collect your favorite designs and upload your own screenshots into one place.</p></div>
          </article>
          <article className="creation-card card-comments">
            <div className="comment-bubble"><span>MT</span><p>This transition is perfect.</p></div>
            <div><h3>Leave comments</h3><p>Take notes when saving so you never lose the context behind a great idea.</p></div>
          </article>
        </div>
      </section>

      <section className="stories" id="stories">
        <div className="section-heading">
          <p className="eyebrow">LOVED BY DESIGNERS</p>
          <h2>What our users<br />are saying.</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map(([name, company, quote], index) => (
            <article className={`testimonial t${index + 1}`} key={name}>
              <p>“{quote}”</p>
              <div><span>{name.split(" ").map((n) => n[0]).join("")}</span><b>{name}<small>{company}</small></b></div>
            </article>
          ))}
        </div>
      </section>

      <section className="closing" id="pricing">
        <div className="closing-copy">
          <p className="eyebrow light-text">YOUR NEXT IDEA STARTS HERE</p>
          <h2>Never run out of<br />inspiration again.</h2>
          <p>Use Scalar for free as long as you like, or get full access with any of our paid plans.</p>
          <div className="button-row"><a className="button white" href="#top">Join for free</a><a className="button outline" href="#footer">See our plans <Arrow /></a></div>
        </div>
        <div className="logo-cloud" aria-hidden="true">
          {[
            ["Coinbase","Wise","Headspace","Airbnb","Uber","Nike","Pinterest"],
            ["ChatGPT","Shopify","Loom","Mailchimp","Twitch","Figma","Arc"],
            ["Spotify","Apple TV","Scalar","Notion","Dropbox","Linear","Cosmos"],
          ].map((row, rowIndex) => (
            <div className="logo-marquee" data-row={rowIndex} key={rowIndex}>
              <div>{[...row, ...row].map((logo, index) => <span key={`${logo}-${index}`}>{logo}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <footer id="footer">
        <div className="footer-top">
          <div className="footer-brand"><a className="brand" href="#top"><ScalarMark /><span>scalar</span></a><p>Design better digital<br />experiences with Scalar.</p></div>
          <div className="footer-links"><div><small>PRODUCT</small><a href="#library">Explore</a><a href="#pricing">Pricing</a><a href="#stories">Changelog</a><a href="#stories">Blog</a></div><div><small>COMPANY</small><a href="#footer">Contact</a><a href="#footer">Help center</a><a href="#footer">Careers</a><a href="#footer">About</a></div><div><small>SOCIAL</small><a href="#footer">X (Twitter)</a><a href="#footer">LinkedIn</a><a href="#footer">Instagram</a></div></div>
        </div>
        <div className="footer-bottom"><span>© Scalar 2026</span><div><a href="#footer">Privacy policy</a><a href="#footer">Terms</a></div></div>
      </footer>
    </main>
  );
}
