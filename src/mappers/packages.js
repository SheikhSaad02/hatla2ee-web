// Shapes /api/surge/public/packages for the buy-credits cards.
//
// The response gives every package a localized `additional_info.options` map
// keyed by product slug — `{ name, name_l1, order, value, value_l1 }` — so the
// feature lines are BE copy, not dictionary strings. `validity` is one of those
// options; it is split out because the card renders it as its own row from
// `expiry_days`.
const VALIDITY_OPTION = 'validity';

// Only these two exist today; a new slug simply renders without an icon.
const PACKAGE_ICON = {
  expert: '/assets/buy-credits/package-expert.svg',
  highline: '/assets/buy-credits/package-highline.svg',
};

const mapOptions = (options = {}) =>
  Object.entries(options)
    .filter(([key]) => key !== VALIDITY_OPTION)
    .map(([key, option]) => ({
      key,
      name: option?.name,
      name_l1: option?.name_l1,
      value: option?.value,
      value_l1: option?.value_l1,
      order: option?.order ?? 0,
    }))
    .filter((option) => option.name || option.name_l1)
    .sort((a, b) => a.order - b.order);

const mapPackage = (pkg) => {
  const price = Number(pkg?.net_amount);
  if (!pkg?.slug || !Number.isFinite(price)) return null;

  const credits = Number(pkg?.total_credits) || 0;

  return {
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    name_l1: pkg.name_l1,
    icon: PACKAGE_ICON[pkg.slug] || null,
    price,
    // The pre-discount figure the card strikes through.
    total: Number(pkg?.total_amount) || price,
    credits,
    // Not sent; it is the package price divided by the credits it buys.
    ratePerCredit: credits ? (price / credits).toFixed(2) : null,
    discount: Number(pkg?.additional_info?.discount) || 0,
    validityDays: Number(pkg?.expiry_days) || null,
    options: mapOptions(pkg?.additional_info?.options),
  };
};

export function mapProductPricing(response) {
  const products = response?.product_discounts || {};

  return Object.fromEntries(
    Object.entries(products)
      .filter(([, product]) => product?.required_price != null)
      .map(([slug, product]) => [
        slug,
        {
          name: product?.name,
          name_l1: product?.name_l1,
          price: Number(product?.required_price) || null,
          credits: Number(product?.required_credits) || null,
          order: product?.order ?? 0,
        },
      ]),
  );
}

export function mapCreditPackages(response) {
  const packages = (response?.packages || []).map(mapPackage).filter(Boolean);
  if (!packages.length) return [];

  // No `recommended` flag in the response, so the best-value package — the one
  // with the largest discount — is the one highlighted.
  const topDiscount = Math.max(...packages.map((pkg) => pkg.discount));

  let highlighted = false;
  return packages.map((pkg) => {
    const recommended = !highlighted && pkg.discount === topDiscount;
    if (recommended) highlighted = true;
    return { ...pkg, recommended };
  });
}
