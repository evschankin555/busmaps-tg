import React from 'react';
import './QuickActions.css';

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onSelect: (action: QuickAction) => void;
  className?: string;
}

export function QuickActions({ actions, onSelect, className = '' }: QuickActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={`quick-actions ${className}`}>
      {actions.map((action) => (
        <button
          key={action.id}
          className="quick-action-button"
          onClick={() => onSelect(action)}
        >
          <div className="quick-action-icon">{action.icon}</div>
          <div className="quick-action-label">{action.label}</div>
        </button>
      ))}
    </div>
  );
}

