import { useId, useState } from "react";

const PHONE_COUNTRIES = [
  { id: "us", dial: "+1", flag: "🇺🇸", name: "United States" },
  { id: "ca", dial: "+1", flag: "🇨🇦", name: "Canada" },
  { id: "gb", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { id: "au", dial: "+61", flag: "🇦🇺", name: "Australia" },
  { id: "de", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { id: "fr", dial: "+33", flag: "🇫🇷", name: "France" },
  { id: "in", dial: "+91", flag: "🇮🇳", name: "India" },
  { id: "jp", dial: "+81", flag: "🇯🇵", name: "Japan" },
  { id: "mx", dial: "+52", flag: "🇲🇽", name: "Mexico" },
  { id: "br", dial: "+55", flag: "🇧🇷", name: "Brazil" },
] as const;

export function SettingsProfilePage() {
  return (
    <div className="wb-profile">
      <div className="wb-profile__banner">
        <div
          className="wb-profile__banner-bg"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400&h=220&fit=crop)",
          }}
        />
      </div>

      <div className="wb-profile__identity">
        <div className="wb-profile__avatar-wrap">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face"
            width={120}
            height={120}
            alt=""
            className="wb-profile__avatar"
          />
          <button type="button" className="wb-profile__avatar-edit" aria-label="Edit photo">
            ✎
          </button>
        </div>
        <div className="wb-profile__name-block">
          <h1 className="wb-profile__name">Stacy Hammer</h1>
          <p className="wb-profile__role">eatunique | Human Resources Admin</p>
        </div>
      </div>

      <section className="wb-profile__section">
        <header className="wb-profile__section-head">
          <h2>Personal Information</h2>
          <p>Add your personal information</p>
        </header>
        <div className="wb-profile__grid">
          <ProfileField label="First Name" value="Stacey" />
          <ProfileField label="Last Name" value="Hammer" />
          <ProfileField label="Email Address" value="stacy.hammer@eatunique.com" />
          <ProfilePhoneField label="Mobile Number" defaultCountryId="us" defaultNational="443-515-8476" />
          <ProfileField label="Employee ID" value="37485960" locked />
          <ProfileField label="Date of Hire" value="03/23/2021" locked />
        </div>
      </section>

      <footer className="wb-profile__footer">
        <div className="wb-profile__danger">
          <button type="button" className="wb-btn wb-btn--outline">
            Logout
          </button>
          <button type="button" className="wb-btn wb-btn--danger-outline">
            Delete Account
          </button>
        </div>
        <p className="wb-profile__last-login">Last Login: 03/29/2026 7:10AM EST</p>
      </footer>
    </div>
  );
}

function countryById(id: (typeof PHONE_COUNTRIES)[number]["id"]) {
  return PHONE_COUNTRIES.find((c) => c.id === id) ?? PHONE_COUNTRIES[0];
}

export function ProfilePhoneField({
  label,
  defaultCountryId,
  defaultNational,
}: {
  label: string;
  defaultCountryId: (typeof PHONE_COUNTRIES)[number]["id"];
  defaultNational: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [countryId, setCountryId] = useState(defaultCountryId);
  const [national, setNational] = useState(defaultNational);
  const countrySelectId = useId();
  const nationalInputId = useId();
  const legendId = `${nationalInputId}-legend`;
  const country = countryById(countryId);
  const displayValue = `${country.flag} ${country.dial} ${national}`;

  return (
    <div className="wb-profile-field">
      <span className="wb-profile-field__label-row">
        <span id={legendId}>{label}</span>
        <button
          type="button"
          className="wb-profile-field__edit"
          aria-pressed={isEditing}
          aria-label={isEditing ? `Stop editing ${label}` : `Edit ${label}`}
          onClick={() => setIsEditing((v) => !v)}
        >
          {isEditing ? "Done" : "Edit"} ✎
        </button>
      </span>
      {isEditing ? (
        <div
          className="wb-profile-field__input-row wb-profile-field__input-row--phone wb-profile-field__input-row--editing"
          role="group"
          aria-labelledby={legendId}
        >
          <div className="wb-profile-phone">
            <label htmlFor={countrySelectId} className="visually-hidden">
              Country calling code
            </label>
            <select
              id={countrySelectId}
              className="wb-profile-phone__select"
              value={countryId}
              onChange={(e) =>
                setCountryId(e.target.value as (typeof PHONE_COUNTRIES)[number]["id"])
              }
              aria-label="Country calling code"
            >
              {PHONE_COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.dial}
                </option>
              ))}
            </select>
            <label htmlFor={nationalInputId} className="visually-hidden">
              Phone number without country code
            </label>
            <input
              id={nationalInputId}
              type="tel"
              className="wb-input wb-input--profile wb-profile-phone__national"
              value={national}
              onChange={(e) => setNational(e.target.value)}
              autoComplete="tel-national"
              aria-label="Phone number"
            />
          </div>
        </div>
      ) : (
        <div className="wb-profile-field__input-row" role="group" aria-labelledby={legendId}>
          <input
            type="text"
            className="wb-input wb-input--profile"
            readOnly
            value={displayValue}
            aria-label={`${label}, ${displayValue}`}
            aria-readonly
          />
        </div>
      )}
    </div>
  );
}

export function ProfileField({
  label,
  value,
  locked,
}: {
  label: string;
  value: string;
  locked?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const readOnly = Boolean(locked) || !isEditing;

  return (
    <label className="wb-profile-field">
      <span className="wb-profile-field__label-row">
        <span>{label}</span>
        {locked ? null : (
          <button
            type="button"
            className="wb-profile-field__edit"
            aria-pressed={isEditing}
            aria-label={isEditing ? `Stop editing ${label}` : `Edit ${label}`}
            onClick={() => setIsEditing((v) => !v)}
          >
            {isEditing ? "Done" : "Edit"} ✎
          </button>
        )}
      </span>
      <div
        className={
          "wb-profile-field__input-row" +
          (!locked && isEditing ? " wb-profile-field__input-row--editing" : "")
        }
      >
        <input
          className="wb-input wb-input--profile"
          defaultValue={value}
          readOnly={readOnly}
          aria-readonly={readOnly}
        />
        {locked ? (
          <span className="wb-profile-field__lock" aria-hidden>
            🔒
          </span>
        ) : null}
      </div>
    </label>
  );
}
