import {
  criticalMessages,
  journalEntries,
  type JournalId,
  type MessageId,
} from '../content/journal';
import type { GameState } from './game';
export type JournalState = {
  entries: { id: JournalId; at: number | null }[];
  pending: MessageId[];
  holdMs: number;
};
export const newJournal = (): JournalState => ({
  entries: [{ id: 'opening', at: 0 }],
  pending: [],
  holdMs: 10000,
});
export function recordEntry(
  journal: JournalState,
  id: JournalId,
  at: number | null,
) {
  if (journal.entries.some((entry) => entry.id === id)) return false;
  journal.entries.push({ id, at });
  return true;
}
export function recordMessage(
  journal: JournalState,
  id: MessageId,
  at: number,
): MessageId | null {
  if (!recordEntry(journal, id, at)) return null;
  const critical = journalEntries[id].critical;
  if (journal.holdMs > 0) {
    if (critical) journal.pending.push(id);
    return null;
  }
  if (critical) journal.holdMs = 10000;
  return id;
}
export function advanceJournal(journal: JournalState): MessageId | null {
  journal.holdMs = Math.max(0, journal.holdMs - 100);
  if (journal.holdMs > 0 || !journal.pending.length) return null;
  journal.holdMs = 10000;
  return journal.pending.shift()!;
}
// Only recover facts that older saves actually tracked. Unknown times stay unknown.
export function legacyJournal(state: GameState): JournalState {
  const journal: JournalState = {
    entries: [{ id: 'opening', at: 0 }],
    pending: [],
    holdMs: 0,
  };
  const milestones = state.milestones;
  if (milestones.firstJobMs !== null) {
    recordEntry(journal, 'firstJob', milestones.firstJobMs);
    recordEntry(journal, 'first-result', milestones.firstJobMs);
  }
  if (milestones.firstPurchaseMs !== null)
    recordEntry(journal, 'firstPurchase', milestones.firstPurchaseMs);
  if (milestones.automationMs !== null) {
    recordEntry(journal, 'payroll', milestones.automationMs);
    recordEntry(journal, 'queue-owned', milestones.automationMs);
  }
  if (state.home.reached) {
    recordEntry(journal, 'transition', state.home.transitionMs);
    recordEntry(journal, 'home-kept', state.home.transitionMs);
    recordEntry(journal, 'desk-expanded', state.home.transitionMs);
  }
  if (state.home.queue.unlocked) {
    recordEntry(journal, 'memory', null);
    recordEntry(journal, 'memory-mastered', null);
  }
  if (state.home.queue.completed.photo)
    recordEntry(journal, 'photo-restored', null);
  if (state.home.queue.completed.logo)
    recordEntry(journal, 'graphics-news', null);
  if (state.home.software.offered) recordEntry(journal, 'softwareOffer', null);
  recordEntry(journal, state.message, null);
  return journal;
}
export const isCriticalMessage = (id: string): id is MessageId =>
  criticalMessages.includes(id as MessageId);
