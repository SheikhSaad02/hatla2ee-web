import { apiClient } from '@/services/network/api-client';
import { getRecaptchaTokenHeader } from '@/utils/general';

export async function resendOtp(payload, token, locale) {
  try {
    const res = await apiClient.post(
      '/api/surge/auth/resend_otp',
      JSON.stringify(payload),
      {
        headers: {
          ...getRecaptchaTokenHeader(token),
          lang: locale,
        },
        credentials: 'include',
      },
    );
    return res;
  } catch (error) {
    return { error: 'Failed to fetch OTP response' };
  }
}
