import { PropsWithChildren, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import scssTransitions from 'src/styles/transitions.module.scss';

const { transitionDuration, transitionTimingFunction } = scssTransitions;

interface WidthTransitionProps {
  id: string;
}

export const WidthTransition = ({ id, children }: PropsWithChildren<WidthTransitionProps>) => {
  const [enteringWidth, setEnteringWidth] = useState('auto');

  const ref = useRef(null);

  const onExit = (node: HTMLElement) => {
    setEnteringWidth(`${node.offsetWidth.toString()}px`);
  };

  const onEntering = (node: HTMLElement) => {
    setEnteringWidth(`${node.offsetWidth.toString()}px`);
  };

  const onEntered = () => {
    setEnteringWidth('auto');
  };

  return (
    <TransitionGroup
      mode="out-in"
      className="relative inline-flex"
      style={{
        transition: `width ${transitionDuration} ${transitionTimingFunction}`,
        width: enteringWidth,
      }}
    >
      <CSSTransition
        key={id}
        timeout={parseInt(transitionDuration)}
        classNames="opacity"
        onExit={onExit}
        onEntering={onEntering}
        onEntered={onEntered}
      >
        <div className="whitespace-nowrap overflow-hidden" ref={ref}>
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};
