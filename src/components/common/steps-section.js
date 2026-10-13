'use client';

import { useMemo, useState } from 'react';

import BaseCard from '@/components/common/baseCard/baseCard';
import {
  MAINTENANCE_STEPS_MEDIA_PANEL_CLASS,
  MAINTENANCE_STEPS_STEP_CARD_CLASS,
} from '@/components/car-maintenance/styles';
import NextImage from '@/components/common/nextImage';
import Text from '@/components/common/text';
import { cn } from '@/utils';

export default function StepsSection({ title, steps = [], className }) {
  const [selectedId, setSelectedId] = useState(steps?.[0]?.id);

  const selectedStep = useMemo(
    () => steps.find((step) => step.id === selectedId) || steps[0] || null,
    [steps, selectedId],
  );

  if (!selectedStep) {
    return null;
  }

  return (
    <section
      className={cn(
        'grid gap-4 lg:grid-cols-[minmax(0,610px)_1fr] lg:grid-rows-[auto_minmax(340px,auto)] lg:gap-6',
        className,
      )}
    >
      <h2 className="sectionHeading lg:col-span-2">{title}</h2>

      <div className="flex w-full flex-col gap-3 max-lg:mx-auto max-lg:max-w-[343px] max-lg:justify-start lg:h-[340px] lg:max-w-[610px] lg:justify-between lg:gap-0">
        {steps.map((step) => {
          const isActive = step.id === selectedStep.id;

          return (
            <BaseCard
              key={step.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(step.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedId(step.id);
                }
              }}
              className={cn(
                MAINTENANCE_STEPS_STEP_CARD_CLASS,
                isActive ? 'bg-primary-50' : 'bg-white',
              )}
            >
              <span
                className={cn(
                  'row-span-2 flex size-9 items-center justify-center rounded-lg text-sm font-bold lg:size-[60px] lg:text-[20px]',
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-primary-50 text-primary',
                )}
              >
                {step.stepNumber}
              </span>
              <Text
                weight="semibold"
                className={cn(
                  'min-w-0 text-[14px] leading-tight lg:text-xl lg:leading-snug',
                  isActive ? 'text-primary' : 'text-gray-900',
                )}
              >
                {step.title}
              </Text>
              <Text
                as="p"
                className="min-w-0 text-[12px] font-normal leading-tight text-gray-600 lg:text-base lg:leading-5"
              >
                {step.description}
              </Text>
            </BaseCard>
          );
        })}
      </div>

      <div
        className={cn(
          MAINTENANCE_STEPS_MEDIA_PANEL_CLASS,
          'flex justify-center',
          selectedStep.imageAlign === 'bottom'
            ? 'items-end pt-5 lg:pt-8'
            : 'items-start pb-5 lg:pb-8',
        )}
      >
        {selectedStep.image ? (
          <NextImage
            key={selectedStep.image}
            src={selectedStep.image}
            alt={selectedStep.title}
            width={242}
            height={310}
            className="max-h-full w-auto max-w-full"
          />
        ) : null}
      </div>
    </section>
  );
}
