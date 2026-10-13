import { apiClient } from '@/services/network/api-client';

export async function submitFinanceForm(values) {
  try {
    const { price, email, car_detail } = values || {};
    const payload = {
      lead: {
        price,
        installment_period: Number(values?.year) * 12,
        deposit: Number(values?.deposit_amount),
        user_name: values?.name,
        user_phone: values?.phone,
        lead_type: values?.condition === 'new' ? 'new_car' : 'used_car',
        email,
        make_id: car_detail?.brand,
        model_id: car_detail?.model,
        year: car_detail?.year,
        campaign_id: values?.campaign_id,
      },
    };

    const res = await apiClient.post(
      '/api/surge/consumer/finance_leads',
      payload,
      {
        headers: {
          lang: values?.locale,
        },
      },
    );

    return res;
  } catch (error) {
    return { error: 'Failed to Submit' };
  }
}
