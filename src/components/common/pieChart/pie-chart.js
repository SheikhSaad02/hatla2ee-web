'use client';

import dynamic from 'next/dynamic';

const PieChart = dynamic(() => import('./pie-chart-core'), { ssr: false });

export default PieChart;
