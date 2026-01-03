import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  variant?: 'h6' | 'body1' | 'body2' | 'subtitle1' | 'subtitle2';
  color?: string;
}

/**
 * TypingAnimation Component
 * Creates a typewriter effect for text
 */
const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 50,
  delay = 0,
  onComplete,
  variant = 'body1',
  color = 'text.secondary',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Typing effect
  useEffect(() => {
    if (currentIndex === 0 && delay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(1);
      }, delay);
      return () => clearTimeout(delayTimer);
    }

    if (currentIndex > 0 && currentIndex <= text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    }

    if (currentIndex > text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, delay, onComplete]);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <Box sx={{ display: 'inline-block' }}>
      <Typography variant={variant} sx={{ color, display: 'inline' }}>
        {displayedText}
        <Box
          component="span"
          sx={{
            opacity: showCursor ? 1 : 0,
            transition: 'opacity 0.1s',
            ml: 0.5,
          }}
        >
          |
        </Box>
      </Typography>
    </Box>
  );
};

export default TypingAnimation;
