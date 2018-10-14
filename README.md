# sento-transition
A react component for css animation

## Install

```bash
yarn add sento-transition

# or with npm

npm install --save sento-transition
```

## Motivation
I always use [react-transition-group](https://reactcommunity.org/react-transition-group/) to create animations on my react projects. But sometimes I prefer to have animation triggered by `<CssTransition>` children instead of `in` prop. For example with error message in forms, I want to animate out error message when it become empty and keep the content before it becomes empty during the animation.
So I create this component inspired by `react-transition-group`.


## Plan for futur
- create a CssTransitionGroup component to handle list of components with the same animation

## Basic examples

#### example
jsx file :
```jsx
import { CssTransition } from 'sento-transition';

const animationClassNames = {
  enter: 'animation-enter',
  enterActive: 'animation-enter-active',
  exit: 'animation-exit',
  exitActive: 'animation-exit-active',
};

...

<CssTransition classNames={animationClassNames} timeout={500}>
  {message && <div>{message}</div>}
</CssTransition>
```

css file :
```css
.animation-enter {
  transform: scale(0);
}
.animation-enter-active {
  transform: scale(1);
  transition: 500ms;
}
.animation-exit {
  transform: scale(1);
}
.animation-exit-active {
  transform: scale(0);
  transition: 500ms;
}
```

#### animation controlled with `displayed` prop
```jsx
import { CssTransition } from 'sento-transition';

...

<CssTransition displayed={displayed} classNames={animationClassNames} timeout={500}>
  <div>{message}</div>
</CssTransition>
```

## Documentation

### CssTransition

#### Props :
**classNames** `{ enter: string; enterActive: string; exit: string; exitActive: string }`  
classNames to apply on component during animation.

**timeout** `number | { enter: number; exit: number }`  
duration of the animation, need it to know when to remove css classes.

**displayed** `(optional) boolean`  
define if children is displayed and trigger animation.  
if this prop isn't defined, the animation will be triggered by children when it become truthy or falsy.

**delay** `(optional) number | { enter: number; exit: number }`  
add a delay before animation start.

**animateOnMount** `(optional) boolean`  
start enter animation when `<CssTransition>` component is mounted.

**children** `ReactNode`  
*warning* Component should contain only 1 children and must be an HTMLElement (or a react element which return 1 HTMLElement).
If children is a text node, it'll be not animated.
