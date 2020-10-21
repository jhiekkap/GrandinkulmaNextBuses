import { useEffect, useRef } from 'react'

export const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

/* export function useInterval(callback, delay) {
    const intervalId = useRef(null);
    const savedCallback = useRef(callback);
    useEffect(() => {
      savedCallback.current = callback;
    });
    useEffect(() => {
      const tick = () => savedCallback.current();
      if (typeof delay === 'number') {
        intervalId.current = window.setInterval(tick, delay);
        return () => window.clearInterval(intervalId.current);
      }
    }, [delay]);
    return intervalId.current;
  }; */
  