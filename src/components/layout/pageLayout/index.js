import { Breadcrumbs } from '@/components/common/breadcrumbs';
import Container from '../container';
import Footer from '../footer';
import Navbar from '../navbar';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import { cn } from '@/utils';
import { getLocale } from 'next-intl/server';
import { isMobileServer, isWebViewServer } from '@/utils/serverFunctions';
import BottomNavigation from '../bottomNavigation';
import MobileNavbar from '../navbar/mobileNavbar';
import { IsMobileProvider } from '@/providers/isMobile';
import SmartStickyAppBanner from '../smartStickyAppBanner';

const PageLayout = async ({
  route,
  children,
  breadCrumbsList,
  pageTitle,
  pageTitleImage,
  className,
  style = {},
  pageTitleWrapperClassName,
  pageTitleClassName,
  pageDescription,
  adBanner,
}) => {
  const isMobile = await isMobileServer();
  const isWebView = await isWebViewServer();
  const locale = await getLocale();

  const routeConfigs = {
    home: { headerNav: false, bottomNav: true },
    login: { headerNav: false, bottomNav: false },
    'detail-page': { headerNav: isMobile ? false : true, bottomNav: false },
    'used-listings': { headerNav: isMobile ? false : true, bottomNav: true },
    'used-landing': { headerNav: true, bottomNav: true },
    'model-detail': { headerNav: isMobile ? false : true, bottomNav: true },
    'new-landing': { headerNav: true, bottomNav: true },
    comparison: { headerNav: true, bottomNav: true },
    comparisonDetail: { headerNav: isMobile ? false : true, bottomNav: true },
    prices: { headerNav: isMobile ? false : true, bottomNav: true },
    'new-listings': { headerNav: isMobile ? false : true, bottomNav: true },
    'brand-info': { headerNav: !isMobile, bottomNav: true },
    showroom: { headerNav: !isMobile, bottomNav: true },
    'showroom-detail': { headerNav: !isMobile, bottomNav: !isMobile },
    'maintenance-center': { headerNav: !isMobile, bottomNav: true },
    origin: { headerNav: isMobile ? false : true, bottomNav: true },
    error: { headerNav: true, bottomNav: false },
    'review-detail': { headerNav: isMobile ? false : true, bottomNav: true },
    listings: { headerNav: isMobile ? false : true, bottomNav: true },
    'get-offer': { headerNav: !isMobile, bottomNav: !isMobile },
    'tow-trucks': { headerNav: !isMobile, bottomNav: true },
    'review-landing': { headerNav: true, bottomNav: true },
    'contact-us': { headerNav: isMobile ? false : true, bottomNav: false },
    privacy: { headerNav: isMobile ? false : true, bottomNav: false },
    'general-condition': {
      headerNav: isMobile ? false : true,
      bottomNav: false,
    },
  };

  const { headerNav = true, bottomNav = true } = routeConfigs[route] || {};
  const renderBreadCrumbs = () => {
    return <Breadcrumbs list={breadCrumbsList} />;
  };
  const renderPageContent = () => {
    return (
      <>
        {isMobile
          ? pageTitle && (
              <>
                {!isWebView && (
                  <PageTitle
                    pageTitleImage={pageTitleImage}
                    className={pageTitleClassName}
                    title={pageTitle}
                  />
                )}
                {pageDescription && pageDescription}
              </>
            )
          : (pageTitle || breadCrumbsList || pageDescription) && (
              <div
                className={cn(
                  'flex flex-col md:gap-2 lg:pt-5',
                  pageTitleWrapperClassName,
                )}
              >
                {adBanner && <div className="mb-6">{adBanner}</div>}
                {breadCrumbsList && renderBreadCrumbs()}
                {pageTitle && (
                  <PageTitle className={pageTitleClassName} title={pageTitle} />
                )}

                {pageDescription && pageDescription}
              </div>
            )}
        <div
          className={cn(`grid grid-cols-1 gap-8 lg:gap-13 lg:pt-5`, className)}
          style={{ ...style }}
        >
          {children}
          {isMobile && breadCrumbsList && !isWebView && renderBreadCrumbs()}
        </div>
      </>
    );
  };

  return (
    <IsMobileProvider isMobile={isMobile}>
      {!isWebView && isMobile && <SmartStickyAppBanner />}
      {headerNav && !isMobile && <Navbar />}
      {isMobile && !isWebView && <MobileNavbar />}
      <Container {...(isWebView && { className: 'pb-8' })}>
        {renderPageContent()}
      </Container>
      {!isWebView && (
        <Footer locale={locale} removeBottomPadding={!bottomNav} />
      )}
      {isMobile && bottomNav && !isWebView && (
        <BottomNavigation show={bottomNav} />
      )}
    </IsMobileProvider>
  );
};

export default PageLayout;
