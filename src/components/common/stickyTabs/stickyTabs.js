'use client';

import { useEffect, useState, useRef } from 'react';
import { Tabs } from '../tabs';

const useVisibleSections = (sections = []) => {
  const [visibleTabs, setVisibleTabs] = useState([]);

  useEffect(() => {
    const found = sections.filter(({ value }) => {
      const el = document.getElementById(value);
      return el !== null;
    });

    setVisibleTabs(found);
  }, [sections]);

  return visibleTabs;
};

const StickyTabs = ({ allTabs }) => {
  const tabs = useVisibleSections(allTabs);
  const [activeTab, setActiveTab] = useState(tabs[0]?.value);
  const userScrollingRef = useRef(false);
  const programmaticScrollRef = useRef(false);

  const headerOffset = 80;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const offsetTop = window.pageYOffset + rect.top - headerOffset;

      programmaticScrollRef.current = true;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const updateActiveTab = (val) => {
    setActiveTab(val);
    scrollToSection(val);
  };

  useEffect(() => {
    if (tabs.length === 0) return;
    let lastScrollTop = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset;

      if (Math.abs(currentScrollTop - lastScrollTop) > 1) {
        if (!programmaticScrollRef.current) {
          userScrollingRef.current = true;
        }
        lastScrollTop = currentScrollTop;
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: `-${headerOffset + 20}px 0px -60% 0px`,
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
    };

    const observerCallback = (entries) => {
      if (!userScrollingRef.current && !programmaticScrollRef.current) return;

      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries.reduce((prev, current) => {
          const prevRatio = prev.intersectionRatio;
          const currentRatio = current.intersectionRatio;

          if (currentRatio > prevRatio) return current;

          if (Math.abs(currentRatio - prevRatio) < 0.1) {
            const prevTop = prev.boundingClientRect.top;
            const currentTop = current.boundingClientRect.top;
            return currentTop < prevTop ? current : prev;
          }

          return prev;
        });

        const sectionId = mostVisible.target.id;
        if (sectionId && sectionId !== activeTab) {
          setActiveTab(sectionId);
        }
      }

      if (userScrollingRef.current) {
        userScrollingRef.current = false;
      }
      if (programmaticScrollRef.current) {
        programmaticScrollRef.current = false;
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    tabs.forEach(({ value }) => {
      const element = document.getElementById(value);
      if (element) {
        observer.observe(element);
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    const setInitialTab = () => {
      const scrollPosition = window.scrollY + headerOffset + 100;

      for (let i = tabs.length - 1; i >= 0; i--) {
        const section = document.getElementById(tabs[i].value);
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = window.pageYOffset + rect.top;

          if (scrollPosition >= sectionTop) {
            setActiveTab(tabs[i].value);
            break;
          }
        }
      }
    };

    setInitialTab();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tabs, activeTab, headerOffset]);

  if (tabs.length === 0) return null;

  return (
    <Tabs
      items={tabs}
      value={activeTab}
      defaultValue={activeTab}
      onValueChange={updateActiveTab}
      tabsListClassName="w-min border-b-0 gap-2"
      triggerClassName={'px-0 py-0 text-xs font-normal'}
    />
  );
};

export default StickyTabs;
