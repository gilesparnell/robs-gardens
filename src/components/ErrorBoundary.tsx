import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: { componentStack: string } | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="fixed bottom-6 right-6 w-80 bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg shadow-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Assistant Widget Error</h3>
                <p className="text-sm mb-2">{this.state.error?.message || 'An unexpected error occurred'}</p>
                <button
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
