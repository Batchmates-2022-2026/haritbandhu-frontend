import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageTransition() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  const handleTransitionEnd = () => {
    if (transitionStage === 'fadeOut') {
      setDisplayLocation(location);
      setTransitionStage('fadeIn');
    }
  };

  return { transitionStage, displayLocation, handleTransitionEnd };
}
