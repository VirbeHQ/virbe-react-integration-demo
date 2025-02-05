import { useSyncExternalStore } from 'react';

export function atom<T>(initialState: T) {
  const listeners = new Set<() => void>();
  let state = initialState;

  const setState = (newState: T) => {
    state = newState;
    listeners.forEach((listener) => listener());
  };

  return {
    useState() {
      const value = useSyncExternalStore(
        (notify) => {
          listeners.add(notify);
          return () => {
            listeners.delete(notify);
          };
        },
        () => state,
        () => state,
      );

      return [value, setState] as const;
    },
    getState() {
      return state;
    },
  };
}
