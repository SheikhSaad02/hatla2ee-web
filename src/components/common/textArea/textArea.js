import React from 'react';
import { Textarea as TextAreaComponent } from '@/components/ui/textarea';
import { cn } from '@/utils';

const TextArea = ({
  className,
  containerClassName,
  inputTitle,
  inputDescription,
  prefix,
  suffix,
  ...props
}) => {
  return (
    <div className={cn('relative flex flex-col')}>
      {inputTitle && inputTitle}
      <div className="flex items-center p-2 border bg-white rounded-lg focus-within:shadow-sm focus-within:border-primary-600">
        {prefix && (
          <div className="flex items-center justify-center">{prefix}</div>
        )}
        <TextAreaComponent
          className={cn(
            'focus-visible:ring-0 border-0 flex-1 bg-transparent',
            className,
          )}
          placeholder="Type your message here..."
          {...props}
        />
        {suffix && (
          <div className="flex items-center justify-center">{suffix}</div>
        )}
      </div>
      {inputDescription && inputDescription}
    </div>
  );
};

export default TextArea;
