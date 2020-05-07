// @ts-nocheck
import { cleanup, render  } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks'
import React, { useRef, useEffect } from 'react'
import '@testing-library/jest-dom/extend-expect'

import useEventListener from '../lib'

const mouseMoveEvent = { clientX: 100, clientY: 200 };
let hackHandler = null;

const mockElement = {
  addEventListener: (eventName, handler, options) => {
    hackHandler = handler;
  },
  removeEventListener: () => {
    hackHandler = null;
  },
  dispatchEvent: (event) => {
    hackHandler(event);
  },
};

afterEach(cleanup);

describe('useEventListener', () => {
  test('import useEventListener from "@use-it/event-listener"', () => {
    expect(typeof useEventListener).toBe('function');
  });

  test('you pass an `eventName`, `handler`, and an `element`', () => {
    const handler = jest.fn();
    const addEventListenerSpy = jest.spyOn(mockElement, 'addEventListener');

    renderHook(() => {
      useEventListener('foo', handler, mockElement);
    });

    expect(addEventListenerSpy).toBeCalled();

    act(() => {
      mockElement.dispatchEvent(mouseMoveEvent);
    })

    expect(handler).toBeCalledWith(mouseMoveEvent);

    addEventListenerSpy.mockRestore();
  });

  test('cleanup', () => {
    const handler = jest.fn();
    const removeEventListener = jest.spyOn(mockElement, 'removeEventListener');

    renderHook(() => {
      useEventListener('foo', handler, mockElement);
    }).unmount()

    expect(removeEventListener).toBeCalled();

    removeEventListener.mockRestore();
  });

  test('`element` is optional (defaults to `window`/`global`)', () => {
    const handler = jest.fn();
    const addEventListenerSpy = jest.spyOn(globalThis, 'addEventListener');

    renderHook(() => {
      useEventListener('foo', handler);
    });

    expect(addEventListenerSpy).toBeCalled();

    addEventListenerSpy.mockRestore();
  });

  test('fails safe with SSR (i.e. no window)', () => {
    const handler = jest.fn();

    renderHook(() => {
      useEventListener('foo', handler, {});
    });
  });

  test('with options', () => {
    const handler = jest.fn();
    const addEventListenerSpy = jest.spyOn(mockElement, 'addEventListener');
    const options = { capture: true }

    renderHook(() => {
      useEventListener('foo', handler, mockElement, options)
    })

    expect(addEventListenerSpy).toBeCalledWith('foo', expect.any(Function), options)
    addEventListenerSpy.mockRestore();
  });

  test('invalid params', () => {
    const handler = jest.fn();

    renderHook(() => {
      useEventListener('', handler, {});
    }).unmount()

    renderHook(() => {
      useEventListener('myevent', handler, {});
    })

    const addEventListenerSpy = jest.spyOn(mockElement, 'addEventListener');
    const removeEventListener = jest.spyOn(mockElement, 'removeEventListener');

    const hook = renderHook(() => {
      useEventListener('ghj', null, mockElement);
    })

    act(() => {
      mockElement.dispatchEvent(mouseMoveEvent);
    })

    hook.unmount()

    addEventListenerSpy.mockRestore();
    removeEventListener.mockRestore();
  });

  test('can useRef', () => {
    const handler = jest.fn();

    const rendered = renderHook(() => {
      const ref = useRef(null)

      useEventListener('click', (e) => handler(e), ref.current)
      useEventListener('click', (e) => handler(e), ref)

      useEffect(() => {
        if (ref.current) {
          ref.current.click()
          ref.current.click()
        }
      }, [ref])

      render(
        <React.StrictMode>
          <button ref={ref} />
        </React.StrictMode>
      )
    })

    act(() => {
      rendered.rerender()
    })

    expect(handler).toBeCalledTimes(4)
  })
});
