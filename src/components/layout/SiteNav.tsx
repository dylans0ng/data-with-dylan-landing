import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export type NavMode = "home" | "resources";

interface HomeNavProps {
  mode: "home";
  onScrollToSection: (ref: React.RefObject<HTMLDivElement | null>) => void;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  joinRef: React.RefObject<HTMLDivElement | null>;
  heroRef: React.RefObject<HTMLDivElement | null>;
}

interface ResourcesNavProps {
  mode: "resources";
}

type SiteNavProps = HomeNavProps | ResourcesNavProps;

const SiteNav: React.FC<SiteNavProps> = (props) => {
  const [navScrolled, setNavScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const brandAction =
    props.mode === "home" ? (
      <div
        className="nav-left"
        role="button"
        tabIndex={0}
        aria-label="Back to top"
        onClick={() => props.onScrollToSection(props.heroRef)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            props.onScrollToSection(props.heroRef);
          }
        }}
      >
        <div className="logo-dot" />
        <span className="nav-title">Data with Dylan</span>
      </div>
    ) : (
      <Link className="nav-left nav-left-link" to="/" aria-label="Go to homepage">
        <div className="logo-dot" />
        <span className="nav-title">Data with Dylan</span>
      </Link>
    );

  return (
    <header
      className={`nav ${navScrolled ? "nav-scrolled" : "nav-top"}${props.mode === "resources" ? " nav-resources" : " nav-home"}`}
    >
      {brandAction}
      <nav className="nav-links" aria-label="Main navigation">
        {props.mode === "home" ? (
          <>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                props.onScrollToSection(props.aboutRef);
              }}
            >
              About
            </a>
            <Link to="/resources">Resources</Link>
            <a
              href="#join"
              className="nav-cta"
              onClick={(e) => {
                e.preventDefault();
                props.onScrollToSection(props.joinRef);
              }}
            >
              Join the list
            </a>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/resources">Resources</Link>
            {user ? (
              <Link to="/account" className="nav-cta">
                Account
              </Link>
            ) : (
              <Link to="/signup" className="nav-cta">
                Create account
              </Link>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default SiteNav;
