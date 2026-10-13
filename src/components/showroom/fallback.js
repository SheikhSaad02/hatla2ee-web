import BaseCard from '@/components/common/baseCard/baseCard';
import { CardContent } from '@/components/ui/card';
import TextWithIcon from '@/components/common/textWithIcon/textWithIcon';
import { NoShowroomIcon } from '@/icons/basicSvgs';
import { getTranslations, getLocale } from 'next-intl/server';

const FallBack = async ({ makeLabel, title, titleLabel, type }) => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });

  return (
    <section id={type} className="flex flex-col gap-4">
      <h2 className="sectionHeading mb-0">
        {makeLabel} {t(titleLabel)}
      </h2>
      <BaseCard className="bg-gradient-to-b from-blue-50 to-white">
        <CardContent className="p-4 lg:p-5 bg-[url(/assets/showroomsMap.webp)] bg-no-repeat bg-[length:270px_101px] bg-top-right rounded-xl flex flex-col items-center justify-center min-h-[150px]">
          <TextWithIcon
            icon={<NoShowroomIcon size={24} />}
            title={t(title)}
            titleClassName="text-medium font-thin"
            className="text-gray-700 gap-1"
          />
        </CardContent>
      </BaseCard>
    </section>
  );
};

export default FallBack;
