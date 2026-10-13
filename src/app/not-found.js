// app/not-found.js
import CoreLayout from '@/components/layout/core-layout';
import { getLocale } from 'next-intl/server';
import NotFound from './[locale]/not-found';

export default async function RootNotFound() {
  const locale = await getLocale();
  return (
    <CoreLayout locale={locale}>
      <NotFound params={{ locale }} />;
    </CoreLayout>
  );
}
