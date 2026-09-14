import { Component, ErrorInfo, ReactNode } from 'react';
import { Sentry } from '../lib/sentry';
import { isChunkLoadError, reloadForFreshChunks } from '../lib/lazyWithRetry';

function ErrorFallback() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h1 className="font-heading text-4xl text-stone-800 mb-4">Something went wrong</h1>
        <p className="font-body text-stone-500 text-sm mb-8 italic">
          Our atelier encountered a technical issue. Please return home and try again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => window.location.reload()} className="btn-luxury">
            Try Again
          </button>
          <button onClick={() => window.location.href = '/'} className="btn-luxury">
            Return to Atelier
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[riman] Uncaught render error:', error, errorInfo.componentStack);
    if (isChunkLoadError(error)) {
      // Stale build after deploy — one controlled reload (cooldown-guarded).
      reloadForFreshChunks();
      return;
    }
    try {
      Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
    } catch {
      // reporting must never crash the recovery UI
    }
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}