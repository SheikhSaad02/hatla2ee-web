'use client';

import {
  Area,
  CartesianGrid,
  AreaChart as Chart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CustomTooltip from './customToolTip';
import { useLocale } from 'next-intl';
import { useIsMobile } from '@/providers/isMobile';

export default function LineChart({ data, tooltipProps = {} }) {
  const locale = useLocale();
  const isMob = useIsMobile() ?? false;

  return (
    data && (
      <div style={{ width: '100%', height: isMob ? 200 : 400 }}>
        <ResponsiveContainer>
          <Chart
            data={data}
            margin={
              isMob
                ? { top: 20, right: 10, left: 10, bottom: 20 }
                : { top: 50, right: 35, left: 35, bottom: 50 }
            }
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#F0F0F0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tickMargin={isMob ? 10 : 25}
              tick={{
                fontSize: isMob ? 10 : 12,
                textAnchor: locale === 'ar' ? 'start' : 'middle',
              }}
            />
            <YAxis
              orientation={locale === 'ar' ? 'right' : 'left'}
              axisLine={false}
              tickLine={false}
              tickMargin={isMob ? 5 : 25}
              tick={{ fontSize: isMob ? 10 : 12, textAnchor: 'end' }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              content={<CustomTooltip {...tooltipProps} />}
              wrapperStyle={{ outline: 'none' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#lineGradient)"
              dot={false}
            />
          </Chart>
        </ResponsiveContainer>
      </div>
    )
  );
}
