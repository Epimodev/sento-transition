import { createElement, Component } from 'react';
import { storiesOf } from '@storybook/react';
import { TransitionGroup, CssTransition } from '../../../src/index';
import * as style from './style.scss';

const animationClassNames = {
  enter: style.animationEnter,
  enterActive: style.animationEnterActive,
  exit: style.animationExit,
  exitActive: style.animationExitActive,
};

storiesOf('TransitionGroup', module).add('default', () => {
  return <InteractiveList />;
});

interface State {
  items: number[];
}

class InteractiveList extends Component<{}, State> {
  increment: number = 0;
  state: State = { items: [] };

  addItem = () => {
    this.increment += 1;
    this.setState(({ items }) => ({ items: [...items, this.increment] }));
  };

  removeItem = (value: number) => {
    this.setState(({ items }) => ({ items: items.filter(item => item !== value) }));
  };

  render() {
    const { items } = this.state;

    return (
      <div>
        <button className={style.button} onClick={this.addItem}>
          Add Item
        </button>
        <TransitionGroup>
          {items.map(item => (
            <CssTransition key={item} classNames={animationClassNames} timeout={500} animateOnMount>
              <div className={style.bubble} onClick={() => this.removeItem(item)}>
                {item}
              </div>
            </CssTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  }
}
