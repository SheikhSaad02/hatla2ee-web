import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';
import NextLink from '../nextLink';
import { ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';

export function Breadcrumbs({ list = [], className }) {
  const locale = useLocale();

  if (list?.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {list?.map((item, index) => (
          <React.Fragment key={index}>
            {!item?.href ? (
              <BreadcrumbPage>
                <span itemProp="name">{item.label}</span>
              </BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NextLink
                      href={item.href}
                      className={'text-gray-500'}
                      localized={
                        item.href === '/' && locale === 'ar' ? false : true
                      }
                    >
                      <span itemProp="name">{item.label}</span>
                    </NextLink>
                  </BreadcrumbLink>
                  <meta itemProp="position" content={String(index + 1)} />
                </BreadcrumbItem>
                {index !== list.length - 1 && (
                  <BreadcrumbSeparator className={'text-gray-500'}>
                    <ChevronRight className="flipX" />
                  </BreadcrumbSeparator>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
