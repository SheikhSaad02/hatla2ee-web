'use client';

import {
  PieChart as Chart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import CustomTooltip from '../lineChart/customToolTip';
import { useIsMobile } from '@/providers/isMobile';

export default function PieChart({ data, tooltipProps = {} }) {
  const isMob = useIsMobile() ?? false;
  return (
    data && (
      <div className="w-full h-[85px] md:h-[100px]">
        <ResponsiveContainer>
          <Chart>
            <Pie
              data={data}
              cy={'105%'}
              startAngle={180} // makes semi-circle
              endAngle={0}
              innerRadius={isMob ? 60 : 80}
              outerRadius={isMob ? 80 : 100}
              paddingAngle={4}
              dataKey="value"
              animationDuration={300}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip {...tooltipProps} />}
              wrapperStyle={{ outline: 'none' }}
            />
          </Chart>
        </ResponsiveContainer>
      </div>
    )
  );
}
