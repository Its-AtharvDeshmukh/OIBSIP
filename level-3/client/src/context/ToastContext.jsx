import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Automatically dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  // Convenience helpers
  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, toasts }}>
      {children}

      {/* Global Floating Toast Viewport */}
      <div aria-live="polite" style={{
        position: 'fixed',
        bottom: 'var(--space-24)',
        right: 'var(--space-24)',
        zIndex: 'var(--z-toast)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-12)',
        maxWidth: '400px',
        width: '100%',
        pointerEvents: 'none',
        padding: '0 var(--space-16)'
      }}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .toast-item {
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--space-16);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            animation: slideIn var(--transition-normal);
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text-inverse);
            gap: var(--space-12);
          }
          .toast-success { background-color: var(--success); }
          .toast-error { background-color: var(--danger); }
          .toast-info { background-color: var(--secondary); }
        `}.style}</style>

        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            <span>{t.message}</span>
            <button 
              onClick={() => removeToast(t.id)} 
              style={{ color: 'inherit', opacity: 0.8, cursor: 'pointer', padding: '4px', background: 'none', border: 'none' }}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);