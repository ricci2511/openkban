import { useEffect, useRef } from 'react';

const DEFAULT_EVENTS = ['mousedown', 'touchstart'];

export function useClickOutside<T extends HTMLElement = HTMLElement>(
    handler: () => void
) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const listener = (event: Event) => {
            const { target } = event ?? {};
            if (!target) return;
            const el = ref.current;
            if (!el || el.contains(target as Node)) return;
            // call handler only if click is outside of the element
            handler();
        };

        DEFAULT_EVENTS.forEach((e) => document.addEventListener(e, listener));

        return () => {
            DEFAULT_EVENTS.forEach((e) =>
                document.removeEventListener(e, listener)
            );
        };
    }, [ref, handler]);

    return ref;
}
