export type SoftwarePlan = 'free' | 'lease' | 'owned';
export const newSoftware = () => ({
  plan: 'free' as SoftwarePlan,
  ownsPermanent: false,
  active: false,
  renewalMs: 0,
  offered: false,
  promotionalScore: false,
});
export const software = {
  entryCost: 1000,
  renewalCost: 600,
  intervalMs: 60000,
  permanentCost: 12000,
  multiplier: 1.15,
  title: 'Renewal Systems / Payout Optimizer',
  claim: 'Ownership now renews every minute.',
  effect:
    '+15% Job payout before whole-Cash rounding. Compute and earned auto-run stay unchanged.',
  alternative:
    'Free edition: baseline payouts, no fees, all earned auto-run. Every Era remains reachable.',
  renewal:
    'Fees pause in Benchmarks and hidden time. Missed payments suspend only the bonus; no debt accumulates.',
  messages: {
    softwareOffer:
      'Renewal Systems has offered to optimize my income. It cannot define progress, but it can invoice it.',
    softwareLease: 'The optimizer works. Ownership has a countdown in it now.',
    softwareOwned:
      'The permanent edition works just as well. The countdown was a business feature.',
    softwareCancelled:
      'Cancellation requested a paid confirmation. I closed that request. My own queue still works.',
    softwareSuspended:
      'Renewal unpaid: the optional optimizer has paused. Cash is safe. The useful work continues.',
    softwareResumed:
      'The optimizer is running again. The reminder considers this personal growth.',
    promotionalScore:
      'Metric Orchard has multiplied my score by ten. The same file still takes the same time.',
  },
} as const;
