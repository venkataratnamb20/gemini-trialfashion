import React, { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isSingleView = beforeImage === afterImage;

  const handleMove = (clientX: number) => {
    if (containerRef.current && !isSingleView) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  };

  // Only start dragging if initiated on the handle
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSingleView) return;
    e.preventDefault();
    e.stopPropagation(); // Prevent parent panning
    setIsDragging(true);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Single Image View (Maximize Mode)
  if (isSingleView) {
    return (
      <div 
        className="relative w-full h-full select-none"
        ref={containerRef}
      >
        <img 
          src={afterImage} 
          alt="Full View" 
          className="absolute top-0 left-0 w-full h-full object-cover object-center pointer-events-none"
        />
      </div>
    );
  }

  // Before/After Slider View
  return (
    <div 
      className="relative w-full h-full select-none"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Background) */}
      <img 
        src={afterImage} 
        alt="Virtual Try-On Result" 
        className="absolute top-0 left-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Before Image (Foreground - Clipped) */}
      <div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt="Original Upload" 
          className="absolute top-0 left-0 max-w-none h-full object-cover object-center"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] flex items-center justify-center group"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Extended touch/click area for easier grabbing */}
        <div className="absolute inset-y-0 -left-4 -right-4 bg-transparent cursor-ew-resize" />
        
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-primary relative z-30">
          <GripVertical className="w-5 h-5" />
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 text-xs font-bold rounded backdrop-blur-sm pointer-events-none">ORIGINAL</div>
      <div className="absolute top-4 right-4 bg-accent/80 text-white px-3 py-1 text-xs font-bold rounded backdrop-blur-sm pointer-events-none">VIRTUAL TRY-ON</div>
    </div>
  );
};