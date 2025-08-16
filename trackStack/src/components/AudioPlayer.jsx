import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer({ blob, url, label }) {
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    if (url) {
      setAudioUrl(url);
      return undefined;
    }
    if (blob) {
      const objectUrl = URL.createObjectURL(blob);
      setAudioUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setAudioUrl(null);
    return undefined;
  }, [blob, url]);

  if (!blob && !url) return null;

  return (
    <div className="space-y-1">
      <audio ref={audioRef} controls src={audioUrl} className="w-full" />
      {label && <div className="text-xs text-zinc-400">{label}</div>}
    </div>
  );
}

