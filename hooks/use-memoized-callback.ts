import { useCallback, useRef } from 'react'

export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef<T>(callback)
  const depsRef = useRef<React.DependencyList>(deps)

  // Update callback if dependencies have changed
  if (!depsRef.current || !deps.every((dep, index) => dep === depsRef.current![index])) {
    callbackRef.current = callback
    depsRef.current = deps
  }

  return useCallback(callbackRef.current, deps)
}