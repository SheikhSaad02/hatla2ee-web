'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Input from '../common/input/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../common/button/button';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import configs from '@/configs';
import { submitContact } from '@/apis/contact';
import { showToast } from '@/utils/notification-service';
import TextArea from '../common/textArea/textArea';

const ContactForm = ({ isMob, fieldSize = 'medium' }) => {
  const t = useTranslations('contactUs');

  const contactSchema = (t, configs) =>
    z.object({
      subject: z.string().min(1, { message: t('Subject is required') }),
      phone: z
        .string()
        .min(1, { message: t('Phone number is required') })
        .refine((val) => configs.isValidMobileNumber(val), {
          message: t('Invalid mobile number'),
        }),
      email: z
        .string()
        .min(1, { message: t('Email is required') })
        .refine((val) => configs.isValidEmail(val), {
          message: t('Invalid email'),
        }),
      message: z.string().min(1, { message: t('Message is required') }),
    });

  const form = useForm({
    resolver: zodResolver(contactSchema(t, configs)),
    defaultValues: {
      subject: '',
      phone: '',
      email: '',
      message: '',
    },
  });

  const handleFormSubmit = async (data) => {
    const res = await submitContact(data);
    if (res?.error) {
      showToast(
        'error',
        t('Your request has not been submitted please try again'),
      );
    } else {
      showToast('success', t('Your request has been successfully submitted'));
    }
    form.reset();
  };

  const submitButton = () => {
    return (
      <Button type="submit" size="xl" className="w-full">
        <Send />
        {t('Send Message')}
      </Button>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4 lg:gap-5"
      >
        {/* Subject */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={t('Enter Message Subject')}
                  size={fieldSize}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={t('Enter Your Phone Number')}
                  size={fieldSize}
                  dir="ltr"
                  inputClassName="rtl:text-right"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t('Enter Your Email Address')}
                  size={fieldSize}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextArea
                  placeholder={t('What Would You Like Us To Know?')}
                  rows={4}
                  className="fs-body"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isMob ? (
          <>
            {/* <div className="fixed bottom-20 left-0 w-full bg-white z-30 p-2"> */}
            {submitButton()}
            {/* </div> */}
          </>
        ) : (
          submitButton()
        )}
      </form>
    </Form>
  );
};

export default ContactForm;
