import { Component, cloneElement, ReactElement } from 'react';
import { Props as CssTransitionProps } from './CssTransition';

const TICK_TIMEOUT = 50;

interface Props {
  children: ReactElement<CssTransitionProps>[];
}

interface State {
  children: ReactElement<CssTransitionProps>[];
}

interface RemovedChild {
  element: ReactElement<CssTransitionProps>;
  index: number;
}

function injectRemovedChilds(
  removedChilds: RemovedChild[],
  children: ReactElement<CssTransitionProps>[],
): ReactElement<CssTransitionProps>[] {
  const childrenClone = [...children];
  const childrenMaxIndex = children.length - 1;
  removedChilds.forEach(({ element, index }) => {
    if (index > childrenMaxIndex) {
      childrenClone.push(element);
    } else {
      childrenClone.splice(index, 0, element);
    }
  });

  return childrenClone;
}

function getExitTimeout(child: ReactElement<CssTransitionProps>) {
  const {
    props: { timeout, delay },
  } = child;
  const exitTimeout = typeof timeout === 'number' ? timeout : timeout.exit;

  if (delay) {
    const exitDelay = typeof delay === 'number' ? delay : delay.exit;
    return exitTimeout + exitDelay + TICK_TIMEOUT;
  }

  return exitTimeout + TICK_TIMEOUT;
}

class TransitionGroup extends Component<Props, State> {
  state: State = { children: this.props.children };

  componentDidUpdate(prevProps: Props) {
    if (prevProps !== this.props) {
      const remvovedChilds = this.getRemovedChilds();
      const newChildren = injectRemovedChilds(remvovedChilds, this.props.children);
      this.setState({ children: newChildren }, () => {
        remvovedChilds.forEach(child => {
          const timeout = getExitTimeout(child.element);
          setTimeout(() => this.removeChild(child.element.key), timeout);
        });
      });
    }
  }

  getRemovedChilds(): RemovedChild[] {
    const { children: childrenState } = this.state;
    const { children } = this.props;

    const removedChilds = childrenState
      .map((child, index) => {
        const exists = children.some(({ key }) => key === child.key);
        if (exists) {
          return null;
        }
        return {
          index,
          element: cloneElement(child, { displayed: false }),
        };
      })
      .filter(child => !!child) as RemovedChild[];

    return removedChilds;
  }

  removeChild(key: string | number | null) {
    this.setState(({ children }) => {
      const childIndex = children.findIndex(child => child.key === key);
      if (childIndex >= 0) {
        const childToRemove = children[childIndex];

        if (childToRemove.props.displayed === false) {
          const childrenClone = [...children];
          childrenClone.splice(childIndex, 1);

          return { children: childrenClone };
        }
      }

      return null;
    });
  }

  render() {
    return this.state.children;
  }
}

export default TransitionGroup;
