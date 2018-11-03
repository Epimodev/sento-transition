import { Component, cloneElement, ReactElement } from 'react';
import * as classnames from 'classnames';

const TICK_TIMEOUT = 50;

type Duration = { enter: number; exit: number };

interface Props {
  displayed?: boolean;
  classNames: {
    enter: string;
    enterActive: string;
    exit: string;
    exitActive: string;
  };
  timeout: Duration | number;
  children?: ReactElement<any> | null | false;
  delay: Duration | number;
  animateOnMount: boolean;
}

interface State {
  children?: ReactElement<any> | null | false;
  className?: string;
}

function isBecomeDisplay(prevProps: Props, props: Props): boolean {
  return (
    (!prevProps.children && !!props.children) ||
    (prevProps.displayed === false && props.displayed === true)
  );
}

function isBecomeHide(prevProps: Props, props: Props): boolean {
  return (
    (!!prevProps.children && !props.children) ||
    ((prevProps.displayed === undefined || prevProps.displayed === true) &&
      props.displayed === false)
  );
}

function getDuration(duration: Duration | number, key: keyof Duration): number {
  if (typeof duration === 'number') {
    return duration;
  }
  return duration[key];
}

function isChildrenDisplayed({ children, displayed }: Props): boolean {
  return !!children && displayed !== false;
}

function getChildrenClassName(children: any): string | undefined {
  if (children && children.props) {
    return children.props.className;
  }
  return undefined;
}

class CssTransition extends Component<Props, State> {
  enterDelay: number | null = null;
  exitDelay: number | null = null;
  enterTimeout: number | null = null;
  exitTimeout: number | null = null;

  static defaultProps = {
    animateOnMount: false,
    delay: 0,
  };

  constructor(props: Props) {
    super(props);
    const { classNames, animateOnMount } = props;

    const children = isChildrenDisplayed(props) ? props.children : null;
    const childrenClassName = children && children.props ? children.props.className : undefined;
    const className = classnames(childrenClassName, {
      [classNames.enter]: animateOnMount,
    });

    this.state = { children, className };
  }

  componentDidMount() {
    const { children, animateOnMount, delay, timeout, classNames } = this.props;

    if (animateOnMount) {
      const childrenClassName = getChildrenClassName(children);
      const delayDuration = getDuration(delay, 'enter');
      const timeoutDuration = getDuration(timeout, 'enter');

      this.enterDelay = window.setTimeout(() => {
        const enterActiveClassName = classnames(
          childrenClassName,
          classNames.enter,
          classNames.enterActive,
        );
        this.setState({ className: enterActiveClassName });
        this.enterDelay = null;

        this.enterTimeout = window.setTimeout(() => {
          this.setState({ className: childrenClassName });
          this.enterTimeout = null;
        }, timeoutDuration);
      }, delayDuration + TICK_TIMEOUT);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { children, classNames, delay, timeout } = this.props;

    if (isBecomeDisplay(prevProps, this.props)) {
      const childrenClassName = getChildrenClassName(children);
      const delayDuration = getDuration(delay, 'enter');
      const timeoutDuration = getDuration(timeout, 'enter');
      const enterClassName = classnames(childrenClassName, classNames.enter);

      this.setState({ children: this.props.children, className: enterClassName }, () => {
        if (this.exitDelay) {
          window.clearTimeout(this.exitDelay);
          this.exitDelay = null;
        }
        if (this.exitTimeout) {
          window.clearTimeout(this.exitTimeout);
          this.exitTimeout = null;
        }

        this.enterDelay = window.setTimeout(() => {
          const enterActiveClassName = classnames(enterClassName, classNames.enterActive);
          this.setState({ className: enterActiveClassName });
          this.enterDelay = null;

          this.enterTimeout = window.setTimeout(() => {
            this.setState({ className: childrenClassName });
            this.enterTimeout = null;
          }, timeoutDuration);
        }, delayDuration);
      });
      return;
    }

    if (isBecomeHide(prevProps, this.props)) {
      const childrenClassName = getChildrenClassName(this.state.children);
      const delayDuration = getDuration(delay, 'exit');
      const timeoutDuration = getDuration(timeout, 'exit');
      const exitClassName = classnames(childrenClassName, classNames.exit);

      this.setState({ className: exitClassName }, () => {
        if (this.enterDelay) {
          window.clearTimeout(this.enterDelay);
          this.enterDelay = null;
        }
        if (this.enterTimeout) {
          window.clearTimeout(this.enterTimeout);
          this.enterTimeout = null;
        }

        this.exitDelay = window.setTimeout(() => {
          const exitActiveClassName = classnames(exitClassName, classNames.exitActive);
          this.setState({ className: exitActiveClassName });
          this.exitDelay = null;

          this.exitTimeout = window.setTimeout(() => {
            this.setState({ children: null, className: childrenClassName });
            this.exitTimeout = null;
          }, timeoutDuration);
        }, delayDuration);
      });
      return;
    }

    if (isChildrenDisplayed(this.props) && this.state.children !== children) {
      this.setState(state => {
        const propClassName = getChildrenClassName(children);
        const stateClassName = getChildrenClassName(state.children);
        if (propClassName !== stateClassName) {
          return { children, className: propClassName };
        }
        return { children };
      });
    }
  }

  componentWillUnmount() {
    if (this.enterDelay) {
      window.clearTimeout(this.enterDelay);
      this.enterDelay = null;
    }
    if (this.enterTimeout) {
      window.clearTimeout(this.enterTimeout);
      this.enterTimeout = null;
    }
    if (this.exitDelay) {
      window.clearTimeout(this.exitDelay);
      this.exitDelay = null;
    }
    if (this.exitTimeout) {
      window.clearTimeout(this.exitTimeout);
      this.exitTimeout = null;
    }
  }

  render() {
    const { children, className } = this.state;

    if (children && children.props) {
      return cloneElement(children, { className });
    }

    return children;
  }
}

export default CssTransition;
export { Props };
