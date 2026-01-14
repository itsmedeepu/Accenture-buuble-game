import React from 'react';
import type { Equation } from '../gameLogic';

interface BubbleProps {
  equation: Equation;
  onClick: (id: string) => void;
  isSelected?: boolean;
  order?: number; // 1, 2, or 3 for selection order
  status?: 'neutral' | 'correct' | 'wrong';
}

const Bubble: React.FC<BubbleProps> = ({ equation, onClick, isSelected, order, status = 'neutral' }) => {
  return (
    <div
      onClick={() => onClick(equation.id)}
      className={`bubble ${isSelected ? 'selected' : ''} ${status !== 'neutral' ? status : ''}`}
    >
        {isSelected && order && (
            <div className="bubble-order-badge">
                {order}
            </div>
        )}
      <div className="bubble-text">{equation.text}</div>
    </div>
  );
};

export default Bubble;
