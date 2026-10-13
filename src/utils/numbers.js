import configs from '@/configs';

export function formatNumberValue(value) {
  const number = Number(value);
  if (isNaN(number)) return '-';

  const hasFraction = number % 1 !== 0;
  const fractionDigits = hasFraction ? 2 : 0;

  return new Intl.NumberFormat({
    style: 'decimal',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(number);
}

export function formatNumberWithUnit(value, unit = '') {
  const formattedNumber = new Intl.NumberFormat().format(value);
  const safeUnit = typeof unit === 'string' ? unit.toUpperCase() : '';
  return `${formattedNumber} ${safeUnit}`;
}

export function formatNumberWithPrice(
  value,
  lang = 'en',
  appendCurrency = true,
  formatter,
) {
  const formatterFunction = formatter ?? formatNumberValue;
  const number = formatterFunction(value);
  const currency = configs.currency[lang].label;
  return appendCurrency ? `${number} ${currency}` : number;
}

export function formatPriceRange( // rename to be more generic
  min,
  max,
  lang,
  formatter,
  appendCurrency = true,
) {
  if (!min && !max) return null;
  if (min === max) return max;
  const formatNumber = formatter || formatNumberWithPrice;
  if (!min) return formatNumber(max, lang, appendCurrency);
  if (!max) return formatNumber(min, lang, appendCurrency);
  return `${formatNumber(min, lang, false)} - ${formatNumber(
    max,
    lang,
    false, //make it dynamic when a range with currency is needed
  )}`;
}
export const onWhatsappClick = (phone, message) => {
  if (!phone) return;

  const formatterNumber = phone.replace(/^0/, '20');
  const url = message
    ? `https://wa.me/${formatterNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${formatterNumber}`;

  window.open(url, '_blank');
};

export const onPhoneClick = (phone, setShowNumberModal) => {
  if (phone) {
    setShowNumberModal(true);
  }
};
