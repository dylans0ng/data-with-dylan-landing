// src/App.tsx
import React from "react";
import "./index.css"; // or "./style.css" if that's your filename

const App: React.FC = () => {
  return (
    <div className="page">
      {/* Top Nav */}
      <header className="nav">
        <div className="nav-left">
          <div className="logo-dot" />
          <span className="nav-title">Data with Dylan</span>
        </div>
        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#guides">Free Guides</a>
          <a href="#join" className="nav-cta">
            Join the list
          </a>
        </nav>
      </header>

      {/* MAIN SECTIONS */}
      <main className="sections">
        {/* HERO */}
        <section id="hero" className="section section-hero">
          <div className="hero-content">
            <p className="eyebrow">🚀 Python · SQL · Data Science</p>
            <h1 className="hero-title">
              Jumpstart your
              <span className="accent"> Data Science Journey</span> for Free.
            </h1>
            <p className="hero-subtitle">
              Get beginner-friendly Python and SQL cheat sheets, visual explainers,
              and practice problems—designed for busy students and early-career
              data folks.
            </p>

            <div className="hero-cta-row">
              <a href="#join" className="btn btn-primary">
                Get the cheat sheets
              </a>
              <a
                href="https://www.youtube.com/@DataWithDylan"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
              >
                Visit the YouTube channel
              </a>
            </div>

            <p className="hero-trust">
              ✅ Join a community of data learners growing with{" "}
              <a
                href="https://www.youtube.com/@data_with_dylan"
                target="_blank"
                rel="noreferrer"
              >
                Data with Dylan
              </a>
            </p>
          </div>
          <div className="hero-card">
            <div className="hero-tag">What you’ll get</div>
            <ul className="hero-list">
              <li>📌 Step-by-step examples in Python + SQL</li>
              <li>🧠 Intuition-first explanations (not just formulas)</li>
              <li>📝 Practice problems with solutions</li>
              <li>📬 New resources sent straight to your inbox</li>
            </ul>
          </div>
        </section>

        {/* ABOUT DYLAN */}
        <section id="about" className="section">
          <div className="section-inner about-grid">
            <div className="about-photo-wrap">
              <img
                src="/dylan-headshot.jpg"
                alt="Dylan Song"
                className="about-photo"
              />
            </div>
            <div className="section-text">
              <p className="eyebrow">ABOUT ME</p>
              <h2 className="section-title">Data with Dylan</h2>
              <p className="body-copy">
                I&apos;m Dylan, studying Informatics and Business at the
                University of Washington! I make beginner-friendly tutorials on
                Python, SQL, Excel, and data science on YouTube.
              </p>
              <p className="body-copy">
                I started this email list for people who don&apos;t just want to
                watch tutorials—they want more guided practice and resources that
                reinforce the concepts and supplement their learning.
              </p>
              <p className="body-copy">
                By joining, you&apos;ll get structured tips, mini-projects, cheat
                sheets, and behind-the-scenes insights that help you actually apply
                what you learn and stay consistent on your data science journey.
              </p>
            </div>
          </div>
        </section>

        {/* GUIDES / OFFERS */}
        <section id="guides" className="section">
          <div className="section-inner">
            <p className="eyebrow">Free resources</p>
            <h2 className="section-title">
              Choose your starting point (or grab both)
            </h2>

            <div className="cards-grid">
              <article className="resource-card">
                <div className="resource-icon">🗄️</div>
                <h3>SQL Foundations Cheatsheet</h3>
                <p>
                  SELECTs, JOINs, GROUP BY, window functions, and the patterns
                  you&apos;ll actually see in interviews and real projects.
                </p>
                <ul className="card-list">
                  <li>From basic SELECTs to intermediate queries</li>
                  <li>Visual diagrams to understand joins</li>
                  <li>Practice questions with answers</li>
                </ul>
                <a href="#join" className="btn btn-secondary">
                  Get the SQL guide
                </a>
              </article>

              <article className="resource-card">
                <div className="resource-icon">🐍</div>
                <h3>Python Fundamentals Cheatsheet</h3>
                <p>
                  Variables, data types, loops, functions, and real examples so
                  you can actually build things—not just memorize syntax.
                </p>
                <ul className="card-list">
                  <li>Core concepts in under 10 minutes per section</li>
                  <li>Beginner-friendly practice problems</li>
                  <li>Perfect supplement to my Python videos</li>
                </ul>
                <a href="#join" className="btn btn-secondary">
                  Get the Python guide
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* CONVERTKIT SIGNUP */}
        <section id="join" className="section section-join">
          <div className="section-inner join-inner">
            <div>
              <p className="eyebrow">Join the newsletter</p>
              <h2 className="section-title">
                Get the cheat sheets & new lessons in your inbox
              </h2>
              <p className="body-copy">
                Drop your email below and I&apos;ll send you the guides! You&apos;ll
                also get occasional newsletters with exclusive resources that I only
                share with my email subscribers, including sneak-peek previews of my
                upcoming videos, more practice problems, and personal insights from my
                own learning journey.
              </p>
            </div>

            <form
              className="join-form"
              // TODO: replace XXXXXX with your actual ConvertKit form ID
              action="https://app.convertkit.com/forms/XXXXXX/subscriptions"
              method="post"
            >
              <label className="input-label">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                />
              </label>

              {/* Optional: tag/checkboxes if you want to segment later */}
              <div className="input-row">
                <label className="checkbox">
                  <input type="checkbox" name="interest_python" />
                  <span>I&apos;m into Python</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" name="interest_sql" />
                  <span>I&apos;m into SQL</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                📬 Send me the cheat sheets
              </button>

              <p className="small-print">
                No spam. Unsubscribe any time with one click.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Data with Dylan</span>
        <span>Built for data science learners 👨‍💻📊</span>
      </footer>
    </div>
  );
};

export default App;
