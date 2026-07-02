import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteLayout from "../../components/layout/SiteLayout";
import { useAuth } from "../../auth/useAuth";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getSafeRedirect } from "../../utils/redirects";

const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  const redirectTo = useMemo(
    () => getSafeRedirect(searchParams.get("redirect")),
    [searchParams]
  );

  useDocumentTitle("Confirming account");

  useEffect(() => {
    if (!isLoading) {
      navigate(redirectTo, { replace: true });
    }
  }, [isLoading, navigate, redirectTo]);

  return (
    <SiteLayout mode="resources">
      <main className="resources-main auth-main">
        <section className="section resources-section">
          <div className="page-container auth-container">
            <div className="auth-card">
              <p className="eyebrow">ACCOUNT</p>
              <h1 className="section-title">Confirming your account</h1>
              <p className="body-copy">
                Hang tight while we finish signing you in.
              </p>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default AuthCallbackPage;
