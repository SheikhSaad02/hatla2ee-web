import { getAsset } from '@/utils/general';
import { Calendar, Pencil, Trash2 } from 'lucide-react';

export const GARAGE_CAR_MENU_ACTIONS = [
  { id: 'edit', icon: Pencil, variant: 'primary', labelKey: 'edit_car' },
  { id: 'remove', icon: Trash2, variant: 'danger', labelKey: 'remove_car' },
];

export const COMPLETION_OPTIONS = [
  { slug: 'yes', label: 'yes' },
  { slug: 'no', label: 'no' },
];

export const REMINDER_OPTIONS = [
  { slug: '3', label: 'reminder_3_months' },
  { slug: '6', label: 'reminder_6_months' },
  { slug: '12', label: 'reminder_12_months' },
  { slug: 'custom', label: 'select_date', icon: Calendar },
];

export async function getCarMaintenanceFeaturesData(locale) {
  const { getTranslations } = await import('next-intl/server');
  const t = await getTranslations({ locale, namespace: 'carMaintenance' });

  return {
    sectionTitle: t('features_title'),
    items: [
      {
        id: 'services',
        title: t('feature_services_title'),
        description: t('feature_services_description'),
        image: getAsset('/assets/more/trackServices.webp'),
        imageArabic: getAsset('/assets/more/trackServicesAr.webp'),
        bgColor: '#F7F9FA',
      },
      {
        id: 'reminders',
        title: t('feature_reminders_title'),
        description: t('feature_reminders_description'),
        image: getAsset('/assets/more/reminders.webp'),
        imageArabic: getAsset('/assets/more/remindersAr.webp'),
        bgColor: '#F7F9FA',
      },
      {
        id: 'cars',
        title: t('feature_cars_title'),
        description: t('feature_cars_description'),
        image: getAsset('/assets/more/multipleCars.webp'),
        bgColor: '#F7F9FA',
      },
      {
        id: 'service-types',
        title: t('feature_service_types_title'),
        description: t('feature_service_types_description'),
        image: getAsset('/assets/more/carParts.webp'),
        bgColor: '#F4F9FB',
      },
    ],
  };
}

export async function getCarMaintenanceStepsData(locale) {
  const { getTranslations } = await import('next-intl/server');
  const t = await getTranslations({ locale, namespace: 'carMaintenance' });
  const isArabic = locale === 'ar';

  return {
    title: t('how_it_works'),
    steps: [
      {
        id: 1,
        stepNumber: '1',
        title: t('step_1_title'),
        description: t('step_1_description'),
        image: getAsset(
          isArabic
            ? '/assets/maintenance-steps/add-car-ar.webp'
            : '/assets/maintenance-steps/add-car-en.webp',
        ),
        imageAlign: 'bottom',
      },
      {
        id: 2,
        stepNumber: '2',
        title: t('step_2_title'),
        description: t('step_2_description'),
        image: getAsset(
          isArabic
            ? '/assets/maintenance-steps/add-service-ar.webp'
            : '/assets/maintenance-steps/add-service-en.webp',
        ),
        imageAlign: 'bottom',
      },
      {
        id: 3,
        stepNumber: '3',
        title: t('step_3_title'),
        description: t('step_3_description'),
        image: getAsset(
          isArabic
            ? '/assets/maintenance-steps/get-notified-ar.webp'
            : '/assets/maintenance-steps/get-notified-en.webp',
        ),
        imageAlign: 'top',
      },
    ],
  };
}

export async function getCarMaintenanceFaqItems(locale) {
  const { getTranslations } = await import('next-intl/server');
  const t = await getTranslations({ locale, namespace: 'carMaintenance' });

  return {
    sectionTitle: t('faqs_title'),
    items: [
      {
        id: 'track-repairs',
        trigger: t('faq_1_question'),
        content: t('faq_1_answer'),
      },
      {
        id: 'electric-cars',
        trigger: t('faq_2_question'),
        content: t('faq_2_answer'),
      },
      {
        id: 'importance',
        trigger: t('faq_3_question'),
        content: t('faq_3_answer'),
      },
      {
        id: 'schedules',
        trigger: t('faq_4_question'),
        content: t('faq_4_answer'),
      },
      {
        id: 'free-service',
        trigger: t('faq_5_question'),
        content: t('faq_5_answer'),
      },
      {
        id: 'missing-model',
        trigger: t('faq_6_question'),
        content: t('faq_6_answer'),
      },
    ],
  };
}
