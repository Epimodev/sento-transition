import { createElement, Component, Fragment, ComponentType, SyntheticEvent } from 'react';
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
    const AnimatedBubble = ({ displayed, text }: ComponentProps) => (
      <CssTransition classNames={animationClassNames} timeout={500}>
        {displayed && <div className={style.bubble}>{text}</div>}
      </CssTransition>
    );

    return <InteractiveContainer component={AnimatedBubble} />;
  })
  .add('hide with displayed prop', () => {
    const AnimatedBubble = ({ displayed, text }: ComponentProps) => (
      <CssTransition displayed={displayed} classNames={animationClassNames} timeout={500}>
        <div className={style.bubble}>{text}</div>
      </CssTransition>
    );

    return <InteractiveContainer component={AnimatedBubble} />;
  })
  .add('animate on enter', () => {
    const AnimatedBubble = ({ displayed, text }: ComponentProps) => (
      <CssTransition
        animateOnMount
        displayed={displayed}
        classNames={animationClassNames}
        timeout={500}
      >
        <div className={style.bubble}>{text}</div>
      </CssTransition>
    );

    return <InteractiveContainer component={AnimatedBubble} />;
  })
  .add('animate text when it become empty', () => {
    const AnimatedBubble = ({ text }: ComponentProps) => {
      return (
        <CssTransition displayed={!!text} classNames={animationClassNames} timeout={500}>
          <div className={style.bubble}>{text}</div>
        </CssTransition>
      );
    };

    return <InteractiveContainer component={AnimatedBubble} />;
  })
  .add('delay animation', () => {
    const AnimatedBubble = ({ displayed, text }: ComponentProps) => (
      <Fragment>
        <CssTransition
          displayed={displayed}
          classNames={animationClassNames}
          timeout={500}
          delay={500}
        >
          <div className={style.bubble}>{text}</div>
        </CssTransition>
      </Fragment>
    );

    return <InteractiveContainer component={AnimatedBubble} />;
  });

interface ComponentProps {
  displayed: boolean;
  text: string;
}

interface InteractiveProps {
  component: ComponentType<ComponentProps>;
}

class InteractiveContainer extends Component<InteractiveProps, ComponentProps> {
  state: ComponentProps = { displayed: true, text: '' };

  changeLetter = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ text: event.currentTarget.value });
  };

  toogle = () => this.setState(state => ({ displayed: !state.displayed }));

  render() {
    const { component } = this.props;

    return (
      <div>
        <button className={style.button} onClick={this.toogle}>
          {this.state.displayed ? 'Displayed' : 'Hidden'}
        </button>
        <input
          type="text"
          placeholder="value"
          value={this.state.text}
          onChange={this.changeLetter}
        />
        <div>{createElement(component, this.state)}</div>
      </div>
    );
  }
}
