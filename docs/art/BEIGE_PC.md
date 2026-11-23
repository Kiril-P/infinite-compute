# Beige PC game artwork

## Current machine: SVG and CSS

The main PC is drawn in [MachineVisual.tsx](../../src/ui/components/MachineVisual.tsx) and animated in [machine.css](../../src/ui/theme/machine.css). No generated bitmap is used by the game. The monitor, terminal content/cursor, case cover, CPU/fan, RAM, keyboard, and cables are independent SVG layers. The inspector reuses the same tower drawing at a closer view.

The small presentation Interface accepts `view: 'desktop' | 'cpu' | 'ram'` and an optional `detail` crop. The shell owns the selected component. Opening Hardware Manager exposes the side panel and changes the terminal; selecting CPU or RAM highlights that part, with a small RAM inspection displacement. Returning to Job Runner closes the case. Installed CPU/RAM levels, Job/Benchmark activity, and Job progress now come from the simulation snapshot. CPU 3 adds a processor plate; RAM purchases populate additional visible sticks. Busy work accelerates the fan, pulses the drive light, and updates the terminal/progress bar. Heat visuals will arrive with their owning Era.

CSS animates the fan/cursor and state changes. The footer's Pause animation button pauses loops and removes transitions; the operating system's reduced-motion preference disables animation/transitions altogether. Selection remains visible and keyboard-accessible in either mode. Animation never awards progress or supplies a game clock.

Future hardware/Job slices should extend this rendering from their real snapshots and events. They must preserve independently replaceable component layers and avoid baking the protagonist into a generated image. Add states with the owning behavior, rather than speculative upgrade props. User feedback and this direction are recorded in D-024.

## Archived image exploration

The initial ImageGen illustration is preserved at [archive/beige-pc.png](archive/beige-pc.png) for history. It is outside `public/`, not requested at runtime, and not shipped in the production bundle. It was generated with the built-in ImageGen tool on 2026-09-07 and superseded by the user's animated-machine requirement. The original hand-authored `public/computer.svg` remains the small OS icon.

## Historical generation prompt

Use case: stylized-concept. Asset type: original pixel-art game environment illustration for a computer incremental game's hardware screen. Draw a cozy, beautifully crafted 1990s beige family computer: chunky CRT monitor with a simple mint phosphor terminal cursor, horizontal desktop case with a floppy drive beneath, tactile beige keyboard, small wired mouse and two floppy disks. Three-quarter isometric view, centered complete silhouette, dark teal shadow under the objects. Crisp deliberate low-resolution pixel art, visible square pixel clusters, limited 24-color palette of warm ivory, mustard, muted sage and deep petrol green, detailed dithering and warm highlights; looks like an inventory illustration from a premium retro indie game. A truly transparent background, no room or scenery beyond the computer equipment. All parts must fit with a little clear space around the silhouette. No logos, brand marks, people, labels, readable text, UI panels, buttons or watermarks. The computer is the hero; friendly and modest, with a green screen glow. Square composition.

## Typography

The locally served `public/fonts/Silkscreen-Regular.ttf` comes from the [official Google Fonts Silkscreen directory](https://github.com/google/fonts/tree/main/ofl/silkscreen). Its unmodified SIL Open Font License is included at `public/fonts/OFL.txt`. No remote font request is required during play.
