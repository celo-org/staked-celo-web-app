import { PropsWithChildren } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import scssTransitions from 'src/styles/transitions.module.scss';

const { transitionDuration } = scssTransitions;

interface OpacityTransitionProps {
  id: string;
  classes?: string;
}

export const OpacityTransition = ({
  id,
  children,
  classes = '',
}: PropsWithChildren<OpacityTransitionProps>) => (
  <TransitionGroup className={`relative ${classes}`}>
    <CSSTransition key={id} timeout={parseInt(transitionDuration)} classNames="opacity">
      {children}
    </CSSTransition>
  </TransitionGroup>
);
