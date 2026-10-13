import { mapCampaignsToActions } from '@/mappers/leadCampaigns';
import { apiClient } from '@/services/network/api-client';

export async function fetchLeadCampaigns(entityType, entityId) {
  const res = await apiClient.get(
    `/api/surge/consumer/campaigns?f[entity_type]=${entityType}&f[entity_id]=${entityId}`,
  );

  return res?.error ? res : mapCampaignsToActions(res?.campaigns || []);
}

export async function submitLeadCampaign(payload) {
  const { campaignId, mobile, name, metadata } = payload;

  const requestPayload = {
    lead: {
      entity_type: 'campaign',
      entity_id: campaignId,
      mobile,
      name,
      metadata: {
        source: metadata?.source || 'detail',
        id: metadata?.listingId,
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        make: metadata?.make,
        model: metadata?.model,
        year: metadata?.year,
      },
    },
  };

  const res = await apiClient.post('/api/surge/consumer/leads', requestPayload);

  return res;
}
