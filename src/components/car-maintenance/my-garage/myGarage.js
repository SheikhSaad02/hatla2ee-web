'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import Button from '@/components/common/button/button';
import { Illustrator } from '@/components/common/illustrator/illustrator';
import { GarageCarGridSkeleton } from '@/components/common/loading';
import NextImage from '@/components/common/nextImage';
import AddCarModal from '@/components/car-maintenance/my-garage/add-car-modal';
import AddServiceModal from '@/components/car-maintenance/my-garage/add-service-modal';
import RemoveCarModal from '@/components/car-maintenance/my-garage/remove-car-modal';
import GarageCarGrid from '@/components/car-maintenance/my-garage/garage-car-grid';
import { useUser } from '@/providers/user';
import {
  fetchMappedUserMaintenanceCars,
  MAX_MAINTENANCE_CARS,
} from '@/utils/car-maintenance/fetchMappedCars';
import { getAsset, isLoggedIn } from '@/utils/general';
import { showToast } from '@/utils/notification-service';
import { useIsMobile } from '@/providers/isMobile';
import { carMaintenanceEvents } from '@/services/analyticsService/events';

export default function MyGarage({ isMobile: isMobileProp }) {
  const locale = useLocale();
  const t = useTranslations('carMaintenance');
  const { user, loading: userLoading } = useUser();
  const searchParams = useSearchParams();
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [removeCar, setRemoveCar] = useState(null);
  const [serviceModalCar, setServiceModalCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isMobileFromContext = useIsMobile();
  const isMob = isMobileProp ?? isMobileFromContext ?? false;
  const canAddMore = cars.length < MAX_MAINTENANCE_CARS;

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const { cars: mapped, error } = await fetchMappedUserMaintenanceCars(
        locale,
        t,
      );
      setCars(error ? [] : mapped);
    } catch {
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  }, [locale, t]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const shouldAutoOpen = searchParams.get('addCar') === '1';

  useEffect(() => {
    if (shouldAutoOpen && !userLoading && !isLoading) {
      if (canAddMore) {
        setIsAddCarModalOpen(true);
      } else {
        showToast('error', t('max_cars_reached'));
      }
    }
  }, [shouldAutoOpen, userLoading, isLoading, canAddMore, t]);

  const handleOpenAddCar = () => {
    if (!canAddMore) {
      showToast('error', t('max_cars_reached'));
      return;
    }
    carMaintenanceEvents.add_maintenance_car(locale, user);
    setIsAddCarModalOpen(true);
  };

  const handleOpenAddService = (car) => {
    carMaintenanceEvents.add_maintenance_service(locale, user);
    setServiceModalCar(car);
  };

  const emptyGarage = (
    <div className="flex w-full items-center justify-center rounded-2xl bg-gray-50 px-10 py-6 lg:py-10">
      <Illustrator
        image={
          <NextImage
            src={getAsset('/assets/garage-placeholder.webp')}
            width={isMob ? 140 : 180}
            height={isMob ? 90 : 110}
          />
        }
        description={t('empty_garage_description')}
      >
        <Button
          onClick={handleOpenAddCar}
          size="lg"
          className="mt-4 w-full max-w-md gap-2"
        >
          <Plus className="size-4" />
          {t('add_your_car')}
        </Button>
      </Illustrator>
    </div>
  );

  if (userLoading) {
    return <GarageCarGridSkeleton />;
  }

  if (isLoading) {
    return <GarageCarGridSkeleton />;
  }

  return (
    <>
      {cars.length === 0 ? (
        emptyGarage
      ) : (
        <GarageCarGrid
          cars={cars}
          canAddMore={canAddMore}
          onAddCar={handleOpenAddCar}
          onAddService={handleOpenAddService}
          onEditCar={setEditCar}
          onRemoveCar={setRemoveCar}
        />
      )}

      <AddCarModal
        isOpen={isAddCarModalOpen || !!editCar}
        car={editCar}
        onClose={() => {
          setIsAddCarModalOpen(false);
          setEditCar(null);
        }}
        isMobile={isMob}
        onSuccess={refetch}
      />

      <RemoveCarModal
        isOpen={!!removeCar}
        car={removeCar}
        onClose={() => setRemoveCar(null)}
        onSuccess={refetch}
      />

      <AddServiceModal
        isOpen={!!serviceModalCar}
        car={serviceModalCar}
        onClose={() => setServiceModalCar(null)}
        onSuccess={refetch}
      />
    </>
  );
}
