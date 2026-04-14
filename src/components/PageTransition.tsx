import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    // On location change: fade out, swap, fade in
    setPhase('out');
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setPhase('in');
    }, 220);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Also update children if same location but children changed
  useEffect(() => {
    if (phase === 'in') setDisplayChildren(children);
  }, [children]);

  return (
    <div
      style={{
        opacity: phase === 'in' ? 1 : 0,
        transform: phase === 'in' ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 220ms ease, transform 220ms ease',
        minHeight: '100vh',
      }}
    >
      {displayChildren}
    </div>
  );
}
