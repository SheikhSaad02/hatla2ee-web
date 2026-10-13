'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { MoreVertical } from 'lucide-react';
import BaseCard from '../baseCard/baseCard';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/utils';
import Button from '../button/button';
import { Modal } from '../modal';
import DrawerWrapper from '../drawer';
import Input from '../input/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { showToast } from '@/utils/notification-service';
import { fetchLeadCampaigns, submitLeadCampaign } from '@/apis/lead-campaigns';
import configs from '@/configs';

import styles from './leadCampaignActions.module.css';
import { getLocaleString } from '@/utils/general';

import {
  CallActionIcon,
  CarActionIcon,
  TestDriveIcon,
} from '@/icons/basicSvgs';

const ICON_MAP = {
  'book-now': CarActionIcon,
  'more-information': CarActionIcon,
  'request-call': CallActionIcon,
  'test-drive': TestDriveIcon,
};

function getIconComponent(iconKey) {
  if (!iconKey) return null;

  const IconComponent = ICON_MAP[iconKey];
  return IconComponent ? <IconComponent /> : null;
}

const LeadCampaignActions = ({
  entityType = 'NewListing',
  entityId,
  isMob = false,
  make,
  model,
  showCard = false,
  restrictedView = false,
  gridView = true,
  launch_year,
  source = 'detail',
}) => {
  const t = useTranslations('common');
  const [actions, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = useLocale();
  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      const campaignActions = await fetchLeadCampaigns(entityType, entityId);
      setActions(campaignActions?.error ? [] : campaignActions || []);
      setIsLoading(false);
    };

    if (entityId) {
      loadCampaigns();
    }
  }, [entityType, entityId]);

  const leadFormSchema = z.object({
    fullName: z
      .string()
      .min(4, { message: t('Name must be at least 4 characters') }),
    phone: z
      .string()
      .min(1, { message: t('Phone number is required') })
      .refine((value) => configs?.isValidMobileNumber(value), {
        message: t('Please enter a valid phone number'),
      }),
  });

  const form = useForm({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
    },
  });

  const handleActionClick = (action) => {
    setSelectedAction(action);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedAction(null);
    form.reset();
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);

    const response = await submitLeadCampaign({
      campaignId: selectedAction?.id,
      mobile: data.phone,
      name: data.fullName,
      metadata: {
        source: source,
        listingId: entityId,
        make,
        model,
        year: launch_year,
      },
    });

    if (response?.error) {
      showToast('error', t('Something went wrong Please try again'));
      setIsSubmitting(false);
    } else {
      showToast('success', t('Your request has been submitted successfully'));
      handleClose();
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    inputTitle={t('Full Name')}
                    placeholder={t('Enter your full name')}
                    {...field}
                  />
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
                    placeholder={t('Enter your phone number')}
                    type="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="xl" disabled={isSubmitting}>
            {isSubmitting ? t('Submitting') : t('Submit')}
          </Button>
        </form>
      </Form>
    );
  };

  const renderActionButtons = () => {
    if (restrictedView && actions.length > 1) {
      const [firstAction, ...restActions] = actions;

      return (
        <div className="flex gap-2 px-2 w-full lg:px-4">
          <Button
            variant="tertiary"
            onClick={() => handleActionClick(firstAction)}
            className={cn('flex-1', styles.btnGradient)}
            icon={getIconComponent(firstAction?.slug)}
          >
            {getLocaleString(firstAction, 'title', locale)}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="tertiary"
                className={cn('px-3', styles.btnGradient)}
              >
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="p-2 flex flex-col gap-2"
            >
              {restActions?.map((action) => (
                <Button
                  key={action?.id}
                  variant="tertiary"
                  onClick={() => handleActionClick(action)}
                  icon={getIconComponent(action?.slug)}
                  className={cn('justify-start', styles.btnGradient)}
                >
                  {getLocaleString(action, 'title', locale)}
                </Button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return actions?.map((action, index) => (
      <Button
        variant="tertiary"
        onClick={() => handleActionClick(action)}
        key={action?.id}
        icon={getIconComponent(action?.slug)}
        className={cn(
          styles.btnGradient,
          index === actions.length - 1 &&
            actions.length % 2 !== 0 &&
            'col-span-2',
        )}
      >
        {getLocaleString(action, 'title', locale)}
      </Button>
    ));
  };

  const renderModals = () => (
    <>
      {!isMob && (
        <Modal
          isOpen={isOpen}
          contentClassName="flex gap-4 py-0 flex-col"
          title={getLocaleString(selectedAction, 'title', locale)}
          onClose={handleClose}
        >
          {renderForm()}
        </Modal>
      )}

      {isMob && (
        <DrawerWrapper
          isOpen={isOpen}
          onClose={handleClose}
          title={getLocaleString(selectedAction, 'title', locale)}
          // fullScreen={false}
        >
          {renderForm()}
        </DrawerWrapper>
      )}
    </>
  );

  if (isLoading || !actions?.length) return null;

  if (showCard) {
    return (
      <>
        <BaseCard className={cn('rounded-xl gap-0 h-max md:gap-4 md:p-4')}>
          <CardContent className="grid grid-cols-2 gap-2">
            {renderActionButtons()}
          </CardContent>
        </BaseCard>
        {renderModals()}
      </>
    );
  }

  return (
    <>
      <div className={cn(gridView ? 'grid grid-cols-2' : 'flex', 'gap-2')}>
        {renderActionButtons()}
      </div>
      {renderModals()}
    </>
  );
};

export default LeadCampaignActions;
