import React from 'react';

interface OverlayProps {
  title: string;
  message?: string;
  score?: number;
  buttonText: string;
  onButtonClick: () => void;
  type?: 'success' | 'error' | 'neutral';
}

const Overlay: React.FC<OverlayProps> = ({ title, message, score, buttonText, onButtonClick, type = 'neutral' }) => {
  return (
    <div className="overlay-container">
      <div className="overlay-content">
        <h2 className={`overlay-title ${type}`}>
            {title}
        </h2>
        {message && <p className="overlay-message">{message}</p>}
        {score !== undefined && (
            <div className="overlay-score">
                Score: <span>{score}</span>
            </div>
        )}
        <button 
          onClick={onButtonClick}
          className="overlay-button"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Overlay;
