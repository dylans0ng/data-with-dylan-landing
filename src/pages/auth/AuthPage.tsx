import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SiteLayout from "../../components/layout/SiteLayout";
import { useAuth } from "../../auth/useAuth";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getSafeRedirect } from "../../utils/redirects";

interface AuthPageProps {
  mode: "login" | "signup";
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isConfigured, isLoading, signIn, signUp, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailListOptIn, setEmailListOptIn] = useState(false);

  const redirectTo = useMemo(
    () => getSafeRedirect(searchParams.get("redirect")),
    [searchParams]
  );
  const isSignup = mode === "signup";
  const title = isSignup ? "Create your free account" : "Log in";

  useDocumentTitle(title);

  useEffect(() => {
    if (!isLoading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [isLoading, navigate, redirectTo, user]);

  const alternatePath = isSignup
    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
    : `/signup?redirect=${encodeURIComponent(redirectTo)}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      if (isSignup) {
        const result = await signUp(
          email,
          password,
          redirectTo,
          emailListOptIn
        );

        if (result.needsEmailConfirmation) {
          setStatusMessage(
            "Check your email to confirm your account, then come back to unlock the resources."
          );
          return;
        }
      } else {
        await signIn(email, password);
      }

      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SiteLayout mode="resources">
      <main className="resources-main auth-main">
        <section className="section resources-section">
          <div className="page-container auth-container">
            <div className="auth-card">
              <h1 className="section-title">{title}</h1>
              <p className="body-copy">
                {isSignup
                  ? "Create a free account to unlock the full resource library."
                  : "Log in to access your saved resources and downloads."}
              </p>

              {!isConfigured && (
                <p className="inline-error">
                  Supabase environment variables are missing. Add them before
                  using account access.
                </p>
              )}

              <form className="auth-form" onSubmit={handleSubmit}>
                <label className="input-label">
                  <span className="label-text">Email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={!isConfigured || isSubmitting}
                  />
                </label>

                <label className="input-label">
                  <span className="label-text">Password</span>
                  <input
                    type="password"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={6}
                    required
                    disabled={!isConfigured || isSubmitting}
                  />
                </label>

                {isSignup && (
                  <label className="checkbox auth-opt-in">
                    <input
                      type="checkbox"
                      checked={emailListOptIn}
                      onChange={(event) =>
                        setEmailListOptIn(event.target.checked)
                      }
                      disabled={!isConfigured || isSubmitting}
                    />
                    <span>Send me free learning resources to my inbox!</span>
                  </label>
                )}

                {formError && <p className="inline-error">{formError}</p>}
                {statusMessage && (
                  <p className="form-status form-success">{statusMessage}</p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={!isConfigured || isSubmitting}
                >
                  {isSubmitting
                    ? "Working..."
                    : isSignup
                      ? "Create free account"
                      : "Log in"}
                </button>
              </form>

              <p className="auth-switch">
                {isSignup ? "Already have an account?" : "Need an account?"}{" "}
                <Link to={alternatePath}>
                  {isSignup ? "Log in" : "Create one for free"}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default AuthPage;
