'use client';

import { getContactDetails } from '@/apis/contact-details';
import { COOKIE_NAMES } from '@/constants';
import { getCookie } from '@/utils/cookies';
import { useCallback, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRecaptcha } from '@/providers/recaptcha-provider';

// Session cache keyed by listing id so the same listing shown on multiple
// surfaces (card + detail + sticky) only hits the gated endpoint once.
const contactDetailsCache = new Map();

export function useContactDetails(listingId) {
  const { getToken } = useRecaptcha();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inFlightRef = useRef(null);

  const fetchContactDetails = useCallback(async () => {
    if (!listingId) return { error: true };

    if (contactDetailsCache.has(listingId)) {
      setError(false);
      return { contact_details: contactDetailsCache.get(listingId) };
    }

    if (inFlightRef.current) return inFlightRef.current;

    setError(false);
    setLoading(true);

    const request = (async () => {
      try {
        // Once the backend has verified this browser it sets a signed cookie and
        // accepts that instead of a token. Skipping getToken() then avoids
        // loading Google's bundle and the round trip it makes for every reveal;
        // the cookie rides along on its own because the request sends
        // credentials. If the backend ever rejects the cookie it clears it, so
        // the next tap falls back to a token without us tracking any state.
        const verified = !!getCookie(COOKIE_NAMES.HAT_VERIFY);
        const token = verified ? null : await getToken();
        const res = await getContactDetails(listingId, token, locale);

        // The backend caps how many sellers a signed-out visitor may reveal and
        // answers with 4xx + enforce_login once that cap is hit, so the limit
        // holds even when someone edits the counter we keep in localStorage.
        // It is not a failure to report — the caller opens the login modal —
        // so it is checked before the generic error branch below, and the
        // response is never cached.
        if (res?.error?.data?.enforce_login) {
          return { enforceLogin: true, message: res.error.message };
        }

        if (res?.error || !res?.contact_details) {
          setError(true);
          // Pass the backend's wording up only when the server actually
          // answered: it writes these in the caller's language and knows why
          // the call failed. A thrown request carries no status, and its
          // message is a raw string like "Failed to fetch" that no visitor
          // should see — those fall through to the caller's own copy.
          const fromServer = res?.error?.status != null;
          return {
            error: true,
            message: fromServer ? res.error.message : null,
          };
        }

        contactDetailsCache.set(listingId, res.contact_details);
        return { contact_details: res.contact_details };
      } catch {
        setError(true);
        return { error: true };
      } finally {
        setLoading(false);
        inFlightRef.current = null;
      }
    })();

    inFlightRef.current = request;
    return request;
  }, [listingId, getToken, locale]);

  const resetError = useCallback(() => setError(false), []);

  return { fetchContactDetails, loading, error, resetError };
}
