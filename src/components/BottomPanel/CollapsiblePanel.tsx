import React, { useState, useEffect } from 'react';
import './BottomPanel.css';

interface CollapsiblePanelProps {
  children: React.ReactNode;
  isOpen: boolean;
  onToggle?: () => void;
  className?: string;
  title?: string;
}

export function CollapsiblePanel({
  children,
  isOpen,
  onToggle,
  className = '',
  title,
}: CollapsiblePanelProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div
      className={`collapsible-panel ${isOpen ? 'open' : 'closed'} ${className} ${isAnimating ? 'animating' : ''}`}
    >
      {title && (
        <div className="collapsible-panel-header" onClick={onToggle}>
          <span className="collapsible-panel-title">{title}</span>
          <span className="collapsible-panel-arrow">{isOpen ? '▼' : '▲'}</span>
        </div>
      )}
      {isOpen && (
        <div className="collapsible-panel-content">
          {children}
        </div>
      )}
    </div>
  );
}

