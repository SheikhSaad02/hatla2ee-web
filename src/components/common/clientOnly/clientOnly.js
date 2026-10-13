'use client';

import { useEffect, useState } from 'react';

export default function ClientOnly({ children, skeleton }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return skeleton ? skeleton : null;
  return <>{children}</>;
}
