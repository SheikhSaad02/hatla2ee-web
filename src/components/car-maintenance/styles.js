import { MAINTENANCE_CARD_STATES } from '@/mappers/maintenanceLogsDisplay';
import { cn } from '@/utils';

export const GARAGE_CARD_CLASS =
  'box-border  md:h-[248px] w-full max-w-[592px]';

export const GARAGE_ACTION_BTN_CLASS = cn(
  'flex-1 rounded-lg bg-primary-100 text-primary',
  'disabled:bg-primary-100 disabled:text-primary disabled:opacity-60',
);

export const GARAGE_ADD_SERVICE_BTN_CLASS = cn(
  'flex-1 rounded-lg border border-primary-500',
  'disabled:bg-primary-100 disabled:text-primary disabled:opacity-60',
);

export const GARAGE_ACTIONS_MENU_BTN_CLASS = cn(
  'flex-1 w-full !bg-primary-50 text-gray-800',
);

export const MAINTENANCE_PANEL_BORDER_CLASS = 'md:border md:border-[#F0F0F0]';

export const MAINTENANCE_SERVICE_TITLE_CLASS =
  'text-base font-semibold text-gray-900';

export const MAINTENANCE_DATE_PILL_CLASS = {
  [MAINTENANCE_CARD_STATES.upcoming]: 'bg-amber-50 text-amber-600',
  [MAINTENANCE_CARD_STATES.overdue]: 'bg-red-50 text-red-600',
  [MAINTENANCE_CARD_STATES.completed]: 'bg-green-50 text-green-600',
};

export const MAINTENANCE_STATUS_BADGE_CLASS = {
  [MAINTENANCE_CARD_STATES.overdue]: MAINTENANCE_DATE_PILL_CLASS.overdue,
  [MAINTENANCE_CARD_STATES.upcoming]: MAINTENANCE_DATE_PILL_CLASS.upcoming,
};

export const MAINTENANCE_DATE_TEXT_CLASS = {
  [MAINTENANCE_CARD_STATES.overdue]: 'text-red-600',
  [MAINTENANCE_CARD_STATES.upcoming]: 'text-amber-600',
};

export const MAINTENANCE_FIELD_CLASS =
  'h-[46px] w-full max-w-full md:w-[306px] md:max-w-[306px]';

export const MAINTENANCE_FIELD_PROPS = {
  className: MAINTENANCE_FIELD_CLASS,
  containerClassName: 'w-full max-w-full md:w-[306px] md:max-w-[306px]',
  inputClassName: 'text-sm',
};

export const MAINTENANCE_SELECT_PROPS = {
  containerClassName: 'w-full max-w-full md:w-[306px] md:max-w-[306px] text-sm',
};

export const MAINTENANCE_FIELD_CELL =
  'w-full max-w-full md:w-[306px] md:max-w-[306px]';

export const MAINTENANCE_FORM_GRID_CLASS =
  'grid grid-cols-1 gap-y-4 md:grid-cols-2 gap-x-6 lg:gap-x-10 lg:gap-y-7';

export const MAINTENANCE_STEPS_MEDIA_PANEL_CLASS =
  'relative w-full overflow-hidden rounded-2xl bg-primary-50 max-lg:mx-auto max-lg:h-[206px] max-lg:max-w-[343px] lg:h-[340px] lg:max-w-none';

export const MAINTENANCE_STEPS_STEP_CARD_CLASS =
  'grid h-[84px] w-full cursor-pointer grid-cols-[36px_1fr] grid-rows-[auto_auto] items-center gap-x-3 gap-y-0.5 overflow-hidden rounded-xl border border-primary-200 px-3 py-2 lg:h-[100px] lg:grid-cols-[60px_1fr] lg:gap-x-4 lg:gap-y-0 lg:px-5 lg:py-3';
