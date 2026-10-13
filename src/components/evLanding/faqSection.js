import { getLocale } from 'next-intl/server';
import FaqAccordion from '@/components/common/faqAccordion/faqAccordion';
import { getEvFaqItems } from './data';

export default async function EvFaqSection() {
  const locale = await getLocale();
  const { sectionTitle, items } = await getEvFaqItems(locale);

  return (
    <section className="flex flex-col gap-3 md:gap-6">
      <h2 className="sectionHeading">{sectionTitle}</h2>
      <FaqAccordion items={items} trackFaqExpand />
    </section>
  );
}
