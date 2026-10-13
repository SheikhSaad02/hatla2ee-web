'use client';

import React from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export function OtpInput({
  length = 4,
  value,
  onChange,
  className,
  containerClassName,
}) {
  return (
    <InputOTP
      maxLength={length}
      value={value}
      onChange={(val) => onChange(val)}
      pattern={/^[0-9]*$/}
      className={className}
      containerClassName={containerClassName}
    >
      <InputOTPGroup>
        {Array.from({ length }).map((_, idx) => (
          <InputOTPSlot key={idx} index={idx} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
