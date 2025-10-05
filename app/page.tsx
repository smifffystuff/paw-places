type Feature = {
  title: string;
  description: string;
  icon: string;
  items: string[];
};

type TimelineStep = {
  title: string;
  description: string;
};

const exploreFeatures: Feature[] = [
  {
    title: "Find the perfect spot",
    description:
      "Browse curated maps and lists of places that welcome your furry (or feathered!) friends.",
    icon: "🗺️",
    items: [
      "Interactive map with filters for categories and pet-friendly perks",
      "Smart sorting for distance, top ratings, and newest additions",
      "Save favourite locations to plan weekend adventures",
    ],
  },
  {
    title: "Know before you go",
    description:
      "Deep dive into place pages with trusted details written by the PawPlaces community.",
    icon: "📍",
    items: [
      "Photo galleries, amenities, and real-time open hours",
      "LLM-powered highlights that surface what pet parents care about most",
      "Structured data ready for Google Maps & local SEO",
    ],
  },
  {
    title: "Add hidden gems",
    description:
      "Share that incredible café patio or woodland trail in just a few taps.",
    icon: "➕",
    items: [
      "Guided flow with address lookup or GPS pin drop",
      "Tag support (dog-friendly, water bowls, shaded seating, etc.)",
      "Optional AI-assisted description to polish your submission",
    ],
  },
];

const communityHighlights: Feature[] = [
  {
    title: "Reviews that matter",
    description:
      "Capture the vibe with stories, tips, and snapshots from each visit.",
    icon: "⭐",
    items: [
      "1–5 star ratings with structured pros & cons",
      "Photo-first posts that showcase happy paws",
      "Community moderation to keep things helpful and kind",
    ],
  },
  {
    title: "Social by design",
    description:
      "Follow friends, swap recommendations, and celebrate pet-friendly wins together.",
    icon: "💬",
    items: [
      "Activity feed with posts, reviews, and new place drops",
      "Reactions and comments so every wag gets love",
      "Pet profiles for the stars of the show",
    ],
  },
  {
    title: "Playful gamification",
    description:
      "Earn points, badges, and leaderboard spots as you explore your city.",
    icon: "🏅",
    items: [
      "Unlock badges like Trailblazer and Top Dog Walker",
      "Weekly challenges to discover new neighbourhoods",
      "Local leaderboards to spotlight community champions",
    ],
  },
];

const timeline: TimelineStep[] = [
  {
    title: "Create your profile",
    description:
      "Sign in with Clerk, set up your bio, and introduce your pets with a quick, friendly onboarding flow.",
  },
  {
    title: "Explore and save places",
    description:
      "Search by neighbourhood, filter by pet perks, and bookmark spots you want to try next weekend.",
  },
  {
    title: "Share experiences",
    description:
      "Drop honest reviews, upload photos, and let the AI assistant surface the highlights for fellow explorers.",
  },
  {
    title: "Grow the community",
    description:
      "Invite friends, follow local pet parents, and climb the leaderboard as you champion pet-friendly living.",
  },
];

export default function Home() {
  return (
    <div className="page">
      <header className="top-nav" aria-label="Primary navigation">
        <a className="top-nav__brand" href="#hero">
          <span aria-hidden>🐾</span>
          <span>PawPlaces</span>
          <span className="top-nav__badge">MVP in progress</span>
        </a>
        <button className="top-nav__cta" type="button">
          Join the waitlist
        </button>
      </header>

      <main className="main-content">
        <section id="hero" className="hero">
          <div className="hero__text">
            <span className="hero__kicker">Pet-friendly adventures start here</span>
            <h1 className="hero__title">
              Discover and share places where every pet feels welcome
            </h1>
            <p className="hero__description">
              PawPlaces connects animal lovers with curated maps, heartfelt
              reviews, and playful rewards. We&apos;re building a kinder city for
              cats, dogs, and every companion animal—one wag at a time.
            </p>
            <div className="hero__actions">
              <button className="btn-primary" type="button">
                Get notified for beta access
              </button>
              <button className="btn-secondary" type="button">
                Peek at the product roadmap
              </button>
            </div>
          </div>

          <aside className="hero__card" aria-label="What’s coming soon">
            <h3>On our near-term build list</h3>
            <div className="hero__insights">
              <p>✅ Clerk auth wired up with pet-friendly onboarding.</p>
              <p>🚧 Interactive explore map with Mapbox layers.</p>
              <p>🧠 AI-powered summaries for every review thread.</p>
              <p>📸 Drag &amp; drop uploads for places and posts.</p>
            </div>
          </aside>
        </section>

        <section className="section" aria-labelledby="explore-title">
          <div className="section__header">
            <span className="section__eyebrow">Core product pillars</span>
            <h2 id="explore-title" className="section__title">
              Everything you need to plan a pet-friendly day out
            </h2>
            <p className="section__description">
              Built with Next.js App Router, Server Actions, and a dash of AI,
              PawPlaces blends reliable local data with community warmth.
            </p>
          </div>

          <div className="feature-grid">
            {exploreFeatures.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-card__icon" aria-hidden>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <ul>
                  {feature.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="community-title">
          <div className="section__header">
            <span className="section__eyebrow">Community features</span>
            <h2 id="community-title" className="section__title">
              Built for sharing stories, tips, and proud pet moments
            </h2>
            <p className="section__description">
              From rich storytelling to playful gamification, PawPlaces keeps
              the community experience front and centre.
            </p>
          </div>

          <div className="feature-grid">
            {communityHighlights.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-card__icon" aria-hidden>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <ul>
                  {feature.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section split-section" aria-labelledby="experience-title">
          <article className="highlight-card">
            <h3 id="experience-title">Designed for mobile-first discovery</h3>
            <p>
              PawPlaces is optimised for quick glances on the go and deep dives
              when you&apos;re planning a weekend getaway. Expect buttery-smooth
              navigation, offline-friendly lists, and instant photo loading.
            </p>
            <ul>
              <li>Next.js App Router + streaming server components</li>
              <li>Progressive enhancement with accessible patterns</li>
              <li>Optimised media via next/image and edge caching</li>
            </ul>
          </article>

          <div className="timeline" aria-label="How PawPlaces works">
            {timeline.map((step, index) => (
              <div className="timeline-step" key={step.title}>
                <strong>
                  <span aria-hidden>{index + 1}</span>
                  {step.title}
                </strong>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer" aria-label="Site footer">
        <div className="footer__inner">
          <div className="footer__meta">
            <span>© {new Date().getFullYear()} PawPlaces</span>
            <span>Crafted with ❤️ for pets and their people</span>
          </div>
          <p>
            We&apos;re building in the open. Follow along as we ship auth,
            explore maps, AI-assisted reviews, and more—right here in this
            codebase.
          </p>
        </div>
      </footer>
    </div>
  );
}
