'use client';

import { cn } from '@/utils';
import React, { useState } from 'react';
import Text from '../text';
import { useTranslations } from 'next-intl';

const VideoReviewsSection = ({ title, videos = [], className }) => {
  const t = useTranslations('common');

  return (
    videos?.length > 0 && (
      <div className={cn('', className)}>
        <Text as="h2" className="sectionHeading">
          {t('Reviews')} - {title}
        </Text>

        <div className="space-y-4">
          {videos?.map((video, index) => (
            <div key={index}>
              <iframe
                key={index}
                src={video?.link}
                className="min-w-full min-h-full md:min-h-[560px] rounded-md"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video?.title || `video-${index}`}
              />
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default VideoReviewsSection;
