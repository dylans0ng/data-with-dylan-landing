import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SiteLayout from "../components/layout/SiteLayout";

const TOPIC_PREFS_ERROR =
  "We're having trouble saving your topic preferences. Please try again later.";
const SUBSCRIBE_SUCCESS_MESSAGE =
  "Success! Check your inbox to confirm you're on the list.";

const parsePositiveIntEnv = (value: unknown): number | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed =
    typeof value === "number" ? value : parseInt(String(value), 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return null;
};

const buildSelectedTagIds = (
  interestSql: boolean,
  interestPython: boolean,
  sqlTagId: number | null,
  pythonTagId: number | null
): number[] => {
  const tags: number[] = [];
  if (interestSql && sqlTagId !== null) {
    tags.push(sqlTagId);
  }
  if (interestPython && pythonTagId !== null) {
    tags.push(pythonTagId);
  }
  return tags;
};

const HomePage: React.FC = () => {
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
  const [shakeEmail, setShakeEmail] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const joinRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const setSectionRef = (index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el;
  };

  useEffect(() => {
    if (window.location.hash === "#join") {
      joinRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const apiKey = import.meta.env.VITE_CONVERTKIT_API_KEY;
  const formId = import.meta.env.VITE_CONVERTKIT_FORM_ID;
  const rawSqlTagId = import.meta.env.VITE_CONVERTKIT_SQL_TAG_ID;
  const rawPythonTagId = import.meta.env.VITE_CONVERTKIT_PYTHON_TAG_ID;
  const isDev = import.meta.env.DEV === true;

  const logDevInfo = useCallback((...args: unknown[]) => {
    if (isDev) console.info(...args);
  }, [isDev]);
  const logErrorAlways = (...args: unknown[]) => {
    console.error(...args);
  };

  const validatedSqlTagId = parsePositiveIntEnv(rawSqlTagId);
  const validatedPythonTagId = parsePositiveIntEnv(rawPythonTagId);

  useEffect(() => {
    logDevInfo(
      "[Kit] legacy fallback apiKey present?",
      Boolean(apiKey),
      apiKey ? `len=${apiKey.length}` : "missing"
    );
    logDevInfo(
      "[Kit] legacy fallback formId present?",
      Boolean(formId),
      formId ? `len=${String(formId).length}` : "missing"
    );
    logDevInfo("[Kit] legacy fallback sqlTagId valid?", validatedSqlTagId !== null);
    logDevInfo(
      "[Kit] legacy fallback pythonTagId valid?",
      validatedPythonTagId !== null
    );
  }, [apiKey, formId, logDevInfo, validatedSqlTagId, validatedPythonTagId]);

  const isFormValid = interestSql || interestPython;

  const resetJoinForm = () => {
    setFirstName("");
    setEmail("");
    setInterestPython(false);
    setInterestSql(false);
    setEmailError("");
    setCheckboxError("");
  };

  const subscribeWithLegacyConvertKit = async (
    trimmedEmail: string,
    trimmedFirstName: string
  ): Promise<{ ok: true } | { ok: false; message: string }> => {
    if (!apiKey || !formId) {
      logErrorAlways("[Kit] Missing legacy fallback env config", {
        apiKey: Boolean(apiKey),
        formId: Boolean(formId),
      });
      return { ok: false, message: TOPIC_PREFS_ERROR };
    }

    if (interestSql && validatedSqlTagId === null) {
      logErrorAlways(
        "[Kit] SQL selected but VITE_CONVERTKIT_SQL_TAG_ID is missing or invalid"
      );
      return { ok: false, message: TOPIC_PREFS_ERROR };
    }
    if (interestPython && validatedPythonTagId === null) {
      logErrorAlways(
        "[Kit] Python selected but VITE_CONVERTKIT_PYTHON_TAG_ID is missing or invalid"
      );
      return { ok: false, message: TOPIC_PREFS_ERROR };
    }

    const selectedTagIds = buildSelectedTagIds(
      interestSql,
      interestPython,
      validatedSqlTagId,
      validatedPythonTagId
    );

    const requestBody: {
      email: string;
      first_name?: string;
      tags: number[];
    } = {
      email: trimmedEmail,
      first_name: trimmedFirstName || undefined,
      tags: selectedTagIds,
    };

    logDevInfo("[Kit] Using legacy fallback with tags:", selectedTagIds);

    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe?api_key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "manual",
        body: JSON.stringify(requestBody),
      }
    );

    if (
      response.type === "opaqueredirect" ||
      (response.status >= 300 && response.status < 400)
    ) {
      return {
        ok: false,
        message: "Configuration error: Please verify your Kit API settings.",
      };
    }

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.subscription) {
      return { ok: true };
    }

    return {
      ok: false,
      message: data.message || TOPIC_PREFS_ERROR,
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;
    if (!interestSql && !interestPython) {
      setCheckboxError("Please select at least one topic you're interested in.");
      hasError = true;
    } else {
      setCheckboxError("");
    }

    const trimmedEmail = email.trim();
    const trimmedFirstName = firstName.trim();
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
      const response = await fetch("/api/subscribe-kit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          firstName: trimmedFirstName || undefined,
          interests: {
            python: interestPython,
            sql: interestSql,
          },
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.synced === true) {
        setSubmitStatus({
          type: "success",
          message: SUBSCRIBE_SUCCESS_MESSAGE,
        });
        resetJoinForm();
        return;
      }

      const shouldTryLegacyFallback =
        response.status === 404 || response.status >= 500;

      if (shouldTryLegacyFallback) {
        logDevInfo("[Kit] Server subscribe failed; trying legacy fallback.", data);
        const legacyResult = await subscribeWithLegacyConvertKit(
          trimmedEmail,
          trimmedFirstName
        );

        if (legacyResult.ok) {
          setSubmitStatus({
            type: "success",
            message: SUBSCRIBE_SUCCESS_MESSAGE,
          });
          resetJoinForm();
          return;
        }

        setSubmitStatus({
          type: "error",
          message: legacyResult.message,
        });
        return;
      }

      setSubmitStatus({
        type: "error",
        message: data.error || TOPIC_PREFS_ERROR,
      });
    } catch {
      try {
        const legacyResult = await subscribeWithLegacyConvertKit(
          trimmedEmail,
          trimmedFirstName
        );

        if (legacyResult.ok) {
          setSubmitStatus({
            type: "success",
            message: SUBSCRIBE_SUCCESS_MESSAGE,
          });
          resetJoinForm();
          return;
        }

        setSubmitStatus({
          type: "error",
          message: legacyResult.message,
        });
      } catch {
        setSubmitStatus({
          type: "error",
          message: "Network error. Please check your connection and try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout
      mode="home"
      onScrollToSection={scrollToSection}
      aboutRef={aboutRef}
      joinRef={joinRef}
      heroRef={heroRef}
    >
      <main className="sections">
        <section
          id="hero"
          className="section section-hero hero-fade-in"
          ref={(el: HTMLDivElement | null) => {
            heroRef.current = el;
          }}
        >
          <div className="page-container">
            <div className="hero-content">
              <p className="eyebrow">🚀 Python · SQL · Data Science</p>
              <h1 className="hero-title">
                Jumpstart your data science journey with
                <span className="accent"> free resources.</span>
              </h1>
              <p className="hero-subtitle">
                Use clear cheat sheets and guided notes to follow along with my
                videos, review key ideas, and practice what you learn one step
                at a time.
              </p>

              <div className="hero-cta-row">
                <Link
                  to="/resources"
                  className="btn btn-primary"
                >
                  Explore free resources
                </Link>
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
              <div className="hero-tag">Resource library</div>
              <ul className="hero-list">
                <li>Lesson-by-lesson materials</li>
                <li>Cheat sheets for quick review</li>
                <li>Guided notes for following along with videos</li>
                <li>Beginner-friendly examples</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="section reveal-section"
          ref={(el: HTMLDivElement | null) => {
            setSectionRef(0)(el);
            aboutRef.current = el;
          }}
        >
          <div className="page-container">
            <div className="about-grid">
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
          </div>
        </section>

        <section
          id="guides"
          className="section reveal-section"
          ref={(el: HTMLDivElement | null) => {
            setSectionRef(1)(el);
          }}
        >
          <div className="page-container">
            <p className="eyebrow">Learning resources</p>
            <h2 className="section-title">
              Start with the Python Fundamentals resource library
            </h2>
            <p className="body-copy resources-home-intro">
              A complete beginner-friendly collection that pairs with my Python
              videos, including cheat sheets and guided notes for each lesson.
            </p>

            <div className="cards-grid">
              <article className="resource-card resource-card-featured">
                <div className="resource-icon">🐍</div>
                <h3>Python Fundamentals</h3>
                <p>
                  Follow 7 beginner Python lessons from variables and
                  conditionals through loops, collections, file I/O, and a first
                  Pandas DataFrame.
                </p>
                <ul className="card-list">
                  <li>7 lesson-by-lesson cheat sheets</li>
                  <li>7 guided notes PDFs</li>
                  <li>Built to review, follow along, and practice</li>
                </ul>
                <div className="resource-card-actions">
                  <Link
                    to="/resources/python-fundamentals"
                    className="btn btn-primary"
                  >
                    Explore Python Fundamentals
                  </Link>
                  <Link
                    to="/resources/python-fundamentals/cheat-sheets"
                    className="btn btn-secondary"
                  >
                    Browse cheat sheets
                  </Link>
                  <Link
                    to="/resources/python-fundamentals/guided-notes"
                    className="btn btn-ghost"
                  >
                    Browse guided notes
                  </Link>
                </div>
              </article>

              <article className="resource-card">
                <div className="resource-icon">🗄️</div>
                <h3>SQL Foundations</h3>
                <p>
                  SQL resources are planned next, with beginner-friendly
                  references for SELECTs, joins, grouping, and query patterns.
                </p>
                <ul className="card-list">
                  <li>Beginner-friendly SQL references</li>
                  <li>Visual explanations for query patterns</li>
                  <li>Practice-focused materials as the collection grows</li>
                </ul>
                <a
                  href="#join"
                  className="btn btn-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(joinRef);
                  }}
                >
                  Get SQL updates
                </a>
              </article>
            </div>
          </div>
        </section>

        <section
          id="join"
          className="section section-join reveal-section"
          ref={(el: HTMLDivElement | null) => {
            setSectionRef(2)(el);
            joinRef.current = el;
          }}
        >
          <div className="page-container">
            <div className="join-inner">
              <div>
                <p className="eyebrow">Join the newsletter</p>
                <h2 className="section-title">
                  Get new resources and tutorials when they launch
                </h2>
                <p className="body-copy">
                  Join the email list if you&apos;d like occasional updates about new
                  cheat sheets, guided notes, videos, and practice materials.
                  Resource access is separate, so subscribing is optional.
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
                    <span>Send me SQL updates</span>
                  </label>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name="interest_python"
                      checked={interestPython}
                      onChange={(e) => {
                        setInterestPython(e.target.checked);
                        if (e.target.checked) {
                          setCheckboxError("");
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    <span>Send me Python updates</span>
                  </label>
                </div>

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
                  {isSubmitting ? "Submitting..." : "Send me learning updates"}
                </button>

                <div className="join-form-footer">
                  <p className="small-print small-print-reminder">
                    Didn&apos;t get the email? Check your spam or promotions folder.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default HomePage;
