'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/utils';

// Deliberately not built on the shared `Accordion` (src/components/common/accordian):
// that primitive's clickable header is a plain <div onClick> with no keyboard
// support, and its bordered-card look doesn't match the numbered-row design
// this component renders. This is a real <button> so it stays keyboard/AT
// accessible.
export default function FaqRow({ index, question, answer, onOpen }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) onOpen?.();
  };

  return (
    <div className="relative border-t border-gray-200 last:border-b">
      <div className="flex w-full items-center gap-5">
        <p className="w-7 shrink-0 text-sm font-medium tabular-nums text-gray-500">
          {String(index + 1).padStart(2, '0')}.
        </p>
        <h3 className="flex-1">
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={open}
            className="flex w-full cursor-pointer items-center gap-5 py-6 text-start"
          >
            <span className="flex-1 text-base font-semibold leading-6 text-gray-900 lg:text-lg">
              {question}
            </span>
            <Plus
              aria-hidden="true"
              className={cn(
                'size-5 shrink-0 text-gray-400 transition-transform duration-300',
                open && 'rotate-45',
              )}
            />
          </button>
        </h3>
      </div>
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 ps-12 text-sm leading-6 text-gray-500">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
