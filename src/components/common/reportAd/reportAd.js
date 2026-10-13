'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../button/button';
import { useTranslations } from 'next-intl';
import { Modal } from '../modal';
import Text from '../text';
import { RadioGroup } from '../radioGroup';
import Input from '../input/input';
import TextArea from '../textArea/textArea';
import { IconFlag } from '@/icons/basicSvgs';
import { showToast } from '@/utils/notification-service';
import { fetchReportAdReasons, reportAnAd } from '@/apis/reportAnAd';
import DrawerWrapper from '../drawer';
import { useUser } from '@/providers/user';
import { RadioButtonsSkeleton } from '../loading';

const ReportAd = ({ id, isMob }) => {
  const t = useTranslations('common');
  const contactUsT = useTranslations('contactUs');

  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setReason] = useState({});
  const [reasons, setReasons] = useState([]);
  const [isLoadingReasons, setIsLoadingReasons] = useState(false);

  const { user } = useUser();

  const reportSchema = (contactUsT) =>
    z.object({
      phone: z
        .string()
        .min(1, { message: contactUsT('Phone number is required') }),
      message: z
        .string()
        .min(1, { message: contactUsT('Message is required') }),
    });

  const form = useForm({
    resolver: zodResolver(reportSchema(contactUsT)),
    defaultValues: {
      phone: user?.mobile || '',
      message: '',
    },
  });

  const handleReportClick = async () => {
    setShowReportModal(true);

    if (reasons?.length === 0) {
      setIsLoadingReasons(true);
      const fetchedReasons = await fetchReportAdReasons();
      if (fetchedReasons?.error) {
        console.error('Failed to fetch reasons');
      } else {
        setReasons(fetchedReasons || []);
      }
      setIsLoadingReasons(false);
    }
  };

  const handleFormSubmit = async (data) => {
    const payload = { ...data, reason_id: reason?.value };
    const res = await reportAnAd(payload, id);

    if (res?.error) {
      showToast('error', res?.error?.message);
    } else {
      showToast(
        'success',
        contactUsT('Your report has been submitted successfully We ll review this ad shortly'),
      );
      setShowReportModal(false);
    }
    form.reset();
    setReason({});
  };

  const renderContent = () => {
    return (
      <div className="flex flex-col gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {isLoadingReasons ? (
                      <RadioButtonsSkeleton />
                    ) : (
                      <RadioGroup
                        value={reason}
                        options={reasons}
                        itemClassName="flex"
                        labelClassName="w-full text-center"
                        onChange={(value) => setReason(value)}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      inputTitle={t('Phone Number')}
                      placeholder={t('Phone Number Here')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextArea
                      inputTitle={t('Message')}
                      placeholder={t('Write your message here')}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="xl"
              disabled={form.formState.isSubmitting || isLoadingReasons}
            >
              {form.formState.isSubmitting ? t('Submitting') : t('Submit')}
            </Button>
          </form>
        </Form>
      </div>
    );
  };

  return (
    <div>
      <Button
        icon={<IconFlag size={16} />}
        variant={'ghost'}
        className="text-sm gap-2 justify-center w-full"
        onClick={handleReportClick}
      >
        {t('Report this Ad')}
      </Button>

      {!isMob && (
        <Modal
          isOpen={showReportModal}
          contentClassName={'flex gap-4 py-0 flex-col'}
          title={t('Report this Ad')}
          onClose={() => setShowReportModal(false)}
        >
          {renderContent()}
        </Modal>
      )}

      {isMob && (
        <DrawerWrapper
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title={t('Report this Ad')}
        >
          {renderContent()}
        </DrawerWrapper>
      )}
    </div>
  );
};

export default ReportAd;
