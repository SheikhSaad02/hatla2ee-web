import { getTranslations } from 'next-intl/server';
import { Check } from 'lucide-react';
import { isMobileServer } from '@/utils/serverFunctions';
import ProductTag from './productTag';
import ProductCostBox from './productCostBox';
import Text from '@/components/common/text';

export default async function ProductBlock({ product, pricing }) {
  const t = await getTranslations('buyCredits');
  const name = t(product.nameKey);
  const isMobile = await isMobileServer();

  return (
    <div
      id={`product-${product.id}`}
      className="relative flex flex-col justify-start lg:min-h-[max(520px,66vh)]"
    >
      {!isMobile && <ProductTag id={product.id} name={name} />}
      <Text
        as="h3"
        weight="semibold"
        className="text-xl tracking-tight text-gray-900 md:text-2xl lg:mt-4"
      >
        {t(product.headlineKey)}
      </Text>
      <Text
        as="p"
        className="mt-3 max-w-md text-base leading-relaxed text-gray-600"
      >
        {t(product.descKey)}
      </Text>
      <ProductCostBox
        price={pricing?.price}
        credits={pricing?.credits}
        productId={product.id}
        productName={name}
      />
      {product.points?.length > 0 && (
        <ul className="mt-5 max-w-md space-y-2.5">
          {product.points.map((pointKey) => (
            <li
              key={pointKey}
              className="flex items-start gap-2.5 text-sm text-gray-700"
            >
              <Check
                className="mt-0.5 size-4 shrink-0 text-primary"
                strokeWidth={3}
              />
              <span>{t(pointKey)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
