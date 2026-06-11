import React from "react";

// Without a boundary, any error thrown while rendering a single page unmounts
// the entire React tree and leaves a blank white screen. This contains the
// failure to a fallback card and lets the user recover without a hard refresh.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Render error caught by ErrorBoundary:", error, info);
  }

  // Reset error state when navigating to a different route so a crash on one
  // page doesn't permanently wedge the fallback.
  componentDidUpdate(prevProps) {
    if (prevProps.routeKey !== this.props.routeKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            color: "#e0ffe0",
            textAlign: "center",
            maxWidth: 520,
            margin: "4rem auto",
          }}
        >
          <h2 style={{ color: "#1db954" }}>Something went wrong on this page</h2>
          <p style={{ opacity: 0.85 }}>
            The rest of the app is still working. Try going back, or reload to
            recover.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.25rem" }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={btnStyle}
            >
              Try again
            </button>
            <button onClick={() => (window.location.href = "/")} style={btnStyle}>
              Go home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const btnStyle = {
  background: "#1db954",
  color: "#06210f",
  border: "none",
  borderRadius: 999,
  padding: "0.5rem 1.25rem",
  fontWeight: 700,
  cursor: "pointer",
};

export default ErrorBoundary;
