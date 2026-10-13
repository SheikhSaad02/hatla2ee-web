import { apiClient } from '@/services/network/api-client';

export async function fetchReportAdReasons() {
  const res = await apiClient.get(
    `/api/surge/consumer/generics/reasons?f[reason_type]=ad_complaint`,
  );

  if (!res.reasons?.length) {
    return null;
  }

  return res?.reasons?.map((reason) => ({
    ...reason,
    label: reason?.name,
    label_l1: reason?.name_l1,
    value: reason?.id,
    slug: reason?.slug,
  }));
}

export async function reportAnAd(payload, id) {
  const res = await apiClient.post(
    `/api/surge/consumer/listings/${id}/report_ad`,
    payload,
  );
  return res;
}
