import { z } from 'zod';

import { hasValidCarSelection } from '@/mappers/userMaintenanceCars';

export const createAddCarSchema = (t) =>
  z.object({
    carSelection: z
      .any()
      .nullable()
      .refine((value) => hasValidCarSelection(value), {
        message: t('car_selection_required'),
      }),
    kms_driven: z.string().min(1, { message: t('total_driven_required') }),
    avg_daily_kms: z.string().optional(),
    location: z.any().nullable().optional(),
  });
