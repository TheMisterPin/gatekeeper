export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  let current = initial
  const setValue = (next: T | ((prev: T) => T)) => {
    current = typeof next === "function" ? (next as (prev: T) => T)(current) : next
  }
  return [current, setValue]
}

export function useEffect(effect: () => void): void {
  effect()
}

export function useMemo<T>(factory: () => T): T {
  return factory()
}

export function useCallback<T extends (...args: any[]) => any>(fn: T): T {
  return fn
}

export function useRef<T>(initial: T): { current: T } {
  return { current: initial }
}

export function forwardRef<T, P>(render: (props: P, ref: { current: T | null }) => any) {
  return (props: P) => render(props, { current: null })
}

export const Fragment = Symbol.for("fragment")

export function createElement(type: any, props: any, ...children: any[]) {
  return { type, props: { ...(props || {}), children } }
}

export const jsx = (type: any, props: any) => ({ type, props })
export const jsxs = jsx
export const jsxDEV = jsx

export default {
  Fragment,
  createElement,
}
