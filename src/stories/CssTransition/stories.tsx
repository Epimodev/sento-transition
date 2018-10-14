import { createElement, Component, Fragment, ComponentType } from 'react';
import { storiesOf } from '@storybook/react';
import { CssTransition } from '../../../src/index';
import * as style from './style.scss';

const animationClassNames = {
  enter: style.animationEnter,
  enterActive: style.animationEnterActive,
  exit: style.animationExit,
  exitActive: style.animationExitActive,
};

storiesOf('CssTansition', module)
  .add('hide with null child', () => {
    const AnimatedBubble = ({ displayed }: ComponentProps) => (
      <CssTransition classNames={animationClassNames} timeout={500}>
        {displayed && <div className={style.bubble} />}
      </CssTransition>
    );

    return <InteractiveContainer component={AnimatedBubble} />;
  })
  .add('hide with displayed prop', () => {
    const AnimatedBubble = ({ displayed }: ComponentProps) => (
      <CssTransition displayed={displayed} classNames={animationClassNames} timeout={500}>
        <div className={style.bubble} />
      </CssTransition>
    );

    return <InteractiveContainer component={AnimatedBubble} />;
  })
  .add('animate on enter', () => {
    const AnimatedBubble = ({ displayed }: ComponentProps) => (
      <CssTransition
        animateOnMount
        displayed={displayed}
        classNames={animationClassNames}
        timeout={500}
      >
        <div className={style.bubble} />
      </CssTransition>
    );

    return <InteractiveContainer component={AnimatedBubble} />;
  })
  .add('animate text when it become empty', () => {
    const AnimatedBubble = ({ displayed }: ComponentProps) => {
      const value = displayed ? 'Hello CssTransition' : '';

      return (
        <CssTransition displayed={displayed} classNames={animationClassNames} timeout={500}>
          <span className={style.text}>{value}</span>
        </CssTransition>
      );
    };

    return <InteractiveContainer component={AnimatedBubble} />;
  })
  .add('delay animation', () => {
    const AnimatedBubble = ({ displayed }: ComponentProps) => (
      <Fragment>
        <CssTransition
          displayed={displayed}
          classNames={animationClassNames}
          timeout={500}
          delay={500}
        >
          <div className={style.bubble} />
        </CssTransition>
      </Fragment>
    );

    return <InteractiveContainer component={AnimatedBubble} />;
  });

interface ComponentProps {
  displayed: boolean;
}

interface InteractiveProps {
  component: ComponentType<ComponentProps>;
}

class InteractiveContainer extends Component<InteractiveProps, ComponentProps> {
  state: ComponentProps = { displayed: true };

  toogle = () => this.setState(state => ({ displayed: !state.displayed }));

  render() {
    const { component } = this.props;

    return (
      <div>
        <button className={style.button} onClick={this.toogle}>
          {this.state.displayed ? 'Displayed' : 'Hidden'}
        </button>
        <div>{createElement(component, this.state)}</div>
      </div>
    );
  }
}
