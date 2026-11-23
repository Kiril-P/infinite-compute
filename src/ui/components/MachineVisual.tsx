import { useId, type CSSProperties } from 'react';
import { shellContent } from '../../app/shell-content';
import '../theme/machine.css';

export type HardwarePart = 'cpu' | 'ram';
export type InspectedPart = HardwarePart | 'gpu' | 'cooling';
export type MachineView = 'desktop' | InspectedPart;

type MachineVisualProps = {
  view: MachineView;
  detail?: boolean;
  era?: 'beige' | 'home' | 'workstation';
  jobLabel?: string;
  hardware?: Record<HardwarePart, number>;
  homeParts?: { gpu: number; cooling: number };
  activity?: 'idle' | 'working' | 'benchmark';
  progress?: number;
  temperature?: number;
  fanCurve?: boolean;
  researchShare?: number;
  researchProgress?: number;
};

// Presentation only: installed parts and activity come from the simulation snapshot.
export function MachineVisual({
  view,
  detail = false,
  era = 'beige',
  jobLabel,
  hardware = { cpu: 0, ram: 0 },
  homeParts = { gpu: 0, cooling: 0 },
  activity = 'idle',
  progress = 0,
  temperature = 30,
  fanCurve = false,
  researchShare = 0,
  researchProgress = 0,
}: MachineVisualProps) {
  const titleId = useId();
  const content = shellContent.machine;
  const screen =
    view === 'desktop' && activity !== 'idle'
      ? [
          jobLabel ?? content.activityScreens[activity][0],
          content.activityScreens[activity][1],
        ]
      : content.screens[view];

  return (
    <svg
      className={`machine-visual${detail ? ' machine-visual--detail' : ''}`}
      viewBox={detail ? '318 70 144 248' : '0 0 480 350'}
      role="img"
      aria-labelledby={titleId}
      data-view={view}
      data-era={era}
      data-activity={activity}
      data-cpu-upgraded={hardware.cpu >= 3}
      data-gpu={homeParts.gpu}
      data-cooling={homeParts.cooling}
      data-researching={researchShare > 0}
      data-fan-curve={fanCurve}
      data-temperature={temperature.toFixed(1)}
      style={
        {
          '--fan-duration': `${Math.max(0.3, 2.4 - (temperature - 30) / 35 - (fanCurve ? 0.3 : 0))}s`,
        } as CSSProperties
      }
    >
      <title id={titleId}>
        {detail
          ? content.caseLabel
          : era === 'workstation'
            ? 'Workstation.'
            : era === 'home'
              ? 'Home PC.'
              : content.label}{' '}
        {view === 'desktop'
          ? `Case closed. ${content.activityDescriptions[activity]}`
          : content.descriptions[view]}
        {era === 'workstation'
          ? ` ${temperature.toFixed(1)} degrees Celsius. ${fanCurve ? 'Automatic fan curve active.' : ''}`
          : ''}
      </title>
      {!detail && (
        <>
          {era === 'workstation' ? (
            <WorkstationDesk
              screen={screen}
              progress={progress}
              researchShare={researchShare}
              researchProgress={researchProgress}
              temperature={temperature}
            />
          ) : (
            era === 'home' && (
              <HomeDesk
                screen={screen}
                progress={progress}
                active={activity !== 'idle'}
              />
            )
          )}
          <path d="M29 304 331 274 465 312 204 344Z" fill="#141a18" />
          <path
            d="M278 274C314 275 300 306 341 307S395 301 385 285"
            className="pc-cable"
          />
          <path d="M117 278C92 285 99 298 119 300" className="pc-cable" />
          <g
            className="pc-monitor"
            style={era !== 'beige' ? { display: 'none' } : undefined}
          >
            <path
              d="M136 229H190V265H136Z"
              fill="#9c9781"
              stroke="#292f29"
              strokeWidth="3"
            />
            <path d="M136 242H190V251H136Z" fill="#767a68" />
            <path
              d="M120 263H198L223 278V286H95V278Z"
              fill="#beb89d"
              stroke="#292f29"
              strokeWidth="3"
            />
            <path d="M95 278H223" stroke="#e2d9b7" strokeWidth="3" />
            <path
              d="M64 67 88 46H297L277 67Z"
              fill="#e0d6b3"
              stroke="#292f29"
              strokeWidth="3"
            />
            <path
              d="M277 67 297 46V205L277 229Z"
              fill="#858977"
              stroke="#292f29"
              strokeWidth="3"
            />
            <rect
              x="64"
              y="67"
              width="213"
              height="164"
              rx="5"
              fill="#c5bd9e"
              stroke="#292f29"
              strokeWidth="3"
            />
            <path
              d="M71 73H270M71 73V222"
              stroke="#eee3c0"
              strokeWidth="3"
              fill="none"
            />
            <path d="M83 83H257V199H83Z" fill="#6e7563" />
            <path
              d="M87 88H253V195H87Z"
              fill="#162a24"
              stroke="#313f33"
              strokeWidth="4"
            />
            <path d="M91 92H249V107H91Z" fill="#263c2e" />
            <g className="pc-terminal" fill="#aaca9d">
              <text x="101" y="103" fontSize="8">
                {content.screenName}
              </text>
              <text x="101" y="132" fontSize="11">
                {screen[0]}
              </text>
              <text x="101" y="150" fontSize="9" fill="#7e9d80">
                {screen[1]}
              </text>
              <text x="101" y="175" fontSize="10">
                {content.prompt}
              </text>
              <path className="pc-cursor" d="M118 168H125V178H118Z" />
            </g>
            {activity === 'working' && (
              <rect
                x="101"
                y="183"
                height="3"
                width={Math.max(0, Math.min(1, progress)) * 136}
                fill="#aaca9d"
              />
            )}
            <path d="M91 188H249" stroke="#456247" opacity=".3" />
            <path d="M287 76V156M291 72V150" stroke="#4c574b" strokeWidth="2" />
            <path d="M83 213H135" stroke="#989c82" strokeWidth="3" />
            <rect x="234" y="211" width="14" height="9" rx="2" fill="#767e67" />
            <rect x="256" y="213" width="5" height="4" fill="#b5d59b" />
          </g>
        </>
      )}
      <g className="pc-tower">
        <path
          d="M331 111 397 83H450L380 112Z"
          fill="#d8ceb0"
          stroke="#292f29"
          strokeWidth="3"
        />
        <path
          d="M380 112 450 83V273L380 304Z"
          fill="#444f42"
          stroke="#292f29"
          strokeWidth="3"
        />
        <g transform="matrix(.7 -.3 0 1 380 117)">
          <rect x="5" y="1" width="88" height="180" fill="#7b8068" />
          <rect
            x="11"
            y="37"
            width="72"
            height="129"
            fill="#314e3d"
            stroke="#a9a185"
            strokeWidth="2"
          />
          <path
            d="M20 49H41V83H72M22 156V113H63V150H75M25 42V63M17 135H53V160"
            fill="none"
            stroke="#6d8660"
            strokeWidth="2"
          />
          <rect
            x="10"
            y="7"
            width="74"
            height="23"
            fill="#acac91"
            stroke="#303b31"
            strokeWidth="2"
          />
          <path
            d="M18 14H76M18 19H76M18 24H76"
            stroke="#6f7967"
            strokeWidth="2"
          />
          <g className="pc-cpu">
            {hardware.cpu >= 3 && (
              <rect x="14" y="53" width="51" height="51" fill="#c6c7a3" />
            )}
            <rect
              x="18"
              y="57"
              width="43"
              height="43"
              rx="2"
              fill="#848c75"
              stroke="#b5b99a"
              strokeWidth="2"
            />
            <path
              d="M20 61H59M20 67H59M20 73H59M20 79H59M20 85H59M20 91H59M20 97H59"
              stroke="#4f614e"
              strokeWidth="2"
            />
            <circle
              cx="39.5"
              cy="78.5"
              r="17"
              fill="#283b30"
              stroke="#b3b69a"
              strokeWidth="2"
            />
            <g className="pc-fan">
              <path
                d="M40 79C21 64 42 59 41 72ZM40 79C55 60 60 81 47 80ZM40 79C59 94 38 99 39 86ZM40 79C25 98 20 77 33 78Z"
                fill="#9ea68a"
              />
              <circle cx="40" cy="79" r="4" fill="#c9c5a4" />
            </g>
          </g>
          <g className="pc-ram">
            {[62, 72, 82].slice(0, Math.min(3, hardware.ram + 1)).map((x) => (
              <g key={x}>
                <rect
                  x={x}
                  y="51"
                  width="7"
                  height="62"
                  fill="#aaba87"
                  stroke="#142d21"
                  strokeWidth="2"
                />
                {[56, 68, 80, 92].map((y) => (
                  <rect
                    key={y}
                    x={x + 1}
                    y={y}
                    width="5"
                    height="8"
                    fill="#283d2c"
                  />
                ))}
                <path d={`M${x} 110h7`} stroke="#ceb779" strokeWidth="3" />
              </g>
            ))}
          </g>
          <path
            d="M21 126H54M21 135H54M21 144H54"
            stroke="#b7b39b"
            strokeWidth="4"
          />
          <g className="pc-gpu">
            {Array.from({ length: homeParts.gpu }, (_, index) => (
              <g
                key={index}
                transform={`translate(15 ${119 + index * (era === 'workstation' ? 7 : 11)})`}
              >
                <path d="M0 0H65V9H0Z" fill="#416585" stroke="#adc1c5" />
                <path d="M5 9H53" stroke="#d2ae63" strokeWidth="2" />
                <path d="M7 2H21V7H7ZM27 2H41V7H27Z" fill="#192e42" />
                <circle cx="54" cy="4" r="4" fill="#172c3c" />
                <path
                  className="pc-graphics-fan"
                  d="M54 1V7M51 4H57"
                  stroke="#c2d3dc"
                />
              </g>
            ))}
          </g>
          <g className="pc-cooling">
            {Array.from({ length: homeParts.cooling }, (_, index) => (
              <g
                key={index}
                transform={`translate(${era === 'workstation' ? 20 + index * 15 : 24 + index * 22} 169) scale(${era === 'workstation' ? 0.75 : 1})`}
              >
                <rect
                  x="-9"
                  y="-9"
                  width="18"
                  height="18"
                  rx="2"
                  fill="#152e42"
                  stroke="#bed3da"
                />
                <g className="pc-case-fan">
                  <path
                    d="M0 0C-12 -9 1 -10 0 -4ZM0 0C9 -12 10 1 4 0ZM0 0C12 9 -1 10 0 4ZM0 0C-9 12 -10 -1 -4 0Z"
                    fill="#8cb1c7"
                  />
                  <circle r="2" fill="#e7d7b3" />
                </g>
              </g>
            ))}
          </g>
          <path
            d="M86 22C99 78 77 140 83 173"
            stroke="#d0b987"
            strokeWidth="4"
            fill="none"
          />
          <g className="pc-case-cover">
            <rect
              x="0"
              y="-1"
              width="100"
              height="188"
              fill="#949983"
              stroke="#292f29"
              strokeWidth="3"
            />
            <path d="M5 4H94V180H5Z" fill="none" stroke="#bcc1a3" />
            {[115, 123, 131, 139, 147, 155].map((y) => (
              <path
                key={y}
                d={`M22 ${y}H75`}
                stroke="#667460"
                strokeWidth="3"
              />
            ))}
            <path d="M87 15h5M87 170h5" stroke="#434f40" strokeWidth="2" />
          </g>
        </g>
        <path
          d="M331 112H380V304H331Z"
          fill="#c9c2a4"
          stroke="#292f29"
          strokeWidth="3"
        />
        <path
          d="M335 117H375V298"
          stroke="#eee0ba"
          fill="none"
          strokeWidth="2"
        />
        <rect
          x="339"
          y="126"
          width="33"
          height="21"
          fill="#979d84"
          stroke="#697b68"
        />
        <path d="M343 138H368" stroke="#263e32" strokeWidth="3" />
        <rect
          x="339"
          y="154"
          width="33"
          height="11"
          fill="#b2b59a"
          stroke="#858f78"
        />
        <circle
          cx="355"
          cy="185"
          r="6"
          fill="#939e82"
          stroke="#586d55"
          strokeWidth="2"
        />
        <rect x="342" y="204" width="5" height="4" fill="#bcd99c" />
        <rect
          className="pc-drive-light"
          x="354"
          y="204"
          width="5"
          height="4"
          fill="#756f54"
        />
        {[228, 235, 242, 249, 256, 263, 270].map((y) => (
          <path key={y} d={`M340 ${y}H371`} stroke="#8d9b80" strokeWidth="3" />
        ))}
        {fanCurve && (
          <text x="340" y="220" fontSize="6" fill="#132d2b">
            AUTO FAN
          </text>
        )}
        <path
          d="M335 307H345M369 307H379M438 279H448"
          stroke="#15271d"
          strokeWidth="5"
        />
      </g>
      {!detail && (
        <g className="pc-keyboard">
          <path
            d="M65 286H251L280 318V326H44V318Z"
            fill="#b4b298"
            stroke="#292f29"
            strokeWidth="3"
          />
          <path d="M44 318H280" stroke="#e6dabc" strokeWidth="2" />
          {[0, 1, 2].map((row) => (
            <g
              key={row}
              transform={`translate(${68 - row * 5} ${291 + row * 7}) skewX(-18)`}
            >
              {Array.from({ length: 16 }, (_, key) => (
                <rect
                  key={key}
                  x={key * 11}
                  width="8"
                  height="5"
                  fill={key === 0 ? '#6f7c69' : '#d9d1b0'}
                  stroke="#8a957e"
                  strokeWidth=".7"
                />
              ))}
            </g>
          ))}
          <path d="M107 311H190V316H107Z" fill="#d9d1b0" stroke="#8a957e" />
          <path
            d="M301 303C312 291 332 295 335 307L341 321C342 334 311 336 307 324Z"
            fill="#c9c2a4"
            stroke="#292f29"
            strokeWidth="3"
          />
          <path
            d="M301 305 336 309M317 298 320 307"
            stroke="#8b947c"
            strokeWidth="2"
          />
        </g>
      )}
    </svg>
  );
}

function HomeDesk({
  screen,
  progress,
  active,
}: {
  screen: readonly string[];
  progress: number;
  active: boolean;
}) {
  return (
    <g className="home-desk">
      <path
        d="M6 284 137 238 480 290 477 314 176 350 6 310Z"
        fill="#5e687a"
        stroke="#172330"
        strokeWidth="3"
      />
      <path d="M6 284 176 327 480 290 137 246Z" fill="#8490a2" />
      <path d="M19 312V338M457 316V340" stroke="#465366" strokeWidth="12" />
      <path
        d="M18 44H314V231H18Z"
        fill="#142332"
        stroke="#a2b8cd"
        strokeWidth="5"
      />
      <path d="M27 53H305V218H27Z" fill="#0a2138" />
      <path d="M28 54H304V76H28Z" fill="#2f587f" />
      <text x="39" y="69" fill="#c2d9ed" fontSize="9">
        DESKTOP / 002
      </text>
      <path
        d="M29 199 94 118 174 173 225 102 304 161V218H29Z"
        fill="#164866"
        opacity=".6"
      />
      <path d="M57 91H268V181H57Z" fill="#123146" stroke="#6e9eb8" />
      <path d="M58 92H267V106H58Z" fill="#457290" />
      <text x="67" y="102" fontSize="7" fill="#d6e9ee">
        PROCESS MONITOR
      </text>
      <text x="70" y="127" fontSize="10" fill="#e6e8d9">
        {screen[0]?.slice(0, 27)}
      </text>
      <text x="70" y="144" fontSize="8" fill="#9dc3d9">
        {screen[1]}
      </text>
      <path className="pc-cursor" d="M70 157H77V166H70Z" fill="#d4d8a5" />
      {active && (
        <rect
          x="84"
          y="161"
          width={Math.max(0, Math.min(1, progress)) * 160}
          height="4"
          fill="#d3b886"
        />
      )}
      <path
        d="M143 233H183L188 256 217 269H109L139 256Z"
        fill="#a9b7c1"
        stroke="#384958"
        strokeWidth="3"
      />
      {[15, 287].map((x) => (
        <g key={x} transform={`translate(${x} 239)`} className="home-speaker">
          <path
            d="M0 0 13 -6 33 0V42H0Z"
            fill="#bec8cb"
            stroke="#374959"
            strokeWidth="2"
          />
          <circle cx="16" cy="23" r="10" fill="#283b4a" />
          <circle cx="16" cy="23" r="5" fill="#64788b" />
        </g>
      ))}
      <path d="M34 10H168V30H34Z" fill="#293746" stroke="#738393" />
      <text x="42" y="24" fontSize="8" fill="#b1d1d8">
        HOUSEHOLD FILE / KEPT
      </text>
    </g>
  );
}

function WorkstationDesk({
  screen,
  progress,
  researchShare,
  researchProgress,
  temperature,
}: {
  screen: readonly string[];
  progress: number;
  researchShare: number;
  researchProgress: number;
  temperature: number;
}) {
  return (
    <g className="workstation-desk">
      <path
        d="M0 274 134 235 480 281V313L176 349 0 307Z"
        fill="#373b40"
        stroke="#161a20"
        strokeWidth="3"
      />
      <path d="M0 274 176 319 480 281 134 235Z" fill="#727675" />
      <path d="M15 310V343M461 316V343" stroke="#333942" strokeWidth="12" />
      <path
        d="M19 29H190V254H19Z"
        fill="#212930"
        stroke="#aab4b1"
        strokeWidth="4"
      />
      <path d="M27 38H182V243H27Z" fill="#101b20" />
      <path
        d="M199 76H314V235H199Z"
        fill="#212930"
        stroke="#aab4b1"
        strokeWidth="4"
      />
      <path d="M207 85H306V225H207Z" fill="#111f26" />
      <path d="M87 257H121V274H87ZM240 238H269V258H240Z" fill="#aab4b1" />
      <text x="38" y="55" fill="#dec596" fontSize="9">
        LAB / 003
      </text>
      <text x="38" y="82" fill="#bac9cb" fontSize="8">
        JOB QUEUE
      </text>
      <text x="38" y="101" fill="#e4d6b8" fontSize="8">
        {screen[0]?.slice(0, 25)}
      </text>
      <path d="M38 119H169" stroke="#36464a" strokeWidth="5" />
      <path
        d={`M38 119h${Math.max(0, Math.min(1, progress)) * 131}`}
        stroke="#d7b573"
        strokeWidth="5"
      />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <path
            d={`M38 ${144 + i * 15}h${90 - i * 14}`}
            stroke="#42575b"
            strokeWidth="3"
          />
          <rect
            className="lab-packet"
            x={145}
            y={140 + i * 15}
            width="5"
            height="5"
            fill="#d7b573"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        </g>
      ))}
      <text x="38" y="211" fill="#d7b573" fontSize="8">
        {temperature.toFixed(1)}°C /{' '}
        {temperature >= 70 ? 'THROTTLED' : 'STABLE'}
      </text>
      <text x="38" y="228" fill="#789b95" fontSize="7">
        HOUSEHOLD FILE / KEPT
      </text>
      <text x="216" y="101" fill="#87bbaa" fontSize="7">
        RESEARCH
      </text>
      <g stroke="#415d5d" fill="#8bbcae">
        <path
          d="M223 134 254 121 283 147 244 172 224 197 287 202M254 121 244 172 283 147 287 202"
          fill="none"
        />
        {[
          [223, 134],
          [254, 121],
          [283, 147],
          [244, 172],
          [224, 197],
          [287, 202],
        ].map(([x, y], i) => (
          <circle
            key={i}
            className="lab-research-node"
            cx={x}
            cy={y}
            r={i === 3 ? 5 : 3}
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </g>
      <text x="217" y="218" fill="#a3c0b9" fontSize="7">
        {Math.round(researchShare * 100)}% /{' '}
        {Math.floor(researchProgress * 100)}%
      </text>
      <path d="M35 8H245V20H35Z" fill="#212930" />
      <text x="40" y="17" fill="#c1b79d" fontSize="7">
        QUESTION: STILL REQUIRES CLARIFICATION
      </text>
    </g>
  );
}
