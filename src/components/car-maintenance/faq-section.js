import { getCarMaintenanceFaqItems } from '@/components/car-maintenance/data';
import FaqAccordion from '@/components/common/faqAccordion/faqAccordion';
import { getLocale } from 'next-intl/server';

export default async function CarMaintenanceFaqSection() {
  const locale = await getLocale();
  const { sectionTitle, items } = await getCarMaintenanceFaqItems(locale);

  return (
    <section className="pb-8 md:pb-10">
      <h2 className="sectionHeading">{sectionTitle}</h2>
      <FaqAccordion items={items} />
    </section>
  );
}
