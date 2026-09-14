import '@testing-library/jest-dom';

// jsdom does not implement window.matchMedia
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

// jsdom does not implement IntersectionObserver (motion's whileInView needs it)
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class IntersectionObserverStub {
    callback: (entries: unknown[], observer: unknown) => void;
    constructor(callback: (entries: unknown[], observer: unknown) => void) { this.callback = callback; }
    observe(target: Element) { this.callback([{ isIntersecting: false, target }], this); }
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  (window as unknown as Record<string, unknown>).IntersectionObserver = IntersectionObserverStub;
}
