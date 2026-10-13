import { apiClient } from '@/services/network/api-client';

export async function vaildateOtp(payload) {
  try {
    const res = await apiClient.post(
      '/api/surge/auth/validate_otp',
      JSON.stringify(payload),
      {
        credentials: 'include',
      },
    );
    return res;
  } catch (error) {
    return { error: 'Failed to fetch OTP response' };
  }
}
