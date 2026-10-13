'use client';

import InternalServerError from '@/components/common/errors/internalServerError';
import { ApiError } from '@/services/network/api-error';

export default function Error({ error, reset }) {
  const getData = () => {
    let parsed = null;
    try {
      parsed = error?.message ? JSON.parse(error.message) : null;
    } catch (_) {
      parsed = null;
    }

    const isApiError =
      error instanceof ApiError || parsed?.__type === 'ApiError';
    const status =
      parsed?.status ?? (error instanceof ApiError ? error.status : undefined);
    const title =
      parsed?.statusText ??
      (error instanceof ApiError ? error.statusText : undefined) ??
      'Something went wrong';
    const message =
      parsed?.message ?? error?.message ?? 'An unexpected error occurred.';
    const details = parsed?.data ?? (isApiError ? error?.data ?? null : null);

    return {
      title,
      message,
      status,
      detailsJson: details ? JSON.stringify(details, null, 2) : null,
    };
  };

  const { title, message, status, detailsJson } = getData();

  if (status === 500) {
    return <InternalServerError />;
  }

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-5 py-10 text-center">
      <div className="flex flex-col items-center gap-2">
        {status ? (
          <span className="inline-flex items-center rounded-md bg-danger-300 px-2 py-1 text-sm font-semibold text-danger-700">
            {status}
          </span>
        ) : null}
        <h3 className="sectionHeading m-0">{title}</h3>
      </div>

      <p className="max-w-prose text-gray">{message}</p>

      {detailsJson ? (
        <pre className="w-full max-w-3xl overflow-auto rounded-md border bg-muted p-4 text-left text-xs text-gray-600">
          {detailsJson}
        </pre>
      ) : null}
    </div>
  );
}
