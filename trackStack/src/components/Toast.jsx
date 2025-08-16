import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-20 right-4 z-50 max-w-sm w-full bg-white/10 backdrop-blur-xl border rounded-xl shadow-2xl transform transition-all duration-300";
    
    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }
    
    return `${baseStyles} translate-x-0 opacity-100`;
  };

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          borderColor: 'border-green-400/50',
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-200'
        };
      case 'error':
        return {
          icon: '❌',
          borderColor: 'border-red-400/50',
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-200'
        };
      case 'warning':
        return {
          icon: '⚠️',
          borderColor: 'border-yellow-400/50',
          bgColor: 'bg-yellow-500/20',
          textColor: 'text-yellow-200'
        };
      default:
        return {
          icon: 'ℹ️',
          borderColor: 'border-blue-400/50',
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-200'
        };
    }
  };

  const { icon, borderColor, bgColor, textColor } = getIconAndColor();

  return (
    <div className={`${getToastStyles()} ${borderColor} ${bgColor}`}>
      <div className="flex items-center gap-3 p-4">
        <span className="text-lg">{icon}</span>
        <p className={`flex-1 text-sm font-medium ${textColor}`}>
          {message}
        </p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300);
          }}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
