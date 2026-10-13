import { apiCacheConfig } from '@/configs/cacheConfig';
import { BASE_URL } from '@/constants';
import { cache } from 'react';

export const fetchCarNews = cache(async (locale = 'ar') => {
  let carNews = null;
  try {
    const response = await fetch(
      `${BASE_URL}/news/wp-json/hatla2eeapi/v2/latest?lang=${locale}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Hatla2ee-News-Api-Auth': process.env.HATLA2EE_NEWS_AUTH,
        },
        next: apiCacheConfig.carNews,
      },
    );
    if (response?.ok) {
      carNews = await response.json();
    }
    return carNews;
  } catch (error) {
    console.log('error in car news', error);
    return carNews;
  }
});
