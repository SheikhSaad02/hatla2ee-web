'use client';

import { format, parseISO } from 'date-fns';
import { CalendarDays } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Label from '@/components/common/label';
import { cn } from '@/utils';

/** shadcn Date Picker — https://ui.shadcn.com/docs/components/radix/date-picker */
export function DatePicker({
  date,
  setDate,
  id,
  placeholder = 'Pick a date',
  className,
  disabled,
  calendarProps,
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            'flex h-[46px] w-full items-center rounded-lg border bg-white px-3 text-sm font-normal shadow-none focus-visible:border-primary-600 focus-visible:shadow-sm focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
            date ? 'text-gray-800' : 'text-gray-400',
            className,
          )}
        >
          <span className="w-full truncate text-start">
            {date ? format(date, 'PPP') : placeholder}
          </span>
          <CalendarDays className="ms-2 size-4 shrink-0 text-gray-light" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="z-[100] w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
          initialFocus
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}

/** Same label / error layout as `common/input`. Value is YYYY-MM-DD for the API. */
export function DatePickerField({
  value,
  onChange,
  onBlur,
  inputTitle,
  inputTitleClassName,
  labelExtra,
  errorMsg,
  showError = false,
  placeholder,
  disabled,
  min,
  max,
  className,
  containerClassName,
  id,
}) {
  const date = value ? parseISO(value) : undefined;

  const setDate = (next) => {
    onChange?.(next ? format(next, 'yyyy-MM-dd') : '');
    onBlur?.();
  };

  return (
    <div className={cn('relative flex flex-col', containerClassName)}>
      {(inputTitle || labelExtra) && (
        <div className="mb-2 flex gap-1">
          {inputTitle && (
            <Label className={cn('gap-1 fs-body', inputTitleClassName)}>
              {inputTitle}
            </Label>
          )}
          {labelExtra}
        </div>
      )}
      <div className="w-full">
        <DatePicker
          id={id}
          date={date}
          setDate={setDate}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(errorMsg && 'border-destructive', className)}
          calendarProps={{
            disabled:
              min || max
                ? (day) => {
                  if (min && day < parseISO(min)) return true;
                  if (max && day > parseISO(max)) return true;
                  return false;
                }
                : undefined,
          }}
        />
      </div>
      {errorMsg && showError && (
        <p className="mt-1 text-sm text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}

export default DatePicker;
