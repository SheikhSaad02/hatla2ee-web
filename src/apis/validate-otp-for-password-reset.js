import { apiClient } from '@/services/network/api-client';

export async function validateOtpForResetPassword(payload) {
  try {
    const res = await apiClient.post(
      '/api/surge/auth/validate_otp_for_reset',
      payload,
    );
    return res;
  } catch (error) {
    return { error: 'Failed to fetch OTP response' };
  }
}
