import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SiteLayout from "../../components/layout/SiteLayout";
import { useAuth } from "../../auth/useAuth";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, signOut, user } = useAuth();
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useDocumentTitle("Account");

  async function handleSignOut() {
    setFormError("");
    setIsSubmitting(true);

    try {
      await signOut();
      navigate("/resources", { replace: true });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to sign out. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <SiteLayout mode="resources">
        <main className="resources-main auth-main">
          <section className="section resources-section account-section">
            <div className="page-container auth-container account-auth-container">
              <div className="auth-card">
                <p className="body-copy">Checking your account...</p>
              </div>
            </div>
          </section>
        </main>
      </SiteLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login?redirect=/account" replace />;
  }

  return (
    <SiteLayout mode="resources">
      <main className="resources-main auth-main">
        <section className="section resources-section account-section">
          <div className="page-container auth-container account-auth-container">
            <div className="auth-card">
              <p className="eyebrow">ACCOUNT</p>
              <h1 className="section-title">Your resources are unlocked</h1>
              <p className="body-copy">
                Signed in as <strong>{user.email}</strong>.
              </p>

              {formError && <p className="inline-error">{formError}</p>}

              <div className="auth-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate("/resources")}
                >
                  View resources
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleSignOut}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default AccountPage;
