'use client';

import { ChevronDown, Info } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import Alert from '@/components/common/alert/alert';
import { DatePickerField } from '@/components/common/datePicker';
import Input from '@/components/common/input/input';
import Label from '@/components/common/label';
import NextImage from '@/components/common/nextImage';
import Text from '@/components/common/text';
import FilterCheckBox from '@/filters/components/filterCheckBox';
import Select from '@/components/common/select/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import {
  COMPLETION_OPTIONS,
  REMINDER_OPTIONS,
} from '@/components/car-maintenance/data';
import {
  MAINTENANCE_FIELD_CELL,
  MAINTENANCE_FIELD_PROPS,
  MAINTENANCE_FORM_GRID_CLASS,
  MAINTENANCE_SELECT_PROPS,
} from '@/components/car-maintenance/styles';
import { formatDate } from '@/utils/date';
import { getAsset } from '@/utils/general';
import { cn } from '@/utils';

const ADD_SERVICE_MWEB_BANNER = getAsset(
  '/assets/add-service-mweb-banner.webp',
);

function AddServiceMobileBanner({ carName }) {
  const t = useTranslations('carMaintenance');

  return (
    <div className="relative h-[120px] w-full shrink-0 overflow-hidden bg-[#EDF4FF] flipX">
      <NextImage
        src={ADD_SERVICE_MWEB_BANNER}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-y-0 start-0 rtl:start-auto rtl:end-0 z-10 flex max-w-[70%] flex-col items-start justify-center px-4 text-start flipX">
        <Text className="w-full text-start text-base font-semibold text-gray-900">
          {t('add_service_modal_title')}
        </Text>
        <Text className="mt-1 line-clamp-4 w-full text-start text-sm text-gray-500">
          {t('add_service_modal_subtitle', { carName })}
        </Text>
      </div>
    </div>
  );
}

function CompletionStatusField({ form, onStatusChange }) {
  const t = useTranslations('carMaintenance');

  return (
    <FormField
      control={form.control}
      name="completion_status"
      render={({ field }) => (
        <FormItem className={cn(MAINTENANCE_FIELD_CELL, 'flex flex-col gap-2')}>
          <Label className="fs-body">{t('service_completed')}</Label>
          <FormControl>
            <FilterCheckBox
              options={COMPLETION_OPTIONS}
              getOptionLabel={(option) => t(option.label)}
              value={
                field.value
                  ? [
                      COMPLETION_OPTIONS.find(
                        (opt) => opt.slug === field.value,
                      ),
                    ].filter(Boolean)
                  : []
              }
              onChange={(opt) =>
                onStatusChange(opt?.slug ?? null, field.onChange)
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ReminderFields({ form, reminder, reminderDate, todayIso, disabled }) {
  const t = useTranslations('carMaintenance');
  const locale = useLocale();

  return (
    <>
      <FormField
        control={form.control}
        name="reminder"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FilterCheckBox
                options={REMINDER_OPTIONS}
                getOptionLabel={(option) => t(option.label)}
                renderItem={({ option, isChecked }) => {
                  const Icon = option.icon;
                  return (
                    <span className="flex items-center gap-1.5">
                      {Icon && (
                        <Icon
                          className={cn(
                            'size-4 shrink-0',
                            isChecked ? 'text-primary' : 'text-gray-500',
                          )}
                        />
                      )}
                      {t(option.label)}
                    </span>
                  );
                }}
                value={
                  field.value
                    ? [
                        REMINDER_OPTIONS.find(
                          (opt) => opt.slug === field.value,
                        ),
                      ].filter(Boolean)
                    : []
                }
                onChange={(opt) => {
                  field.onChange(opt?.slug ?? null);
                  if (opt?.slug !== 'custom') {
                    form.setValue('schedule_next_service_date', '');
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {reminder === 'custom' && (
        <FormField
          control={form.control}
          name="schedule_next_service_date"
          render={({ field }) => (
            <FormItem className={MAINTENANCE_FIELD_CELL}>
              <FormControl>
                <DatePickerField
                  {...field}
                  {...MAINTENANCE_FIELD_PROPS}
                  min={todayIso}
                  placeholder={t('select_date')}
                  inputTitle={t('reminder_date')}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {reminderDate && (
        <Alert
          variant="default"
          icon={<Info className="size-4 text-primary" />}
          description={t('reminder_on', {
            date: formatDate(
              reminderDate,
              { month: 'short', day: 'numeric', year: 'numeric' },
              locale,
            ),
          })}
          className="border-primary-100 bg-primary-50 text-primary [&_[data-slot=alert-description]]:text-primary"
        />
      )}
    </>
  );
}

export default function AddServiceForm({ car, isMobile, addService }) {
  const t = useTranslations('carMaintenance');
  const {
    form,
    isEdit,
    isCompleted,
    isNotCompleted,
    isOtherService,
    reminder,
    reminderDate,
    scheduleNextServiceEnabled,
    serviceTypeOptions,
    currencyLabel,
    todayIso,
    onSubmit,
    handleCompletionStatusChange,
    handleScheduleToggle,
    stripDigits,
    stripDecimal,
  } = addService;

  return (
    <>
      {isMobile && !isEdit && (
        <AddServiceMobileBanner carName={car.displayName} />
      )}
      <div className={cn(isMobile && 'p-4')}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-7"
          >
            <div className={MAINTENANCE_FORM_GRID_CLASS}>
              <FormField
                control={form.control}
                name="service_type"
                render={({ field, fieldState }) => (
                  <FormItem className={MAINTENANCE_FIELD_CELL}>
                    <FormControl>
                      <Select
                        defaultOptions={serviceTypeOptions}
                        value={field.value}
                        placeholder={t('select_service')}
                        getOptionValue={(opt) => opt?.value}
                        getOptionLabel={(opt) => opt?.label}
                        onSelect={(val) => {
                          if (isEdit) return;
                          field.onChange(val);
                          if (val?.value !== 'other') {
                            form.setValue('service_type_other', '');
                          }
                        }}
                        triggerProps={{
                          inputTitle: t('service_type'),
                          suffix: (
                            <ChevronDown className="h-4 w-4 text-gray-light" />
                          ),
                          className: cn(
                            MAINTENANCE_FIELD_PROPS.className,
                            isEdit && 'pointer-events-none opacity-60',
                          ),
                          inputClassName:
                            MAINTENANCE_FIELD_PROPS.inputClassName,
                          disabled: isEdit,
                          readOnly: true,
                          'aria-invalid': !!fieldState.error,
                        }}
                        containerClassName={
                          MAINTENANCE_SELECT_PROPS.containerClassName
                        }
                        allowSearch={false}
                        fullScreen={false}
                        popoverProps={{ avoidCollisions: false }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isOtherService ? (
                <FormField
                  control={form.control}
                  name="service_type_other"
                  render={({ field }) => (
                    <FormItem className={MAINTENANCE_FIELD_CELL}>
                      <FormControl>
                        <Input
                          {...field}
                          {...MAINTENANCE_FIELD_PROPS}
                          type="text"
                          placeholder={t('service_type_other_placeholder')}
                          inputTitle={t('service_type_other')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <CompletionStatusField
                  form={form}
                  onStatusChange={handleCompletionStatusChange}
                />
              )}

              {isOtherService && (
                <CompletionStatusField
                  form={form}
                  onStatusChange={handleCompletionStatusChange}
                />
              )}

              <FormField
                control={form.control}
                name="maintenance_service_cost"
                render={({ field }) => (
                  <FormItem className={MAINTENANCE_FIELD_CELL}>
                    <FormControl>
                      <Input
                        {...field}
                        {...MAINTENANCE_FIELD_PROPS}
                        inputMode="decimal"
                        placeholder={t('service_cost_placeholder')}
                        inputTitle={
                          isCompleted
                            ? t('maintenance_service_cost')
                            : `${t('maintenance_service_cost')} (${t('Optional')})`
                        }
                        suffix={
                          <Text className="text-xs italic text-gray-light">
                            {currencyLabel}
                          </Text>
                        }
                        onChange={(e) =>
                          field.onChange(stripDecimal(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="current_kms_driven"
                render={({ field }) => (
                  <FormItem className={MAINTENANCE_FIELD_CELL}>
                    <FormControl>
                      <Input
                        {...field}
                        {...MAINTENANCE_FIELD_PROPS}
                        inputMode="numeric"
                        placeholder={t('current_kms_placeholder')}
                        inputTitle={
                          isCompleted
                            ? t('service_done_at')
                            : `${t('current_kms_driven')} (${t('Optional')})`
                        }
                        suffix={
                          <Text className="text-xs italic text-gray-light">
                            {t('km_suffix')}
                          </Text>
                        }
                        onChange={(e) =>
                          field.onChange(stripDigits(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="next_service_due_at_km"
                render={({ field }) => (
                  <FormItem className={MAINTENANCE_FIELD_CELL}>
                    <FormControl>
                      <Input
                        {...field}
                        {...MAINTENANCE_FIELD_PROPS}
                        inputMode="numeric"
                        placeholder={t('next_service_km_placeholder')}
                        inputTitle={`${t('next_service_due_at')} (${t('Optional')})`}
                        suffix={
                          <Text className="text-xs italic text-gray-light">
                            {t('km_suffix')}
                          </Text>
                        }
                        onChange={(e) =>
                          field.onChange(stripDigits(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isCompleted && (
                <FormField
                  control={form.control}
                  name="service_completion_date"
                  render={({ field }) => (
                    <FormItem className={MAINTENANCE_FIELD_CELL}>
                      <FormControl>
                        <DatePickerField
                          {...field}
                          {...MAINTENANCE_FIELD_PROPS}
                          max={todayIso}
                          placeholder={t('select_date')}
                          inputTitle={t('service_completion_date')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {isCompleted && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="fs-body">
                    {t('schedule_next_service')}{' '}
                    <span className="font-normal text-gray-500">
                      ({t('Optional')})
                    </span>
                  </Label>
                  <Switch
                    checked={scheduleNextServiceEnabled}
                    onCheckedChange={handleScheduleToggle}
                  />
                </div>
                {scheduleNextServiceEnabled && (
                  <ReminderFields
                    form={form}
                    reminder={reminder}
                    reminderDate={reminderDate}
                    todayIso={todayIso}
                  />
                )}
              </div>
            )}

            {isNotCompleted && (
              <fieldset
                disabled={isEdit}
                className={cn(
                  'flex flex-col gap-3 border-0 p-0',
                  isEdit && 'opacity-60',
                )}
              >
                <Label className="fs-body">{t('set_reminder')}</Label>
                <ReminderFields
                  form={form}
                  reminder={reminder}
                  reminderDate={reminderDate}
                  todayIso={todayIso}
                  disabled={isEdit}
                />
              </fieldset>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
