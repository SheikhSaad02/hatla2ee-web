import { getTranslations } from 'next-intl/server';
import ProductTag from './productTag';
import Text from '@/components/common/text';
import { formatNumberValue } from '@/utils/numbers';

export default async function ProductCostBox({
  price,
  credits,
  productId,
  productName,
}) {
  const t = await getTranslations('buyCredits');
  if (!price || !credits) return null;

  return (
    <div className="my-8">
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/[0.06]">
        <div className="flex items-center justify-between gap-2.5 bg-gray-100 px-4 py-3">
          <Text weight="medium" className="text-sm text-gray-900 md:text-base">
            {t('products.costNote')}
          </Text>
          {productId && (
            <ProductTag
              id={productId}
              name={productName}
              className="self-auto"
            />
          )}
        </div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 bg-surface-lightest px-4 py-5">
          <Text
            weight="medium"
            className="text-xl text-gray-500 line-through decoration-2 decoration-red-500 md:text-2xl"
          >
            {formatNumberValue(price)} {t('products.egp')}
          </Text>
          <span className="flex items-baseline gap-1.5">
            <Text
              weight="semibold"
              className="text-2xl leading-none tracking-tight text-gray-900 md:text-[28px]"
            >
              {formatNumberValue(credits)}
            </Text>
            <Text
              weight="medium"
              className="text-base text-gray-500 md:text-xl"
            >
              {t('products.creditsLabel')}
            </Text>
          </span>
        </div>
      </div>
      <Text as="p" className="mt-2 text-xs text-gray-500 md:text-sm">
        {t('products.costFooter')}
      </Text>
    </div>
  );
}
