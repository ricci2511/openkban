import { useRef, useEffect, useState, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

export const ClientOnlyPortal = ({ children }: PropsWithChildren) => {
    const ref = useRef<HTMLElement>();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // selector id is defined in _document.tsx
        ref.current = document.querySelector('#portal-root') as HTMLElement;
        setMounted(true);
    }, []);

    return mounted ? createPortal(children, ref.current as HTMLElement) : null;
};
