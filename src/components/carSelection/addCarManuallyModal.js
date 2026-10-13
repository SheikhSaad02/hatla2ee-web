'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import Button from '@/components/common/button/button';
import DrawerWrapper from '@/components/common/drawer';
import Input from '@/components/common/input/input';
import { Modal } from '@/components/common/modal';
import { useIsMobile } from '@/providers/isMobile';

export default function AddCarManuallyModal({ isOpen, onClose, onAdd }) {
  const t = useTranslations('carMaintenance');
  const isMob = useIsMobile() ?? false;
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setDetails('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = details.trim();
    if (!trimmed) {
      setError(t('manual_car_details_required'));
      return;
    }
    onAdd(trimmed);
  };

  const title = t('add_car_manually_title');
  const description = t('add_car_manually_subtitle');

  const renderContent = () => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        value={details}
        onChange={(e) => {
          setDetails(e.target.value);
          if (error) setError('');
        }}
        containerClassName="w-full"
        className="h-[46px] w-full"
        inputClassName="text-sm"
        inputTitle={t('enter_details_manually')}
        placeholder={t('enter_brand_model_year')}
        errorMsg={error}
        showError={Boolean(error)}
      />
      <Button type="submit" size="lg" className="w-full">
        {t('add_car')}
      </Button>
    </form>
  );

  return isMob ? (
    <DrawerWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      fullScreen={false}
    >
      {renderContent()}
    </DrawerWrapper>
  ) : (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      contentClassName="flex flex-col gap-6 py-2"
      containerClassName="md:max-w-[520px]"
    >
      {renderContent()}
    </Modal>
  );
}
