export function getPackageCardTheme(dark) {
  return {
    card: dark
      ? 'bg-white/[0.045] ring-1 ring-inset ring-white/[0.09] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.8)]'
      : 'bg-white ring-1 ring-inset ring-gray-200 shadow-[0_24px_60px_-45px_rgba(19,37,63,0.35)]',
    cardRec: dark
      ? 'bg-white/[0.06] ring-1 ring-inset ring-secondary-300/40 shadow-[0_0_60px_-24px_rgba(240,185,70,0.35),0_30px_70px_-40px_rgba(0,0,0,0.8)]'
      : 'bg-white ring-1 ring-inset ring-secondary-300 shadow-[0_28px_70px_-42px_rgba(19,37,63,0.4)]',
    headerTint: dark
      ? 'bg-primary/[0.16] ring-1 ring-inset ring-primary/20'
      : 'bg-primary-50',
    headerTintRec: dark
      ? 'bg-[linear-gradient(135deg,rgba(124,142,255,0.22)_0%,rgba(178,140,255,0.15)_100%)] ring-1 ring-inset ring-white/10'
      : 'bg-[linear-gradient(135deg,#e9edff_0%,#f0e8ff_100%)]',
    title: dark ? 'text-white' : 'text-gray-900',
    body: dark ? 'text-white/70' : 'text-gray-600',
    strike: dark
      ? 'text-white/40 decoration-red-400'
      : 'text-gray-500 decoration-red-500',
    tick: dark ? 'text-secondary-200' : 'text-primary',
    ghost: dark
      ? 'bg-white/[0.07] text-white ring-1 ring-inset ring-white/15 hover:bg-white/[0.14]'
      : 'border border-gray-900 bg-white text-gray-900 hover:bg-gray-50',
    brand: 'bg-primary text-white hover:bg-primary-700',
  };
}
