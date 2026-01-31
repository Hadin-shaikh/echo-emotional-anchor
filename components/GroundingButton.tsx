
import React, { useState } from 'react';
import { COLORS } from '../constants';

interface GroundingButtonProps {
  onPress: () => void;
}

const GroundingButton: React.FC<GroundingButtonProps> = ({ onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressDown = () => setIsPressed(true);
  const handlePressUp = () => {
    setIsPressed(false);
    onPress();
  };

  return (
    <button
      onMouseDown={handlePressDown}
      onMouseUp={handlePressUp}
      onTouchStart={handlePressDown}
      onTouchEnd={handlePressUp}
      className={`
        fixed bottom-12 right-8 w-32 h-32 rounded-full shadow-2xl transition-all duration-300
        flex flex-col items-center justify-center border-8 border-white
        ${isPressed ? 'scale-90 opacity-80' : 'scale-100'}
      `}
      style={{ 
        backgroundColor: COLORS.error,
        boxShadow: `0 10px 40px -10px ${COLORS.error}88`
      }}
    >
      <div className="text-white flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="font-bold text-lg leading-tight">HELP</span>
      </div>
    </button>
  );
};

export default GroundingButton;
