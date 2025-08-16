import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Start loader on route change
    setLoading(true);
    // End loader after a short delay
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeoutRef.current);
    // location.key ensures triggers on route change
  }, [location.key]);

  if (!loading) return null;

  return (
    <div className="fixed left-0 right-0 top-14 z-40">
      <div className="relative h-[3px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-400 to-blue-500 opacity-90 animate-pulse" />
        <div className="absolute inset-0 blur-md opacity-50 bg-gradient-to-r from-cyan-400 via-indigo-400 to-blue-500" />
      </div>
    </div>
  );
}

