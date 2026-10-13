import { getTranslations } from 'next-intl/server';
import CreditsInfoCard from './creditsInfoCard';
import CreditsCoinVideo from './creditsCoinVideo';
import RevealOnScroll from './revealOnScroll';
import Text from '@/components/common/text';

const HEADING_CLASS =
  'text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-tight';

export default async function CreditsSection() {
  const t = await getTranslations('buyCredits');

  const cards = [
    { title: t('credits.card1Title'), copy: t('credits.card1Body') },
    { title: t('credits.card2Title'), copy: t('credits.card2Body') },
    { title: t('credits.card3Title'), copy: t('credits.card3Body') },
    { title: t('credits.card4Title'), copy: t('credits.card4Body') },
  ];

  return (
    <section id="credits" className="scroll-mt-28 [content-visibility:auto]">
      <div className="py-16 lg:py-24">
        <RevealOnScroll
          as="h2"
          className={`${HEADING_CLASS} pb-3 text-start text-gray-900 xl:text-center`}
        >
          {t.rich('credits.heading', {
            secondary: (chunks) => (
              <span className="text-secondary">{chunks}</span>
            ),
          })}
        </RevealOnScroll>

        <div className="mt-9 grid items-center gap-8 xl:mt-10 xl:grid-cols-[minmax(0,1fr)_268px_500px] xl:gap-6">
          <RevealOnScroll as="div" delayMs={150}>
            <Text
              as="h3"
              weight="bold"
              className="text-2xl tracking-tight text-gray-900"
            >
              {t('credits.subheading')}
            </Text>
            <Text
              as="p"
              className="mt-4 text-base leading-relaxed text-gray-600"
            >
              {t('credits.body')}
            </Text>
          </RevealOnScroll>

          <div className="flex justify-center">
            <CreditsCoinVideo className="aspect-square w-[240px] xl:w-full" />
          </div>

          <div className="relative grid gap-3 sm:auto-rows-fr sm:grid-cols-2 xl:auto-rows-auto xl:grid-cols-1 xl:gap-5">
            <span className="absolute start-0 top-[8%] hidden h-[84%] w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent xl:block" />
            <span className="absolute -start-6 top-1/2 hidden h-px w-6 bg-gradient-to-r from-primary/55 to-gray-300 rtl:bg-gradient-to-l xl:block" />
            {cards.map((card, index) => (
              <RevealOnScroll
                key={card.title}
                as="div"
                delayMs={280 + index * 140}
                className="flex xl:items-center"
              >
                <span className="hidden h-px w-[150px] shrink-0 bg-gradient-to-r from-gray-300 to-gray-200 rtl:bg-gradient-to-l xl:block" />
                <span className="hidden size-2 shrink-0 rounded-full bg-primary/70 xl:block" />
                <CreditsInfoCard
                  title={card.title}
                  copy={card.copy}
                  className="w-full xl:ms-3 xl:w-[300px] xl:shrink-0"
                />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
