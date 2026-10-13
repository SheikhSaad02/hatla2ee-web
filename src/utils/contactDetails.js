// Presence flags gate contact-CTA visibility; the real values are fetched on
// click, so only these booleans reach the client. Each channel is resolved
// independently — no key depends on another:
//   - has_<channel> present as a boolean -> use it verbatim (true shows, false hides)
//   - has_<channel> absent               -> fall back to that channel's raw
//     Elastic value (for surfaces whose data isn't run through the mapper).
export const getContactPresence = (contactDetails) => {
  const cd = contactDetails || {};
  return {
    phone:
      typeof cd.has_phone === 'boolean' ? cd.has_phone : !!(cd.phone || cd.mobile),
    whatsapp:
      typeof cd.has_whatsapp === 'boolean' ? cd.has_whatsapp : !!cd.whatsapp,
    email: typeof cd.has_email === 'boolean' ? cd.has_email : !!cd.email,
  };
};
