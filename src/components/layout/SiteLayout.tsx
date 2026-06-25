import React from "react";
import SiteFooter from "./SiteFooter";
import SiteNav, { type NavMode } from "./SiteNav";
import { useScrollToTop } from "../../hooks/useScrollToTop";

interface HomeLayoutProps {
  mode: "home";
  onScrollToSection: (ref: React.RefObject<HTMLDivElement | null>) => void;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  joinRef: React.RefObject<HTMLDivElement | null>;
  heroRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

interface ResourcesLayoutProps {
  mode: "resources";
  children: React.ReactNode;
}

type SiteLayoutProps = HomeLayoutProps | ResourcesLayoutProps;

const SiteLayout: React.FC<SiteLayoutProps> = (props) => {
  useScrollToTop();

  const nav =
    props.mode === "home" ? (
      <SiteNav
        mode="home"
        onScrollToSection={props.onScrollToSection}
        aboutRef={props.aboutRef}
        joinRef={props.joinRef}
        heroRef={props.heroRef}
      />
    ) : (
      <SiteNav mode="resources" />
    );

  return (
    <div className="page">
      {nav}
      {props.children}
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
export type { NavMode };
