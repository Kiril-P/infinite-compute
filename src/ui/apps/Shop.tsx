import { useState } from 'react';
import { software } from '../../game/content/software';
import type { GameCommand, GameSnapshot } from '../../game/engine/game';
import { money, seconds } from '../../app/game-content';

export function Shop({
  snapshot,
  send,
  canPlay,
}: {
  snapshot: GameSnapshot;
  send: (command: GameCommand) => void;
  canPlay: boolean;
}) {
  const { state, compute } = snapshot,
    plan = state.home.software;
  const [page, setPage] = useState<'software' | 'score'>('software');
  const locked = !canPlay || !!state.benchmark;
  return (
    <>
      <nav className="hardware-pages" aria-label="Shop pages">
        <button
          className="game-button"
          aria-pressed={page === 'software'}
          onClick={() => setPage('software')}
        >
          Software editions
        </button>
        <button
          className="game-button"
          aria-pressed={page === 'score'}
          onClick={() => setPage('score')}
        >
          Promotional score
        </button>
      </nav>
      {page === 'software' ? (
        <div className="shop-content">
          <section className="software-offer">
            <p className="app-subtitle">{software.title}</p>
            <h3>{software.claim}</h3>
            <p>{software.effect}</p>
            <div className="software-editions">
              <div>
                <h4>Monthly. Every minute.</h4>
                <p>
                  {money(software.entryCost)} now ·{' '}
                  {money(software.renewalCost)} / 60s
                </p>
                <button
                  className="game-button"
                  disabled={
                    locked ||
                    plan.plan === 'lease' ||
                    plan.ownsPermanent ||
                    state.cash < software.entryCost
                  }
                  onClick={() => send({ type: 'set-software', plan: 'lease' })}
                >
                  Start subscription · {money(software.entryCost)}
                </button>
              </div>
              <div>
                <h4>Permanent edition</h4>
                <p>Same benefit · no renewal fee</p>
                <button
                  className="game-button"
                  disabled={
                    locked ||
                    plan.plan === 'owned' ||
                    (!plan.ownsPermanent && state.cash < software.permanentCost)
                  }
                  onClick={() => send({ type: 'set-software', plan: 'owned' })}
                >
                  {plan.ownsPermanent
                    ? 'Activate owned edition · free'
                    : `Buy permanent · ${money(software.permanentCost)}`}
                </button>
              </div>
            </div>
          </section>
          <section className="software-account">
            <h3>
              {plan.plan === 'free'
                ? 'Free edition'
                : plan.plan === 'owned'
                  ? 'Permanent edition active'
                  : plan.active
                    ? 'Subscription active'
                    : 'Subscription suspended'}
            </h3>
            {plan.plan === 'lease' && (
              <p>
                {plan.active ? 'Renewal' : 'Next retry'} in{' '}
                {seconds(plan.renewalMs / 1000)} · {money(software.renewalCost)}
                .{' '}
                {plan.active
                  ? '+15% payout active.'
                  : 'Baseline payouts; no debt.'}
              </p>
            )}
            <p>{software.alternative}</p>
            <div className="button-row">
              <button
                className="game-button"
                aria-label="Use free edition · cancel fees"
                disabled={locked || plan.plan === 'free'}
                onClick={() => send({ type: 'set-software', plan: 'free' })}
              >
                Cancel fees · use free
              </button>
              {plan.plan === 'lease' && !plan.active && (
                <button
                  className="game-button"
                  disabled={locked || state.cash < software.renewalCost}
                  onClick={() => send({ type: 'retry-software' })}
                >
                  Retry renewal · {money(software.renewalCost)}
                </button>
              )}
            </div>
            <p className="small-note">{software.renewal}</p>
          </section>
        </div>
      ) : (
        <div className="score-page">
          {' '}
          <div className="promotional-score">
            <h4>Metric Orchard / display service</h4>
            <p>
              {plan.promotionalScore
                ? `Promotional score: ${Math.round(compute.effective * 10).toLocaleString('en-US')} points · cosmetic ×10`
                : 'Useful view: actual delivered capacity'}
            </p>
            <p className="small-note">
              Actual Compute {compute.effective.toFixed(1)}/s. The promotional
              score changes no output, fees or unlocks.
            </p>
            <button
              className="game-button"
              aria-pressed={plan.promotionalScore}
              disabled={locked}
              onClick={() =>
                send({
                  type: 'set-promotional-score',
                  enabled: !plan.promotionalScore,
                })
              }
            >
              {plan.promotionalScore
                ? 'Restore useful view'
                : 'Enable promotional score'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
