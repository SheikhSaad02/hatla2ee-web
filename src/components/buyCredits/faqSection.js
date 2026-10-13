'use client';

import { useTranslations } from 'next-intl';
import FaqRowList from '@/components/common/faqRow/faqRowList';

export default function FaqSection() {
  const t = useTranslations('buyCredits');

  const items = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    question: t(`faq.q${n}`),
    answer: t(`faq.a${n}`),
  }));

  return (
    <section id="faq" className="relative scroll-mt-28">
      <div className="py-16 lg:py-24">
        <FaqRowList heading={t('faq.heading')} items={items} />
      </div>
    </section>
  );
}
