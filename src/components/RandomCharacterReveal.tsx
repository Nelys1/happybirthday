import React, { useState, useEffect } from 'react';

interface RandomCharacterRevealProps {
  text: string;
  finalText: string;
  onComplete?: () => void;
  duration?: number;
}

const RandomCharacterReveal: React.FC<RandomCharacterRevealProps> = ({
  text,
  finalText,
  onComplete,
  duration = 3000
}) => {
  const [revealedChars, setRevealedChars] = useState<{ char: string; x: number; y: number; revealed: boolean }[]>([]);
  const [showFinalText, setShowFinalText] = useState(false);

  useEffect(() => {
    // Initialize characters with random positions
    const chars = text.split('').map((char, index) => ({
      char,
      x: Math.random() * 80 + 10, // 10-90% of viewport width
      y: Math.random() * 60 + 20, // 20-80% of viewport height
      revealed: false
    }));
    
    setRevealedChars(chars);

    // Reveal characters one by one
    chars.forEach((_, index) => {
      setTimeout(() => {
        setRevealedChars(prev => 
          prev.map((char, i) => 
            i === index ? { ...char, revealed: true } : char
          )
        );
      }, (duration / chars.length) * index);
    });

    // Show final text after all characters are revealed
    setTimeout(() => {
      setShowFinalText(true);
      onComplete?.();
    }, duration + 2000);

  }, [text, duration, onComplete]);

  return (
    <div className="relative w-full h-screen">
      {/* Random positioned characters */}
      {!showFinalText && revealedChars.map((charData, index) => (
        <div
          key={index}
          className={`absolute text-4xl font-bold transition-all duration-500 ${
            charData.revealed 
              ? 'opacity-100 animate-bounce text-blue-500' 
              : 'opacity-0'
          }`}
          style={{
            left: `${charData.x}%`,
            top: `${charData.y}%`,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${index * 0.1}s`
          }}
        >
          {charData.char}
        </div>
      ))}

      {/* Final assembled text */}
      {showFinalText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-party bg-clip-text text-transparent text-center animate-scale-in">
            {finalText}
          </h1>
        </div>
      )}
    </div>
  );
};

export default RandomCharacterReveal;