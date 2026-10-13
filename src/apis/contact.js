import { apiClient } from '@/services/network/api-client';

export async function submitContact(body) {
    const payload = {
      contact_us: {
        topic: body?.subject || '',
        email: body?.email || '',
        message: body?.message || '',
        phone_number: body?.phone || '',
      },
    };
    const res = await apiClient.post('/api/surge/consumer/contact_us', payload);
    return res;
} 