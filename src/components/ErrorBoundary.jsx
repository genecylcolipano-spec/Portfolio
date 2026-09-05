import { Component } from "react";

/**
 * Isolates a render crash so it cannot unmount the rest of the landing page.
 * Used around the lazy Portfolio / Contact chunk — if that tree throws
 * (e.g. react-swipeable-views), Home and the navbar stay on screen.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
