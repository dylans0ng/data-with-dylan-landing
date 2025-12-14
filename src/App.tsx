// src/App.tsx
import React, { useEffect, useRef, useState } from "react";
import "./index.css"; // or "./style.css" if that's your filename
import "./App.css";

const App: React.FC = () => {
  // Form state
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [interestPython, setInterestPython] = useState(false);
  const [interestSql, setInterestSql] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [checkboxError, setCheckboxError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [navScrolled, setNavScrolled] = useState(false);
  const [shakeEmail, setShakeEmail] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const guidesRef = useRef<HTMLDivElement | null>(null);
  const joinRef = useRef<HTMLDivElement | null>(null);
  const sqlGuideRef = useRef<HTMLDivElement | null>(null);
  const pythonGuideRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get environment variables
  const apiKey = import.meta.env.VITE_CONVERTKIT_API_KEY;
  const formId = import.meta.env.VITE_CONVERTKIT_SQL_JOINS_FORM_ID;
  const sqlTagId = import.meta.env.VITE_CONVERTKIT_SQL_TAG_ID;

  // Check if SQL checkbox is selected (only SQL matters for validation)
  const isFormValid = interestSql;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate SQL checkbox (only SQL is required)
    let hasError = false;
    if (!interestSql) {
      setCheckboxError("Please select at least one topic you're interested in.");
      hasError = true;
    } else {
      setCheckboxError("");
    }
    
    // Clear checkbox error if validation passes
    setCheckboxError("");
    
    // Validate environment variables
    if (!apiKey || !formId) {
      setSubmitStatus({
        type: "error",
        message: "Configuration error: Please check your ConvertKit API key and Form ID.",
      });
      return;
    }

    // Validate email with single error at a time
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      setEmailError("Email is required");
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 300);
      hasError = true;
    } else if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 300);
      hasError = true;
    } else {
      setEmailError("");
    }

    if (hasError) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Prepare request payload
      const requestBody: {
        email: string;
        first_name?: string;
        tags?: number[];
      } = {
        email: email,
        first_name: firstName.trim() || undefined,
      };

      // Apply SQL tag if SQL checkbox is selected and tag ID is configured
      if (interestSql && sqlTagId) {
        const tagId = parseInt(sqlTagId, 10);
        if (!isNaN(tagId)) {
          requestBody.tags = [tagId];
        }
      }

      // Submit to ConvertKit API
      // Using redirect: 'manual' to prevent browser from following any redirects
      const response = await fetch(
        `https://api.convertkit.com/v3/forms/${formId}/subscribe?api_key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "manual", // Prevent browser from following redirects
          body: JSON.stringify(requestBody),
        }
      );

      // Handle redirect responses (shouldn't happen with API, but prevent navigation)
      if (response.type === "opaqueredirect" || response.status >= 300 && response.status < 400) {
        setSubmitStatus({
          type: "error",
          message: "Configuration error: Please verify your ConvertKit API settings.",
        });
        return;
      }

      const data = await response.json();

      if (response.ok && data.subscription) {
        setSubmitStatus({
          type: "success",
          message: "Success! Check your email for the cheat sheets. 🎉",
        });
        // Reset form
        setFirstName("");
        setEmail("");
        setInterestPython(false);
        setInterestSql(false);
        setEmailError("");
        setCheckboxError("");
      } else {
        // Handle ConvertKit API errors
        const errorMessage =
          data.message || "Something went wrong. Please try again.";
        setSubmitStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="page">
      {/* Top Nav */}
      <header className={`nav ${navScrolled ? "nav-scrolled" : "nav-top"}`}>
        <div
          className="nav-left"
          role="button"
          tabIndex={0}
          aria-label="Back to top"
          onClick={() => scrollToSection(heroRef)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              scrollToSection(heroRef);
            }
          }}
        >
          <div className="logo-dot" />
          <span className="nav-title">Data with Dylan</span>
        </div>
        <nav className="nav-links">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(aboutRef);
            }}
          >
            About
          </a>
          <a
            href="#guides"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(guidesRef);
            }}
          >
            Free Guides
          </a>
          <a
            href="#join"
            className="nav-cta"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(joinRef);
            }}
          >
            Join the list
          </a>
        </nav>
      </header>

      {/* MAIN SECTIONS */}
      <main className="sections">
        {/* HERO */}
        <section
          id="hero"
          className="section section-hero hero-fade-in"
          ref={(el) => {
            heroRef.current = el;
          }}
        >
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
              <a
                href="#join"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(joinRef);
                }}
              >
                Get the cheat sheets
              </a>
              <a
                href="https://www.youtube.com/@data_with_dylan"
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
        <section
          id="about"
          className="section reveal-section"
          ref={(el) => {
            setSectionRef(0)(el);
            aboutRef.current = el;
          }}
        >
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
                By joining, you&apos;ll get access to free exclusive resources
                that will help you apply what you learn throughout your data science journey.
              </p>
            </div>
          </div>
        </section>

        {/* GUIDES / OFFERS */}
        <section
          id="guides"
          className="section reveal-section"
          ref={(el) => {
            setSectionRef(1)(el);
            guidesRef.current = el;
          }}
        >
          <div className="section-inner">
            <p className="eyebrow">Free resources</p>
            <h2 className="section-title">
              Choose your starting point (or grab both)
            </h2>

            <div className="cards-grid">
              <article
                className="resource-card"
                ref={(el) => {
                  sqlGuideRef.current = el;
                }}
              >
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
                <a
                  href="#join"
                  className="btn btn-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(joinRef);
                  }}
                >
                  Get the SQL guide
                </a>
              </article>

              <article
                className="resource-card"
                ref={(el) => {
                  pythonGuideRef.current = el;
                }}
              >
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
                <a
                  href="#join"
                  className="btn btn-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(joinRef);
                  }}
                >
                  Get the Python guide
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* CONVERTKIT SIGNUP */}
        <section
          id="join"
          className="section section-join reveal-section"
          ref={(el) => {
            setSectionRef(2)(el);
            joinRef.current = el;
          }}
        >
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

            <form className="join-form" onSubmit={handleSubmit} action="#" method="post" noValidate>
              <label className="input-label">
                <span className="label-text">
                  First Name <span className="optional-label">(optional)</span>
                </span>
                <input
                  type="text"
                  name="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  disabled={isSubmitting}
                />
              </label>

              <label className="input-label">
                Email
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    if (emailError) {
                      setEmailError("");
                    }
                  }}
                  required
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  className={`${emailError ? "input-error" : ""} ${shakeEmail ? "input-shake" : ""}`}
                />
              </label>

              {emailError && (
                <div className="inline-error" role="alert" aria-live="polite">
                  {emailError}
                </div>
              )}

              {/* Optional: tag/checkboxes if you want to segment later */}
              <div className="input-row">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="interest_sql"
                    checked={interestSql}
                    onChange={(e) => {
                      setInterestSql(e.target.checked);
                      if (e.target.checked) {
                        setCheckboxError("");
                      }
                    }}
                    disabled={isSubmitting}
                    aria-invalid={checkboxError ? "true" : "false"}
                    aria-describedby={checkboxError ? "checkbox-error" : undefined}
                    required
                  />
                  <span>I&apos;m into SQL</span>
                </label>
                <label className="checkbox checkbox-disabled" aria-disabled="true">
                  <input
                    type="checkbox"
                    name="interest_python"
                    checked={interestPython}
                    onChange={() => {}}
                    disabled
                  />
                  <span>I&apos;m into Python (coming soon 👀)</span>
                </label>
              </div>
              
              {/* Checkbox validation error */}
              {checkboxError && (
                <div
                  id="checkbox-error"
                  className="inline-error"
                  role="alert"
                  aria-live="polite"
                >
                  {checkboxError}
                </div>
              )}

              {/* Status messages */}
              {submitStatus.type && (
                <div
                  className={`form-status ${
                    submitStatus.type === "success" ? "form-success" : "form-error"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? "Submitting..." : "📬 Send me the cheat sheets"}
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
