import React from 'react';
import './BottomPanel.css';

interface BottomPanelProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export function BottomPanel({ children, className = '', onClose }: BottomPanelProps) {
  return (
    <div className={`bottom-panel ${className}`}>
      {onClose && (
        <button className="bottom-panel-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      )}
      {children}
    </div>
  );
}

