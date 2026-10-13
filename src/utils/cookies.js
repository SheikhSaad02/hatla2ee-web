export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? match.split('=')[1] : null;
};

export const setCookie = (name, value) =>
  typeof document != 'undefined' &&
  (document.cookie = `${name}=${value}; path=/;`);
