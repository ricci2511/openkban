import { useRef, useEffect, useState, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

interface ClientOnlyPortalProps extends PropsWithChildren {
    selector: string;
}
export default function ClientOnlyPortal({
    children,
    selector,
}: ClientOnlyPortalProps) {
    const ref = useRef<HTMLElement>();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        ref.current = document.querySelector(selector) as HTMLElement;
        setMounted(true);
    }, [selector]);

    return mounted ? createPortal(children, ref.current as HTMLElement) : null;
}
