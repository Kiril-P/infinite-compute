import type { ReactNode, Ref } from 'react';
import type { ApplicationId } from '../../app/navigation';

type WindowFrameProps = {
  id: ApplicationId;
  title: string;
  number: string;
  active: boolean;
  titleRef: Ref<HTMLHeadingElement>;
  onFocus: () => void;
  children: ReactNode;
};

export function WindowFrame({
  id,
  title,
  number,
  active,
  titleRef,
  onFocus,
  children,
}: WindowFrameProps) {
  return (
    <section
      className="window"
      id={id}
      aria-labelledby={`${id}-title`}
      data-active={active}
      data-utility={id !== 'job-runner' && id !== 'hardware-manager'}
      onFocus={onFocus}
    >
      <header className="window-titlebar">
        <span className="window-number" aria-hidden="true">
          {number}
        </span>
        <h2 ref={titleRef} id={`${id}-title`} tabIndex={-1}>
          {title}
        </h2>
        <span className="window-grip" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </header>
      <div className="window-body">{children}</div>
    </section>
  );
}
