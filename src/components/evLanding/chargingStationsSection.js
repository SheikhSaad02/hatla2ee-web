'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import { useUser } from '@/providers/user';
import { evLandingEvents } from '@/services/analyticsService/events';
import { Zap, MapPin, Navigation } from 'lucide-react';
import BaseCard from '../common/baseCard/baseCard';
import Button from '../common/button/button';
import DrawerWrapper from '../common/drawer';
import Text from '../common/text';
import NextImage from '../common/nextImage';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import { useIsMobile } from '@/providers/isMobile';
import StationRow from './chargingStations/StationRow';
import { useChargingStations } from './chargingStations/useChargingStations';
import { directionsUrl } from './chargingStations/stationUtils';

// Lazy-load the map (Google Maps only ships when this renders, client-only).
const StationMap = dynamic(() => import('./chargingStations/StationMap'), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[#f3f5f9]">
      <Spinner className="size-6 text-primary" />
    </div>
  ),
});

export default function ChargingStationsSection() {
  const t = useTranslations('evLanding');
  const locale = useLocale();
  const { user } = useUser();
  const isMob = useIsMobile() ?? false;

  const { origin, stations, otherStations, loading, isEmpty } =
    useChargingStations();
  const [selectedId, setSelectedId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const list = stations || [];
  const selected = list.find((s) => s.id === selectedId) ?? null;

  const handleSelect = (id) => {
    setSelectedId(id);
    const station = list.find((s) => s.id === id);
    if (station) evLandingEvents.click_station(locale, user, station.name);
  };

  const handleNavigate = (station) =>
    evLandingEvents.click_navigate(locale, user, station?.name);

  const stationMap = (className, showControls = true) => (
    <StationMap
      className={className}
      origin={origin}
      stations={list}
      selectedId={selectedId}
      onSelect={handleSelect}
      onMapInteract={() => evLandingEvents.map_interaction(locale, user)}
      showControls={showControls}
    />
  );

  const renderListHeader = () => (
    <div className="flex items-start justify-between gap-3 px-1 pb-1">
      <div className="flex flex-col">
        <Text as="h3" weight="bold" className="text-lg leading-tight text-gray-900">
          {t('nearbyChargingStation')}
        </Text>
      </div>
      <span className="shrink-0 rounded-full bg-[#e8edfb] px-3 py-1.5 text-xs font-semibold text-primary">
        {t('stationsFound', { count: list.length })}
      </span>
    </div>
  );

  const renderList = ({ withNavigate = false } = {}) =>
    isEmpty
      ? renderEmptyState()
      : list.map((s) => (
          <StationRow
            key={s.id}
            station={s}
            active={s.id === selectedId}
            withNavigate={withNavigate}
            onSelect={handleSelect}
            onNavigate={handleNavigate}
          />
        ));

  const renderEmptyState = () => (
    <div className="flex flex-col gap-5 pt-2">
      <div className="flex flex-col items-center gap-2 text-center">
        <NextImage
          src={getAsset('/assets/ev-images/no_ev_found.webp')}
          alt=""
          width={240}
          height={170}
          className="h-auto w-[200px] object-contain"
        />
        <Text className="text-sm text-gray-500">{t('noStationNearYou')}</Text>
      </div>

      {otherStations.length > 0 && (
        <div className="flex flex-col gap-2">
          <Text weight="semibold" className="px-1 text-sm text-gray-900">
            {t('otherStationsYouCanReach')}
          </Text>
          {otherStations.map((s) => (
            <StationRow key={s.id} station={s} interactive={false} />
          ))}
        </div>
      )}
    </div>
  );

  const renderSelectedCard = () =>
    selected && (
      <div className="absolute bottom-5 start-5 end-5 z-[6] flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(31,39,51,0.16)]">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-100 text-primary">
          <Zap className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <Text weight="bold" className="text-base text-gray-900 line-clamp-1">
            {selected.name}
          </Text>
          <Text className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="size-3.5 shrink-0" />
            <span className="line-clamp-1">
              {selected.area}
              {selected.distance ? ` · ${selected.distance}` : ''}
            </span>
          </Text>
        </div>
        <Button
          href={directionsUrl(selected)}
          target="_blank"
          onClick={() => handleNavigate(selected)}
          icon={<Navigation className="size-4" />}
        >
          {t('navigate')}
        </Button>
      </div>
    );

  const renderLoading = (className) => (
    <BaseCard className={cn('grid place-items-center gap-0 rounded-[20px] border-[#f0f0f0]', className)}>
      <Spinner className="size-6 text-primary" />
    </BaseCard>
  );

  const renderDesktop = () => {
    if (loading) return renderLoading('h-[560px]');
    return (
      <BaseCard className="flex flex-row h-[560px] gap-0 overflow-hidden rounded-[20px] border-[#f0f0f0] p-0">
        <aside className="flex w-[380px] shrink-0 flex-col overflow-hidden border-e border-[#f0f0f0] p-5">
          {renderListHeader()}
          <div className="mt-3 flex flex-col gap-2 overflow-y-auto">{renderList()}</div>
        </aside>
        <div className="relative flex-1">
          {stationMap('h-[560px] w-full')}
          {!isEmpty && renderSelectedCard()}
        </div>
      </BaseCard>
    );
  };

  const renderMobile = () => {
    if (loading) return renderLoading('h-[160px]');
    return (
      <>
        <div className="relative h-[160px] overflow-hidden rounded-2xl border border-[#f0f0f0]">
          {stationMap('absolute inset-0 h-full w-full', false)}
          <div className="absolute inset-0 grid place-items-center">
            <Button
              variant="secondary"
              onClick={() => setSheetOpen(true)}
              className="rounded-lg border border-primary bg-primary-50 px-6 font-semibold text-primary-800 shadow-none hover:bg-primary-100 hover:shadow-none"
            >
              {t('seeAllStations')}
            </Button>
          </div>
        </div>

        <DrawerWrapper
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          fullScreen
          childrenClassName="p-0"
        >
          <div className="flex min-h-full flex-col">
            <div className="sticky top-0 z-0">
              {stationMap('h-[280px] w-full')}
            </div>
            <div className="sticky top-[264px] z-10 -mt-4 rounded-t-2xl bg-white pt-2">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-gray-300" />
              <div className="px-4 pb-1 pt-3">{renderListHeader()}</div>
            </div>
            <div className="flex flex-col gap-2 bg-white px-4 pb-4 pt-1">
              {renderList({ withNavigate: true })}
            </div>
          </div>
        </DrawerWrapper>
      </>
    );
  };

  return (
    <section className="flex flex-col gap-3 md:gap-6">
      <h2 className="sectionHeading">{t('chargingStationsTitle')}</h2>
      {isMob ? renderMobile() : renderDesktop()}
    </section>
  );
}
