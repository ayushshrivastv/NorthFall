'use client';

import { useEffect } from 'react';

/**
 * Buffer Polyfill Component
 * Ensures Buffer is available in the browser for LazorKit SDK
 * Must be a client component to avoid hydration issues
 */
export default function BufferPolyfill() {
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.Buffer) {
            // @ts-ignore
            window.Buffer = require('buffer').Buffer;
        }
    }, []);

    return null;
}
