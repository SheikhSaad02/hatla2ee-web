export function mapCampaignsToActions(campaigns) {
  if (!campaigns || !Array.isArray(campaigns)) return [];

  return campaigns
    ?.map((campaign) => {
      if (!campaign) return null;

      return {
        id: campaign?.id,
        ctaId: campaign?.cta?.id,
        title: campaign?.cta?.title,
        title_l1: campaign?.cta?.title_l1,
        slug: campaign?.cta?.slug,
      };
    })
    ?.filter(Boolean);
}
