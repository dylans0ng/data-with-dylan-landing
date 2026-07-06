interface StatusBadgeProps {
  variant:
    | "available"
    | "coming_soon"
    | "new_resource"
    | "more_coming"
    | "cheat-sheets"
    | "guided-notes";
  label?: string;
}

const VARIANT_LABELS: Record<StatusBadgeProps["variant"], string> = {
  available: "Available",
  coming_soon: "Coming soon",
  new_resource: "Available",
  more_coming: "More coming",
  "cheat-sheets": "Cheat sheet",
  "guided-notes": "Guided notes",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, label }) => {
  return (
    <span className={`status-badge status-badge--${variant}`}>
      {label ?? VARIANT_LABELS[variant]}
    </span>
  );
};

export default StatusBadge;
