import { Component, cloneElement, ReactElement } from 'react';
import { findDOMNode } from 'react-dom';

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
  mounted: boolean;
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

    const children = isChildrenDisplayed(props) ? props.children : null;
    this.state = { children, mounted: false };
  }

  componentDidMount() {
    const { animateOnMount, delay, timeout, classNames } = this.props;
    if (animateOnMount) {
      const delayDuration = getDuration(delay, 'enter');
      const timeoutDuration = getDuration(timeout, 'enter');

      const domNode = findDOMNode(this);
      if (domNode instanceof Element) {
        domNode.classList.add(classNames.enter);
        this.enterDelay = window.setTimeout(() => {
          domNode.classList.add(classNames.enterActive);
          this.enterDelay = null;

          this.enterTimeout = window.setTimeout(() => {
            domNode.classList.remove(classNames.enter, classNames.enterActive);
            this.setState({ mounted: true });
            this.enterTimeout = null;
          }, timeoutDuration);
        }, delayDuration);
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { children, classNames, delay, timeout } = this.props;
    if (isBecomeDisplay(prevProps, this.props)) {
      const delayDuration = getDuration(delay, 'enter');
      const timeoutDuration = getDuration(timeout, 'enter');

      this.setState({ children: this.props.children }, () => {
        const domNode = findDOMNode(this);
        if (domNode instanceof Element) {
          domNode.classList.add(classNames.enter);

          if (this.exitDelay) {
            window.clearTimeout(this.exitDelay);
            this.exitDelay = null;
          }
          if (this.exitTimeout) {
            window.clearTimeout(this.exitTimeout);
            this.exitTimeout = null;
            domNode.classList.remove(classNames.exit, classNames.exitActive);
          }

          this.enterDelay = window.setTimeout(() => {
            domNode.classList.add(classNames.enterActive);
            this.enterDelay = null;

            this.enterTimeout = window.setTimeout(() => {
              domNode.classList.remove(classNames.enter, classNames.enterActive);
              this.enterTimeout = null;
            }, timeoutDuration);
          }, delayDuration);
        }
      });
      return;
    }

    if (isBecomeHide(prevProps, this.props)) {
      const delayDuration = getDuration(delay, 'exit');
      const timeoutDuration = getDuration(timeout, 'exit');

      const domNode = findDOMNode(this);
      if (domNode instanceof Element) {
        domNode.classList.add(classNames.exit);

        if (this.enterDelay) {
          window.clearTimeout(this.enterDelay);
          this.enterDelay = null;
        }
        if (this.enterTimeout) {
          window.clearTimeout(this.enterTimeout);
          this.enterTimeout = null;
          domNode.classList.remove(classNames.enter, classNames.enterActive);
        }

        this.exitDelay = window.setTimeout(() => {
          domNode.classList.add(classNames.exitActive);
          this.exitDelay = null;

          this.exitTimeout = window.setTimeout(() => {
            this.setState({ children: null });
            this.exitTimeout = null;
          }, timeoutDuration);
        }, delayDuration);
      }
      return;
    }

    if (isChildrenDisplayed(this.props) && this.state.children !== children) {
      this.setState({ children });
    }
  }

  render() {
    const { animateOnMount, classNames } = this.props;
    const { children, mounted } = this.state;

    if (animateOnMount && !mounted && children && children.props) {
      const childrenClassName = children.props.className
        ? `${children.props.className} ${classNames.enter}`
        : classNames.enter;

      return cloneElement(children, { className: childrenClassName });
    }

    return children;
  }
}

export default CssTransition;
export { Props };
