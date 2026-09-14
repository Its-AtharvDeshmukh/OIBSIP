import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Pizza Craft Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh', 
          padding: 'var(--space-24)',
          backgroundColor: 'var(--bg-main)',
          textAlign: 'center'
        }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: 'var(--space-48) var(--space-32)' }}>
            <span style={{ fontSize: '3rem', marginBottom: 'var(--space-16)', display: 'block' }} aria-hidden="true">🍕🔥</span>
            <h1 className="text-h2" style={{ marginBottom: 'var(--space-8)' }}>Oven hiccup detected!</h1>
            <p className="text-body text-secondary" style={{ marginBottom: 'var(--space-32)' }}>
              Something unexpected happened in the kitchen. Don't worry, your data is safe. Please reload the application to continue.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary btn-block"
              style={{ padding: 'var(--space-16)', fontWeight: '700' }}
            >
              Reload Pizza Craft
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}