import GlobalPageViewTracker from '@/components/analytics/global-page-view-tracker';
import Container from '@/components/layout/container';
import CoreLayout from '@/components/layout/core-layout';
import '@/styles/globals.css';
import { getLocale } from 'next-intl/server';

export default async function AuthLayout({ children }) {
  const locale = await getLocale(); // or get from props.params

  return (
    <CoreLayout locale={locale} className="bg-primary-50">
      <GlobalPageViewTracker />

      <Container>{children}</Container>
    </CoreLayout>
  );
}
