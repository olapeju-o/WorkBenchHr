import { Link } from "react-router-dom";

export function SettingsPlaceholderPage({ title }: { title: string }) {
  return (
    <div className="wb-profile wb-placeholder-settings">
      <p className="wb-eyebrow">Coming soon</p>
      <h1 className="wb-onboarding__title">{title}</h1>
      <p className="wb-placeholder-settings__text">
        This section is still in development. You&apos;ll be able to use it here once it
        ships—we appreciate your patience.
      </p>
      <Link to="/settings/profile" className="wb-link">
        Back to Profile
      </Link>
    </div>
  );
}
