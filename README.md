# react-use-event-listener

A custom React Hook that provides a declarative useEventListener.

[![npm version](https://badge.fury.io/js/react-use-event-listener.svg)](https://badge.fury.io/js/react-use-event-listener) [![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors) [![TypeScript](https://badges.frapsoft.com/typescript/love/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

This hook was inspired by [Dan Abramov](https://github.com/gaearon)'s
blog post
["Making setInterval Declarative with React Hooks"](https://overreacted.io/making-setinterval-declarative-with-react-hooks/).

I needed a way to simplify the plumbing around adding and removing an event listener
in a custom hook.
That lead to a [chain of tweets](https://twitter.com/donavon/status/1093612936621379584)
between Dan and myself.

## Installation

```bash
$ npm i react-use-event-listener
```

or

```bash
$ yarn add react-use-event-listener
```

## Usage

Here is a basic setup.

```tsx
import useEventListener from 'react-use-event-listener'

const MyElement: React.FunctionComponent = () => {
  useEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
  }) // uses window

  return (
    <div></div>
  )
}

const CustomEvent: React.FunctionComponent = () => {
  const elementRef = useRef()

  useEventListener('customevent', (e) => {
    // do stuff
  }, ref, { capture: true }) // accepts a ref

  return (
    <ExoticForwardedRef ref={elementRef} />
  )
}
```

### Parameters

Here are the parameters that you can use. (\* = optional)

| Parameter   | Description                                                                                                      |
| :---------- | :--------------------------------------------------------------------------------------------------------------- |
| `eventName` | The event name (string). Here is a list of [common events](https://developer.mozilla.org/en-US/docs/Web/Events). |
| `handler`   | A function that will be called whenever `eventName` fires on `element`.                                          |
| `element`\* | An optional element to listen on. Defaults to `globalThis` (i.e., `window`).                                         |
| `options`\* | Optional options as in [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).                                         |

### Return

This hook returns nothing.

## Example

Let's look at some sample code. Suppose you would like to track the mouse
position. You _could_ subscribe to mouse move events with like this.

```js
const useMouseMove = () => {
  const [coords, setCoords] = useState([0, 0]);

  useEffect(() => {
    const handler = ({ clientX, clientY }) => {
      setCoords([clientX, clientY]);
    };
    window.addEventListener('mousemove', handler);
    return () => {
      window.removeEventListener('mousemove', handler);
    };
  }, []);

  return coords;
};
```

Here we're using `useEffect` to roll our own handler add/remove event listener.

`useEventListener` abstracts this away. You only need to care about the event name
and the handler function.

```js
const useMouseMove = () => {
  const [coords, setCoords] = useState([0, 0]);

  useEventListener('mousemove', ({ clientX, clientY }) => {
    setCoords([clientX, clientY]);
  });

  return coords;
};
```

## Live demo

You can view/edit the sample code above on CodeSandbox.

[![Edit demo app on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/bimiu)

## License

**[MIT](LICENSE)** Licensed

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/887639?v=4" width="100px;" alt="Donavon West"/><br /><sub><b>Donavon West</b></sub>](http://donavon.com)<br />[🚇](#infra-donavon "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/donavon/use-event-listener/commits?author=donavon "Tests") [💡](#example-donavon "Examples") [🤔](#ideas-donavon "Ideas, Planning, & Feedback") [🚧](#maintenance-donavon "Maintenance") [👀](#review-donavon "Reviewed Pull Requests") [🔧](#tool-donavon "Tools") [💻](https://github.com/donavon/use-event-listener/commits?author=donavon "Code") | [<img src="https://avatars3.githubusercontent.com/u/8732191?v=4" width="100px;" alt="Kevin Kipp"/><br /><sub><b>Kevin Kipp</b></sub>](https://github.com/third774)<br />[💻](https://github.com/donavon/use-event-listener/commits?author=third774 "Code") | [<img src="https://avatars1.githubusercontent.com/u/1288694?v=4" width="100px;" alt="Justin Hall"/><br /><sub><b>Justin Hall</b></sub>](https://github.com/wKovacs64)<br />[💻](https://github.com/donavon/use-event-listener/commits?author=wKovacs64 "Code") [📖](https://github.com/donavon/use-event-listener/commits?author=wKovacs64 "Documentation") |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
