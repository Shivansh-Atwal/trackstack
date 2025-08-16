import { useEffect, useRef, useState } from 'react';

export default function Recorder({ onRecorded, isDisabled }) {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => () => stopIfActive(), []);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecorded?.(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      setError(e.message || 'Microphone access failed');
    }
  }

  function stopIfActive() {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.stop();
      setIsRecording(false);
    }
  }

  if (!navigator.mediaDevices || !window.MediaRecorder) {
    return <div className="text-amber-400 text-sm">Recording not supported in this browser.</div>;
  }

  const baseBtn = 'inline-flex items-center rounded-lg px-3 py-2 text-sm border transition disabled:opacity-50 disabled:cursor-not-allowed';
  const startBtn = 'border-indigo-400 bg-indigo-600/80 hover:bg-indigo-600 text-white';
  const stopBtn = 'border-rose-400 bg-rose-600/80 hover:bg-rose-600 text-white';

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          className={`${baseBtn} ${isRecording ? stopBtn : startBtn}`}
          onClick={isRecording ? stopIfActive : startRecording}
          disabled={isDisabled}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <label className={`${baseBtn} border-indigo-400 bg-white/5 text-indigo-300 cursor-pointer`}
          style={{ display: 'inline-flex', alignItems: 'center' }}>
          Upload Audio
          <input
            type="file"
            accept="audio/*"
            style={{ display: 'none' }}
            disabled={isDisabled}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                onRecorded?.(file);
              }
              e.target.value = '';
            }}
          />
        </label>
      </div>
      {error && <div className="text-rose-400 text-sm">{error}</div>}
    </div>
  );
}

