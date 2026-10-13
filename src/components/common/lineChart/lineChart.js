'use client';

import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('./lineChart-core'), { ssr: false });

export default LineChart;
