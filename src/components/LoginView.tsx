import { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Phone,
  User,
} from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES, UI_STRINGS } from '../i18n/translations';
import {
  loginReaderAccount,
  registerReaderAccount,
} from '../services/authService';
import { NewspaperArticle, ReaderUser } from '../types/newspaper';

interface LoginViewProps {
  currentUser: ReaderUser | null;
  language: LanguageCode;
  bookmarks: NewspaperArticle[];
  onAuthSuccess: (user: ReaderUser) => void;
  onSignOut: () => void;
  onContinueReading: () => void;
}

export default function LoginView({
  currentUser,
  language,
  bookmarks,
  onAuthSuccess,
  onSignOut,
  onContinueReading,
}: LoginViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = UI_STRINGS[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const digits = number.replace(/\D/g, '').slice(-10);

    if (mode === 'register' && trimmedName.length < 2) {
      setErrorMessage(t.errorInvalidName);
      return;
    }
    if (!/^\d{10}$/.test(digits)) {
      setErrorMessage(t.errorInvalidNumber);
      return;
    }
    if (password.length < 6) {
      setErrorMessage(t.errorInvalidPassword);
      return;
    }

    setIsSubmitting(true);
    try {
      const response =
        mode === 'register'
          ? await registerReaderAccount({
              name: trimmedName,
              number: digits,
              password,
              language,
              bookmarks,
            })
          : await loginReaderAccount({
              name: trimmedName,
              number: digits,
              password,
            });
      onAuthSuccess(response.user);
      setPassword('');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to complete authentication.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentUser) {
    const langLabel =
      SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName || 'English';

    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 md:pb-16">
        <div className="border-b-2 border-neutral-950 pb-4 mb-8">
          <p className="text-xs font-semibold text-red-700">{t.readerAccount}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-950 mt-1">
            {currentUser.name}
          </h1>
          <p className="mt-1.5 text-sm text-neutral-600">
            +91 {currentUser.number} · {t.accountActiveLabel}
          </p>
        </div>

        <div className="border border-neutral-200 p-6 sm:p-8 bg-white space-y-6">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-neutral-200 pb-6">
            <div>
              <dt className="text-xs text-neutral-500">{t.fullNameLabel}</dt>
              <dd className="mt-1 text-base font-semibold text-neutral-950">
                {currentUser.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500">{t.mobileNumberLabel}</dt>
              <dd className="mt-1 text-base font-mono-code tabular-nums font-semibold text-neutral-950">
                {currentUser.number}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500">{t.languageLabel}</dt>
              <dd className="mt-1 text-base font-semibold text-neutral-950">
                {langLabel}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onContinueReading}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-neutral-950 hover:bg-red-700 transition-colors cursor-pointer min-h-[44px]"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>{t.readFullEpaper}</span>
            </button>

            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border border-neutral-300 hover:border-red-700 hover:text-red-700 text-neutral-950 transition-colors cursor-pointer min-h-[44px]"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>{t.signOut}</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 pt-10 pb-24 md:pb-16">
      <div className="border-b-2 border-neutral-950 pb-4 mb-6">
        <p className="text-xs font-semibold text-red-700">{t.readerAccount}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-950 mt-1">
          {mode === 'login' ? t.signInTitle : t.createAccountTitle}
        </h1>
        <p className="mt-1.5 text-sm text-neutral-600">
          {t.loginSubtitle}
        </p>
      </div>

      {/* Sign In / Create Account Tabs */}
      <div className="grid grid-cols-2 border border-neutral-300 bg-neutral-50 p-1 mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrorMessage(null);
          }}
          className={`py-2.5 text-xs font-semibold transition-colors cursor-pointer min-h-[40px] ${
            mode === 'login'
              ? 'bg-neutral-950 text-white'
              : 'text-neutral-600 hover:text-neutral-950'
          }`}
        >
          {t.signIn}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMessage(null);
          }}
          className={`py-2.5 text-xs font-semibold transition-colors cursor-pointer min-h-[40px] ${
            mode === 'register'
              ? 'bg-neutral-950 text-white'
              : 'text-neutral-600 hover:text-neutral-950'
          }`}
        >
          {t.createAccount}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border border-neutral-200 bg-white p-6 sm:p-8 space-y-5"
      >
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-3.5 border border-red-300 bg-red-50 text-xs text-red-800"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label
            htmlFor="login-name"
            className="block text-xs font-semibold text-neutral-800 mb-1.5"
          >
            {t.fullNameLabel}
          </label>
          <div className="relative flex items-center">
            <User
              className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="login-name"
              type="text"
              autoComplete="name"
              required={mode === 'register'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 bg-white text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 min-h-[44px]"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <label
            htmlFor="login-number"
            className="block text-xs font-semibold text-neutral-800 mb-1.5"
          >
            {t.mobileNumberLabel}
          </label>
          <div className="relative flex items-center">
            <Phone
              className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="login-number"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              required
              maxLength={14}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="9876543210"
              className="w-full pl-9 pr-3 py-2.5 text-sm font-mono-code tabular-nums border border-neutral-300 bg-white text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 min-h-[44px]"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="login-password"
            className="block text-xs font-semibold text-neutral-800 mb-1.5"
          >
            {t.passwordLabel}
          </label>
          <div className="relative flex items-center">
            <Lock
              className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="w-full pl-9 pr-11 py-2.5 text-sm border border-neutral-300 bg-white text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 min-h-[44px]"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 p-2 text-neutral-500 hover:text-neutral-950 cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 text-sm font-semibold text-white bg-neutral-950 hover:bg-red-700 transition-colors cursor-pointer min-h-[46px] disabled:opacity-60"
        >
          {isSubmitting
            ? t.authenticating
            : mode === 'login'
              ? t.signIn
              : t.createAccount}
        </button>
      </form>
    </main>
  );
}
