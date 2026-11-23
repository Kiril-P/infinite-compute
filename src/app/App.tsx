import { ResearchLab } from '../ui/apps/ResearchLab';
import { useLayoutEffect, useRef, useState } from 'react';
import { HardwareManager } from '../ui/apps/HardwareManager';
import { JobRunner } from '../ui/apps/JobRunner';
import { Settings } from '../ui/apps/Settings';
import { TaskManager } from '../ui/apps/TaskManager';
import { Shop } from '../ui/apps/Shop';
import type { InspectedPart } from '../ui/components/MachineVisual';
import { CurrentObjective } from '../ui/os/CurrentObjective';
import { GlobalStatus } from '../ui/os/GlobalStatus';
import { WindowFrame } from '../ui/os/WindowFrame';
import { gameMessages } from '../game/content/home';
import { applications, currentObjective, money } from './game-content';
import type { ApplicationId, Navigate } from './navigation';
import { shellContent } from './shell-content';
import { useGame } from './use-game';
import '../ui/theme/gameplay.css';

export function App() {
  const { session, snapshot } = useGame();
  const { state, compute } = snapshot;
  const [selectedApplication, setActiveApplication] =
    useState<ApplicationId>('job-runner');
  const activeApplication =
    snapshot.status === 'recovery' || snapshot.status === 'read-only'
      ? 'settings'
      : selectedApplication;
  const [inspectedPart, setInspectedPart] = useState<InspectedPart>('cpu');
  const titles = useRef<
    Partial<Record<ApplicationId, HTMLHeadingElement | null>>
  >({});
  const [focusRequest, setFocusRequest] = useState<{
    applicationId: ApplicationId;
  } | null>(null);
  useLayoutEffect(() => {
    if (focusRequest)
      titles.current[focusRequest.applicationId]?.focus({
        preventScroll: true,
      });
  }, [focusRequest]);
  const navigate: Navigate = (command) => {
    if (command.applicationId === 'shop')
      session.send({ type: 'inspect-software' });
    setActiveApplication(command.applicationId);
    setFocusRequest({ applicationId: command.applicationId });
  };
  const taskManagerVisible = state.hardware.cpu + state.hardware.ram > 0;
  const machineView =
    activeApplication === 'hardware-manager' ? inspectedPart : 'desktop';
  const utility =
    activeApplication === 'settings' ||
    activeApplication === 'task-manager' ||
    activeApplication === 'shop' ||
    activeApplication === 'research-lab';
  return (
    <div
      className="desktop"
      data-era={
        state.workstation.reached
          ? 'workstation'
          : state.home.reached
            ? 'home'
            : 'beige'
      }
      data-motion-paused={state.settings.motionPaused}
    >
      <header className="os-header">
        <div className="os-brand">
          <img src="/computer.svg" alt="" width="34" height="30" />
          <h1>{shellContent.name}</h1>
        </div>
        <span className="os-edition">
          {state.workstation.reached
            ? 'LAB SYSTEM / 0.3'
            : state.home.reached
              ? 'DESKTOP SYSTEM / 0.2'
              : 'PERSONAL SYSTEM / 0.1'}
        </span>
        <button
          className="save-indicator"
          onClick={() =>
            navigate({ type: 'focus-application', applicationId: 'settings' })
          }
        >
          {snapshot.status === 'saved'
            ? 'Saved locally'
            : snapshot.status === 'loading'
              ? 'Loading save…'
              : snapshot.status === 'read-only'
                ? 'Paused · another tab'
                : snapshot.status === 'recovery'
                  ? 'Save recovery needed'
                  : 'Unsaved · open Settings'}
        </button>
      </header>
      <GlobalStatus
        era={
          state.workstation.reached
            ? 'Workstation'
            : state.home.reached
              ? 'Home PC'
              : 'Beige PC'
        }
        edition={
          state.workstation.reached
            ? 'LAB SYSTEM / 003'
            : state.home.reached
              ? 'DESKTOP SYSTEM / 002'
              : 'LOCAL MACHINE / 001'
        }
        status={[
          {
            label: 'Cash',
            value: money(state.cash),
            note: `${state.completedJobs} Jobs completed`,
          },
          {
            label: 'Compute',
            value: `${compute.effective.toFixed(2)}/s`,
            note:
              state.home.gpu > 0
                ? 'CPU + graphics capacity'
                : `${compute.raw.toFixed(1)} raw work/s`,
          },
          {
            label: 'Bottleneck',
            value:
              compute.thermalFactor < 1
                ? 'Heat'
                : compute.powerFactor < 1
                  ? 'Power'
                  : compute.memoryFactor < 1
                    ? 'Memory'
                    : compute.airflowFactor < 1
                      ? 'GPU airflow'
                      : 'None',
            note:
              state.workstation.reached &&
              (compute.thermalFactor < 1 || compute.powerFactor < 1)
                ? `${Math.round(compute.thermalFactor * 100)}% heat · ${Math.round(compute.powerFactor * 100)}% power`
                : `${Math.round(compute.memoryFactor * 100)}% memory · ${Math.round(compute.airflowFactor * 100)}% airflow`,
          },
          state.workstation.reached
            ? {
                label: 'Research',
                value: String(state.workstation.research.points),
                note: `${((snapshot.allocation.research / 10000) * snapshot.thermal.researchRateMultiplier).toFixed(2)}/s · ${state.workstation.research.profile}`,
              }
            : {
                label: 'Machine',
                value: state.benchmark
                  ? state.benchmark.id === 'memory'
                    ? 'Memory test'
                    : 'Payroll'
                  : state.job
                    ? 'Working'
                    : 'Standby',
                note: state.automation.enabled
                  ? 'Auto-run enabled'
                  : 'Manual Jobs',
              },
        ]}
      />
      <main>
        <CurrentObjective
          objective={currentObjective(snapshot)}
          onNavigate={navigate}
        />
        <div className="application-grid" data-utility={utility}>
          {applications.map((app, index) => (
            <WindowFrame
              key={app.id}
              id={app.id}
              title={app.title}
              number={`0${index + 1}`}
              active={activeApplication === app.id}
              titleRef={(node) => {
                titles.current[app.id] = node;
              }}
              onFocus={() => setActiveApplication(app.id)}
            >
              {app.id === 'job-runner' ? (
                <JobRunner
                  view={machineView}
                  snapshot={snapshot}
                  send={session.send}
                  canPlay={snapshot.canPlay}
                />
              ) : app.id === 'hardware-manager' ? (
                <HardwareManager
                  selectedPart={inspectedPart}
                  onInspect={(part) => {
                    setInspectedPart(part);
                    session.send({ type: 'inspect-case' });
                  }}
                  snapshot={snapshot}
                  send={session.send}
                  canPlay={snapshot.canPlay}
                />
              ) : app.id === 'task-manager' ? (
                <TaskManager
                  snapshot={snapshot}
                  send={session.send}
                  canPlay={snapshot.canPlay}
                />
              ) : app.id === 'research-lab' ? (
                <ResearchLab
                  snapshot={snapshot}
                  send={session.send}
                  canPlay={snapshot.canPlay}
                />
              ) : app.id === 'shop' ? (
                <Shop
                  snapshot={snapshot}
                  send={session.send}
                  canPlay={snapshot.canPlay}
                />
              ) : (
                <Settings
                  session={session}
                  snapshot={snapshot}
                  onNavigate={navigate}
                />
              )}
            </WindowFrame>
          ))}
        </div>
        <aside
          className="system-message"
          aria-labelledby="system-message-title"
        >
          <h2 className="eyebrow" id="system-message-title">
            <span className="message-glyph" aria-hidden="true">
              &gt;_
            </span>
            System Message
          </h2>
          <p>{gameMessages[state.message]}</p>
          <span className="small-note">
            {state.completedJobs > 0
              ? 'Directive still unresolved'
              : 'Pending clarification'}
          </span>
        </aside>
      </main>
      <footer className="taskbar">
        <nav aria-label="Applications">
          {applications
            .filter((app) => app.id !== 'task-manager' || taskManagerVisible)
            .filter((app) => app.id !== 'shop' || state.home.reached)
            .filter(
              (app) => app.id !== 'research-lab' || state.workstation.reached,
            )
            .map((app) => (
              <button
                key={app.id}
                aria-controls={app.id}
                aria-pressed={activeApplication === app.id}
                onClick={() =>
                  navigate({ type: 'focus-application', applicationId: app.id })
                }
              >
                <span className="app-glyph" aria-hidden="true">
                  {app.glyph}
                </span>
                {app.title}
              </button>
            ))}
        </nav>
        <button
          className="motion-toggle"
          disabled={!snapshot.canPlay}
          aria-pressed={state.settings.motionPaused}
          onClick={() =>
            session.send({
              type: 'configure',
              settings: { motionPaused: !state.settings.motionPaused },
            })
          }
        >
          Pause animation
        </button>
      </footer>
    </div>
  );
}
