import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Something went wrong. Please try refreshing the page.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full mb-8 text-left overflow-auto">
            <p className="font-mono text-sm text-red-500 break-words">
              {this.state.error?.toString()}
            </p>
          </div>
          <Button onClick={this.handleReload} size="lg">
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
