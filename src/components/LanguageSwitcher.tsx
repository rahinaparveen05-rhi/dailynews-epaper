import { Languages } from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface LanguageSwitcherProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  compact?: boolean;
}

export default function LanguageSwitcher({
  language,
  onLanguageChange,
  compact = false,
}: LanguageSwitcherProps) {
  if (compact) {
    return (
      <div className="inline-flex items-center border border-neutral-300 bg-white">
        <Languages className="w-3.5 h-3.5 text-neutral-500 ml-2.5 shrink-0" aria-hidden="true" />
        <select
          aria-label="Select edition language"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
          className="text-xs font-medium bg-white px-2 py-1.5 text-neutral-950 focus:outline-none cursor-pointer min-h-[36px]"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Edition language"
      className="inline-flex items-center border border-neutral-200 bg-neutral-50 p-0.5"
    >
      {SUPPORTED_LANGUAGES.map((lang) => {
        const active = language === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => onLanguageChange(lang.code)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[34px] ${
              active
                ? 'bg-neutral-950 text-white font-semibold'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            {lang.nativeName}
          </button>
        );
      })}
    </div>
  );
}
