'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('ErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
          <h2 className="mb-2 text-xl font-semibold text-brand-blue">
            {this.props.fallbackTitle ?? 'Something went wrong'}
          </h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            {this.props.fallbackMessage ??
              'This section could not be loaded. Please refresh the page or try again.'}
          </p>
          <Button
            type="button"
            className="bg-brand-blue"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
