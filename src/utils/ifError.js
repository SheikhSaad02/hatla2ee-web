import { notFound } from 'next/navigation';
import { ApiError } from '@/services/network/api-error';

export const ifError = (data) => {
  if (data?.error) {
    const { message, status, statusText, data: extra } = data.error || {};
    // Serialize extra fields into the message so Next.js can transfer them to the client error boundary
    const serializedMessage = JSON.stringify({
      message,
      status,
      statusText,
      data: extra ?? null,
      __type: 'ApiError',
    });
    //if status 422 then show NotFound page
    if (status === 422) {
      notFound();
      return;
    } else {
      throw new ApiError({
        message: serializedMessage,
        status,
        statusText,
        data: extra ?? null,
      });
    }
  }
};
