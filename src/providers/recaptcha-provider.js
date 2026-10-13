'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import configs from '@/configs';
import { RECAPTCHA_SITE_KEY } from '@/constants';

const RecaptchaContext = createContext(undefined);

// If Google's bundle never loads — an ad blocker, a bad network — the caller
// would otherwise await forever. Give up and let the request go out tokenless
// so the caller can show its own error instead of a spinner that never stops.
const LOAD_TIMEOUT_MS = 10000;

export function RecaptchaProvider({ children, eager = false }) {
  const recaptchaRef = useRef(null);

  // The widget pulls ~380 KB from Google and installs document-level listeners
  // that run on every interaction, so by default it stays off the page until
  // something asks for a token. Auth screens opt into `eager` because there the
  // token is needed on submit and the page is not one visitors browse; the
  // listing and detail pages stay lazy and load it on the contact tap instead.
  const [mounted, setMounted] = useState(eager);

  const loadedRef = useRef(false);
  const waitersRef = useRef([]);

  // Guard on the sitekey too: react-google-recaptcha throws
  // "Missing required parameters: sitekey" if it renders without one.
  const isRecaptchaReady = configs.isReCaptchaEnabled && !!RECAPTCHA_SITE_KEY;

  const handleScriptLoad = useCallback(() => {
    loadedRef.current = true;
    waitersRef.current.splice(0).forEach((resolve) => resolve());
  }, []);

  // Resolves immediately once Google's script has rendered the widget; callers
  // arriving before that are queued and released by handleScriptLoad.
  const whenLoaded = useCallback(
    () =>
      loadedRef.current
        ? Promise.resolve()
        : new Promise((resolve) => {
            waitersRef.current.push(resolve);
            setTimeout(resolve, LOAD_TIMEOUT_MS);
          }),
    [],
  );

  // Start loading Google's bundle without asking for a token yet. Surfaces that
  // render a gated contact CTA call this while they are idle, so the script is
  // warm by the time the visitor taps and reCAPTCHA has had a few seconds to
  // observe them — its score is worse when it mounts at the moment of the act.
  const prime = useCallback(() => {
    if (isRecaptchaReady) setMounted(true);
  }, [isRecaptchaReady]);

  const getToken = useCallback(async () => {
    if (!isRecaptchaReady) return null;

    setMounted(true);
    await whenLoaded();

    const token = (await recaptchaRef.current?.executeAsync()) ?? null;
    recaptchaRef.current?.reset();
    return token;
  }, [isRecaptchaReady, whenLoaded]);

  const value = useMemo(() => ({ getToken, prime }), [getToken, prime]);

  return (
    <RecaptchaContext.Provider value={value}>
      {children}
      {isRecaptchaReady && mounted && (
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          size="invisible"
          ref={recaptchaRef}
          asyncScriptOnLoad={handleScriptLoad}
        />
      )}
    </RecaptchaContext.Provider>
  );
}

export function useRecaptcha() {
  const context = useContext(RecaptchaContext);

  if (context === undefined) {
    throw new Error('useRecaptcha Error');
  }

  return context;
}
