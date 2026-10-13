import { z } from 'zod';

export const createMarkServiceDoneSchema = (t) =>
  z.object({
    maintenance_service_cost: z
      .string()
      .min(1, { message: t('service_cost_required') }),
    current_kms_driven: z
      .string()
      .min(1, { message: t('service_done_at_required') }),
    service_completion_date: z
      .string()
      .min(1, { message: t('service_completion_date_required') }),
  });
