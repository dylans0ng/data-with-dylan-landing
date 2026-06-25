interface StatusBadgeProps {
  variant: "available" | "coming_soon" | "cheat-sheets" | "guided-notes";
  label?: string;
}

const VARIANT_LABELS: Record<StatusBadgeProps["variant"], string> = {
  available: "Available",
  coming_soon: "Coming soon",
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
