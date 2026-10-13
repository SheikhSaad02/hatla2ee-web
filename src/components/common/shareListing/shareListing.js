'use client';
import React, { useEffect, useState } from 'react';
import Button from '../button/button';
import { Modal } from '../modal';
import Text from '../text';
import { IconEmail, IconFacebook, IconWhatsapp, IconX } from '@/icons/socials';
import NextImage from '../nextImage';
import { useTranslations } from 'next-intl';
import SpecificationList from '../specificationList/specificationList';
import { IconCopy, IconShare } from '@/icons/basicSvgs';
import DrawerWrapper from '../drawer';
import { cn } from '@/utils';
import { showToast } from '@/utils/notification-service';

const ShareListing = ({
  modalTitle,
  title,
  specificationList,
  image,
  buttonVariant,
  isMob,
  showText = false,
  btnSize,
  btnclassName,
  className,
  wrapperClassName,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const t = useTranslations('common');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLink(window.location.href);
    }
  }, []);

  const encodedLink = encodeURIComponent(link);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      showToast('success', t('Link Copied!'));
      setShowShareModal(false);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleEmail = () => {
    window.open(
      `mailto:?subject=${encodedTitle}&body=${encodedLink}`,
      '_blank',
    );
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodedTitle}%0A${link}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      '_blank',
    );
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedLink}`,
      '_blank',
    );
  };

  const renderModelContent = () => (
    <>
      <div className={cn('gap-2 flex items-center', className)}>
        <NextImage
          src={image?.thumbnail}
          width={68}
          height={68}
          alt="Car"
          className="w-14 h-14 md:w-17 md:h-17 rounded-sm object-cover self-start"
        />
        <div className="gap-2 flex flex-col">
          <Text className="md:text-lg font-medium md:font-semibold">
            {title}
          </Text>
          {specificationList && (
            <SpecificationList
              specificationList={specificationList}
              isMob={isMob}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 pt-6 gap-3.5 w-full">
        <Button
          icon={<IconCopy size={16} />}
          variant="outline"
          className="gap-2 justify-start md:h-11"
          onClick={handleCopy}
        >
          {t('Copy Link')}
        </Button>
        <Button
          icon={<IconEmail size={16} />}
          variant="outline"
          className="gap-2 justify-start md:h-11"
          onClick={handleEmail}
        >
          {t('Email')}
        </Button>
        <Button
          icon={<IconWhatsapp size={16} />}
          variant="outline"
          className="gap-2 justify-start md:h-11"
          onClick={handleWhatsApp}
        >
          {t('Whatsapp')}
        </Button>
        <Button
          icon={<IconFacebook size={16} />}
          variant="outline"
          className="gap-2 justify-start md:h-11"
          onClick={handleFacebook}
        >
          {t('Facebook')}
        </Button>
        <Button
          icon={<IconX size={16} />}
          variant="outline"
          className="gap-2 justify-start md:h-11"
          onClick={handleTwitter}
        >
          {t('X (Formerly Twitter)')}
        </Button>
      </div>
    </>
  );

  return (
    <div className={wrapperClassName}>
      <Button
        onClick={() => setShowShareModal(true)}
        variant={buttonVariant}
        icon={<IconShare />}
        className={cn(
          'group overflow-hidden transition-all duration-500 gap-0',
          btnclassName,
        )}
        size={btnSize || 'sm'}
      >
        {!isMob && showText && (
          <span
            className={cn(
              'whitespace-nowrap max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500',
              className,
            )}
          >
            <span className="ps-1">{t('Share')}</span>
          </span>
        )}
      </Button>
      {!isMob && (
        <Modal
          isOpen={showShareModal}
          headerClassName={'py-3 px-4 h-min'}
          containerClassName={'p-0 sm:max-w-[560] lg:gap-0'}
          contentClassName={'p-4'}
          title={<Text className="font-bold">{modalTitle}</Text>}
          onClose={() => setShowShareModal(false)}
        >
          {renderModelContent()}
        </Modal>
      )}
      {isMob && (
        <DrawerWrapper
          fullScreen={false}
          isOpen={showShareModal}
          headerClassName={'py-3 px-4 h-min'}
          containerClassName={'p-0 gap-0'}
          contentClassName={'p-4'}
          title={<Text className="font-bold">{modalTitle}</Text>}
          onClose={() => setShowShareModal(false)}
        >
          {renderModelContent()}
        </DrawerWrapper>
      )}
    </div>
  );
};

export default ShareListing;
