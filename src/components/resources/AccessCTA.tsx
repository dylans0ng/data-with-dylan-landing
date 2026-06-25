import { Link } from "react-router-dom";

const AccessCTA: React.FC = () => {
  return (
    <div className="access-cta">
      <button
        type="button"
        className="btn btn-primary access-cta-primary"
        disabled
        aria-describedby="access-cta-note"
      >
        Create a free account to download
      </button>
      <p id="access-cta-note" className="access-cta-note">
        Account access is coming soon.
      </p>
      <Link to="/#join" className="btn btn-ghost access-cta-secondary">
        Get resources by email
      </Link>
    </div>
  );
};

export default AccessCTA;
