import { getTranslations } from 'next-intl/server';
import ShowroomsCarousel from './showroomsCarousel';
import Text from '@/components/common/text';

export default async function ShowroomsSection({ showrooms }) {
  if (!showrooms?.length) return null;

  const t = await getTranslations('buyCredits');

  return (
    <section id="showrooms" className="scroll-mt-28">
      <div className="py-16 lg:py-20">
        <Text
          as="h2"
          weight="semibold"
          className="text-[32px] leading-[1.1] tracking-tight text-gray-900 md:text-[40px]"
        >
          {t('showrooms.heading')}
        </Text>
        <ShowroomsCarousel showrooms={showrooms} />
      </div>
    </section>
  );
}
