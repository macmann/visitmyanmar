'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { failed: boolean; retryKey: number };

export default class GameErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, retryKey: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('The 3D world failed to start.', error, info.componentStack);
  }

  retry = () => this.setState(({ retryKey }) => ({ failed: false, retryKey: retryKey + 1 }));

  render() {
    if (this.state.failed) {
      return <section className="world-error" role="alert">
        <div className="lotus">✦</div>
        <h1>Explore Myanmar could not start the 3D world.</h1>
        <p>The rest of your journey is safe. Try starting the world again.</p>
        <button className="primary" onClick={this.retry}>Retry</button>
      </section>;
    }

    return <div className="world-runtime" key={this.state.retryKey}>{this.props.children}</div>;
  }
}
