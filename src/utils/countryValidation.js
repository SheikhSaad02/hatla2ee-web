import { redirect } from 'next/navigation';

export const countryMap = {
  france: { slug: 'france', label: 'France' },
  italy: { slug: 'Italy', label: 'Italy' },
  sweden: { slug: 'Sweden', label: 'Sweden' },
  japan: { slug: 'Japan', label: 'Japan' },
  korea: { slug: 'Korea', label: 'Korea' },
  usa: { slug: 'USA', label: 'USA' },
  spain: { slug: 'Spain', label: 'Spain' },
  iran: { slug: 'Iran', label: 'Iran' },
  czech: { slug: 'Czech', label: 'Czech' },
  china: { slug: 'China', label: 'China' },
  malaysia: { slug: 'Malaysia', label: 'Malaysia' },
  russia: { slug: 'Russia', label: 'Russia' },
  india: { slug: 'India', label: 'India' },
  egypt: { slug: 'Egypt', label: 'Egypt' },
  germany: { slug: 'Germany', label: 'Germany' },
  uk: { slug: 'UK', label: 'UK' },
  hungary: { slug: 'Hungary', label: 'Hungary' },
  turkey: { slug: 'Turkey', label: 'Turkey' },
  thailand: { slug: 'Thailand', label: 'Thailand' },
  morocco: { slug: 'Morocco', label: 'Morocco' },
  romania: { slug: 'Romania', label: 'Romania' },
  taiwan: { slug: 'Taiwan', label: 'Taiwan' },
  indonesia: { slug: 'Indonesia', label: 'Indonesia' },
  poland: { slug: 'Poland', label: 'Poland' },
  slovakia: { slug: 'Slovakia', label: 'Slovakia' },
  serbia: { slug: 'Serbia', label: 'Serbia' },
  mexico: { slug: 'Mexico', label: 'Mexico' },
  belgium: { slug: 'Belgium', label: 'Belgium' },
};

export const getCountryObject = (country) => countryMap[country?.toLowerCase()];

export function validateCountry(country, locale) {
  return !!getCountryObject(country);
}

export function validateAndRedirect(country, locale, vehicleType = 'car') {
  const isValid = validateCountry(country, locale);
  if (!isValid) {
    // Redirect to the appropriate new vehicle page
    const redirectPath = `/${locale}/new-${vehicleType}`;

    redirect(redirectPath);
  }

  return isValid;
}
