import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import type { LessonResource } from "../../data/resources/types";
import { requestResourceDownloadUrl } from "../../services/resourceDownloads";

interface AccessCTAProps {
  lesson: LessonResource;
}

const AccessCTA: React.FC<AccessCTAProps> = ({ lesson }) => {
  const location = useLocation();
  const { isConfigured, isLoading, session, user } = useAuth();
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const redirectPath = `${location.pathname}${location.search}`;
  const authQuery = `redirect=${encodeURIComponent(redirectPath)}`;

  async function handleDownload() {
    if (!session) {
      return;
    }

    setDownloadError("");
    setIsDownloading(true);

    try {
      const downloadUrl = await requestResourceDownloadUrl(
        lesson,
        session.access_token
      );
      window.location.assign(downloadUrl);
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Unable to create a download link."
      );
    } finally {
      setIsDownloading(false);
    }
  }

  if (!isConfigured) {
    return (
      <div className="access-cta">
        <p className="inline-error">
          Account downloads need Supabase environment variables before they can
          be used.
        </p>
        <Link to="/#join" className="btn btn-ghost access-cta-secondary">
          Get resources by email
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="access-cta">
        <button type="button" className="btn btn-primary" disabled>
          Checking account access...
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="access-cta">
        <Link
          to={`/signup?${authQuery}`}
          className="btn btn-primary access-cta-primary"
        >
          Create a free account to download
        </Link>
        <p id="access-cta-note" className="access-cta-note">
          One free account unlocks the entire Python Fundamentals library.
        </p>
        <Link
          to={`/login?${authQuery}`}
          className="btn btn-ghost access-cta-secondary"
        >
          Already have an account? Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="access-cta">
      <button
        type="button"
        className="btn btn-primary access-cta-primary"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? "Preparing download..." : "Download PDF"}
      </button>
      <p id="access-cta-note" className="access-cta-note">
        Signed in as {user.email}. You have access to the full Python
        Fundamentals library.
      </p>
      {downloadError && <p className="inline-error">{downloadError}</p>}
      <Link
        to="/resources/python-fundamentals"
        className="btn btn-ghost access-cta-secondary"
      >
        View full library
      </Link>
    </div>
  );
};

export default AccessCTA;
