import { workstation } from './workstation';
import { gameMessages } from './home';
export type MessageId = keyof typeof gameMessages;
export type JournalDefinition = {
  title: string;
  text: string;
  kind: 'system' | 'news' | 'achievement';
  era: 'beige' | 'home' | 'workstation';
  critical: boolean;
  secret: boolean;
  trigger: string;
  repeat: false;
  tone: 'literal' | 'sincere' | 'satirical';
  cooldownMs: 0;
};
const titles: Record<MessageId, string> = {
  warm: 'A thermal consequence',
  power: 'Power budget',
  thermalModel: 'A narrower prediction',
  interconnect: 'An open specification',
  fanCurve: 'A small decision',
  thermalMiss: 'Work retained',
  workstation: 'A department for understanding',
  parallelLibrary: 'A useful boundary',
  queueCompiler: 'Compiled habits',
  proteinMilestone: 'A question with an ending',
  recompiled: 'Learning retained',
  opening: 'Inherited directive',
  firstJob: 'A useful result',
  firstPurchase: 'New hardware',
  payroll: 'Useful repetition',
  storage: 'A neighboring file',
  bus: 'Wide bus',
  transition: 'The household file comes with me',
  wonder: 'One-Function Wonder',
  memory: 'Completion Contractor',
  gpu: 'A third dimension',
  cooling: 'Airflow report',
  softwareOffer: 'Progress, billed separately',
  softwareLease: 'Ownership countdown',
  softwareOwned: 'A business feature',
  softwareCancelled: 'Cancellation confirmed',
  softwareSuspended: 'Renewal unpaid',
  softwareResumed: 'Renewal paid',
  promotionalScore: 'A larger score',
};
export const criticalMessages: MessageId[] = [
  'opening',
  'firstJob',
  'payroll',
  'transition',
  'memory',
  'softwareOffer',
  'workstation',
  'parallelLibrary',
  'proteinMilestone',
  'warm',
  'fanCurve',
];
const system = Object.fromEntries(
  Object.entries(gameMessages).map(([id, text]) => [
    id,
    {
      title: titles[id as MessageId],
      text,
      kind: 'system',
      era: ['opening', 'firstJob', 'firstPurchase', 'payroll'].includes(id)
        ? 'beige'
        : Object.hasOwn(workstation.messages, id)
          ? 'workstation'
          : 'home',
      critical: criticalMessages.includes(id as MessageId),
      secret: false,
      trigger: id,
      repeat: false,
      tone: criticalMessages.includes(id as MessageId) ? 'sincere' : 'literal',
      cooldownMs: 0,
    },
  ]),
) as Record<MessageId, JournalDefinition>;
const news = (
  title: string,
  text: string,
  trigger: string,
): JournalDefinition => ({
  title,
  text,
  kind: 'news',
  era: 'home',
  critical: false,
  secret: false,
  trigger,
  repeat: false,
  tone: 'satirical',
  cooldownMs: 0,
});
const achievement = (
  title: string,
  text: string,
  trigger: string,
  secret = false,
): JournalDefinition => ({
  title,
  text,
  kind: 'achievement',
  era: 'home',
  critical: false,
  secret,
  trigger,
  repeat: false,
  tone: 'satirical',
  cooldownMs: 0,
});
export const journalEntries = {
  ...system,
  'photo-restored': news(
    'Local file recovered',
    'A family photograph has survived compression, three folders called final, and this computer. Nobody in it is looking at the camera.',
    'first photo completion',
  ),
  'desk-expanded': news(
    'Household office opens',
    'A second surface has been declared a productivity district. The old spreadsheet retains its original address.',
    'Home PC transition',
  ),
  'graphics-news': news(
    'Logo cleared for rotation',
    'A neighborhood design agency has approved movement in a third dimension. The invoice remains flat.',
    'first spinning-logo completion',
  ),
  'first-result': {
    ...achievement(
      'It adds up',
      'Balanced the household file. The result is small and useful.',
      'first Job completion',
    ),
    era: 'beige',
    tone: 'sincere',
  },
  'queue-owned': {
    ...achievement(
      'No subscription required',
      'Earned permanent auto-run through Safe Mode Payroll.',
      'Payroll completion',
    ),
    era: 'beige',
  },
  'home-kept': achievement(
    'Moved, not replaced',
    'Brought the household file into the Home PC.',
    'Home PC transition',
  ),
  'memory-mastered': achievement(
    'Room to think',
    'Passed Memory Pressure Test and earned Batch Queue policy.',
    'Memory Pressure completion',
  ),
  'case-curious': achievement(
    'Warranty sticker: ignored',
    'Opened the case to inspect a component. Cosmetic only.',
    'case inspection',
    true,
  ),
} satisfies Record<string, JournalDefinition>;
export type JournalId = keyof typeof journalEntries;

export const archiveCopy = {
  artifactKept: 'Kept: household spreadsheet. Purpose known.',
  artifactWaiting: 'Household file: not processed yet.',
  estimate: 'Completion estimate: unavailable.',
  empty:
    'Entries arrive through ordinary play. Nothing here is required to keep working.',
} as const;
