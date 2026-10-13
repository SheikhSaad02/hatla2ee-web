import { z } from 'zod';

const isOtherServiceType = (serviceType) => serviceType?.value === 'other';

export const createAddServiceSchema = (t) =>
  z
    .object({
      service_type: z.any().refine((value) => Boolean(value?.value), {
        message: t('service_type_required'),
      }),
      completion_status: z
        .union([z.literal('yes'), z.literal('no'), z.null(), z.undefined()])
        .refine((value) => value === 'yes' || value === 'no', {
          message: t('service_completed_required'),
        }),
      service_type_other: z.string().default(''),
      maintenance_service_cost: z.string().default(''),
      current_kms_driven: z.string().default(''),
      next_service_due_at_km: z.string().optional(),
      service_completion_date: z.string().optional(),
      reminder: z.string().nullable().optional(),
      schedule_next_service_date: z.string().optional(),
    })
    .refine(
      (data) =>
        !isOtherServiceType(data.service_type) ||
        Boolean(data.service_type_other?.trim()),
      {
        message: t('service_type_other_required'),
        path: ['service_type_other'],
      },
    )
    .refine(
      (data) =>
        data.completion_status !== 'yes' ||
        Boolean(data.maintenance_service_cost?.trim()),
      {
        message: t('service_cost_required'),
        path: ['maintenance_service_cost'],
      },
    )
    .refine(
      (data) =>
        data.completion_status !== 'yes' ||
        Boolean(data.current_kms_driven?.trim()),
      {
        message: t('service_done_at_required'),
        path: ['current_kms_driven'],
      },
    )
    .refine(
      (data) =>
        data.completion_status !== 'yes' ||
        Boolean(data.service_completion_date?.trim()),
      {
        message: t('service_completion_date_required'),
        path: ['service_completion_date'],
      },
    )
    .refine(
      (data) => data.completion_status !== 'no' || Boolean(data.reminder),
      {
        message: t('reminder_required'),
        path: ['reminder'],
      },
    )
    .refine(
      (data) =>
        !data.reminder ||
        data.reminder !== 'custom' ||
        Boolean(data.schedule_next_service_date?.trim()),
      {
        message: t('reminder_date_required'),
        path: ['schedule_next_service_date'],
      },
    );
