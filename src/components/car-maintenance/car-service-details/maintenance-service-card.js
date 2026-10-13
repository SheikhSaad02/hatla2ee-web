'use client';

import { Badge } from '@/components/common/badge/badge';
import BaseCard from '@/components/common/baseCard/baseCard';
import Button from '@/components/common/button/button';
import StatGrid from '@/components/common/statGrid/statGrid';
import Text from '@/components/common/text';
import { MAINTENANCE_SERVICE_TITLE_CLASS } from '@/components/car-maintenance/styles';
import { cn } from '@/utils';

export default function MaintenanceServiceCard({
  title,
  description,
  meta,
  badge,
  actions,
  stats = [],
  gridCols = 2,
  gridWrapperClassName,
  gridCellClassName,
  cardClassName,
  bodyClassName,
  footer,
}) {
  const MetaIcon = meta?.icon;

  return (
    <BaseCard className={cardClassName}>
      <div className={cn(bodyClassName)}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Text as="h3" className={MAINTENANCE_SERVICE_TITLE_CLASS}>
                {title}
              </Text>
              {badge && (
                <Badge
                  variant="secondary"
                  className={cn('shadow-none ', badge.className)}
                >
                  {badge.label}
                </Badge>
              )}
            </div>
            {description && (
              <Text className="text-xs md:text-sm leading-relaxed text-gray-600">
                {description}
              </Text>
            )}
          </div>
          {actions}
        </div>

        {meta?.text && (
          <div
            className={cn(
              'inline-flex items-center gap-1.5 text-xs md:text-sm font-medium',
              !badge && 'mt-0',
              badge && 'mt-0 md:mt-2',
              meta.className,
            )}
          >
            {MetaIcon && <MetaIcon className="size-3 md:size-4 shrink-0" />}
            {meta.text}
          </div>
        )}

        {stats.length > 0 && (
          <div className={gridWrapperClassName}>
            <StatGrid
              items={stats}
              cols={gridCols}
              cellClassName={gridCellClassName}
            />
          </div>
        )}
      </div>

      {footer && (
        <div className="flex items-center justify-between gap-4 bg-primary-50 px-4 py-3.5 md:px-5">
          <Text as="p" className="text-xs md:text-sm text-gray-600">
            {footer.text}
          </Text>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            icon={
              footer.action.icon ? (
                <footer.action.icon className="size-4" />
              ) : undefined
            }
            onClick={footer.action.onClick}
          >
            {footer.action.label}
          </Button>
        </div>
      )}
    </BaseCard>
  );
}
