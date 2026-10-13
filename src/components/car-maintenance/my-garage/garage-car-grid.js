'use client';

import AddCarPlaceholderCard from '@/components/car-maintenance/my-garage/add-car-placeholder-card';
import GarageCarCard from '@/components/car-maintenance/my-garage/garage-car-card';

export default function GarageCarGrid({
  cars,
  canAddMore,
  onAddCar,
  onAddService,
  onEditCar,
  onRemoveCar,
}) {
  return (
    <div className="grid grid-cols-1 items-start justify-items-start gap-6 md:grid-cols-2">
      {cars.map((car) => (
        <GarageCarCard
          key={car.id}
          car={car}
          onAddService={onAddService}
          onEditCar={onEditCar}
          onRemoveCar={onRemoveCar}
        />
      ))}
      {canAddMore && <AddCarPlaceholderCard onClick={onAddCar} />}
    </div>
  );
}
