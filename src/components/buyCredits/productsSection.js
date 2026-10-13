import { getTranslations } from 'next-intl/server';
import { cn } from '@/utils';
import { isMobileServer } from '@/utils/serverFunctions';
import Container from '@/components/layout/container';
import { getAdProducts } from './data';
import { fetchProductDiscounts } from '@/apis/packages';
import ProductBlock from './productBlock';
import { DevicePreview, InlineDevicePreview } from './devicePreview';
import ProductGlow from './productGlow';
import Text from '@/components/common/text';

export default async function ProductsSection() {
  const t = await getTranslations('buyCredits');
  const products = getAdProducts();
  const isMobile = await isMobileServer();
  const pricing = await fetchProductDiscounts();

  return (
    <section id="products" className="breakout relative scroll-mt-28">
      <ProductGlow products={products} />
      <Container className="relative z-10 py-16 lg:py-20">
        <Text
          as="h2"
          weight="semibold"
          className="max-w-2xl pb-3 text-[32px] leading-[1.1] tracking-tight text-gray-900 md:text-[40px]"
        >
          {t('products.heading')}
        </Text>
        {/* Split tied to the same isMobile that decides whether the sticky
            preview exists, or a mobile UA >=1024px gets an empty column. */}
        <div
          className={cn(
            'mt-14 grid grid-cols-1',
            !isMobile && 'lg:grid-cols-2 lg:gap-x-10 xl:gap-x-16',
          )}
        >
          {/* All the separation lives here so a preview stays closer to its own
              product than the next. At lg each block's min-height takes over. */}
          <div className="space-y-14 md:space-y-20 lg:space-y-0">
            {products.map((product) => (
              <div key={product.id}>
                <ProductBlock product={product} pricing={pricing[product.id]} />
                {isMobile && (
                  // Capped where the comp is cropped to two columns; the
                  // artwork (ad-grid 1672x2390) has headroom to fill wider.
                  <InlineDevicePreview
                    className="mt-5 xl:max-w-[470px] md:mt-6 md:max-w-none"
                    productId={product.id}
                  />
                )}
              </div>
            ))}
          </div>
          {!isMobile && (
            <div className="relative">
              <div className="sticky top-[clamp(64px,14vh,140px)]">
                <DevicePreview products={products} />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
