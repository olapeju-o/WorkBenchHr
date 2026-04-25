import { Link } from "react-router-dom";

export function SettingsPlaceholderPage({ title }: { title: string }) {
  return (
    <div className="wb-profile wb-placeholder-settings">
      <h1 className="wb-onboarding__title">{title}</h1>
      <p className="wb-placeholder-settings__text">
        This screen is not built yet. Compare with the matching PNG in{" "}
        <code>Designs/</code> and ask to implement it next.
      </p>
      <Link to="/settings/profile" className="wb-link">
        Back to Profile
      </Link>
    </div>
  );
}
