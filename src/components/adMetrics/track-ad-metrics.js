'use client';
import { adMetricsService } from '@/services/mertrics/adMetrics';
import { useEffect } from 'react';

const TrackAdMetrics = ({ adMetrics, type = 'view' }) => {
  useEffect(() => {
    adMetricsService.handleAdMetrics(type, adMetrics);
  }, [adMetrics]);
  return null;
};

export default TrackAdMetrics;
