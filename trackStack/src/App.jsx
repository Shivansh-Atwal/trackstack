import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { listSongs, createSong, updateSong, removeSong, uploadBeat, uploadRecording } from './api';
import AudioPlayer from './components/AudioPlayer';
import Recorder from './components/Recorder';
import { useToast } from './contexts/ToastContext';
import { useRef } from 'react';

function SongList({ songs, selectedId, onSelect, onDelete, onNew }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    if (!query) return songs;
    const q = query.toLowerCase();
    return songs.filter(
      (s) => (s.title || '').toLowerCase().includes(q) || (s.lyrics || '').toLowerCase().includes(q)
    );
  }, [songs, query]);

  return (
    <div className="md:col-span-1 space-y-3">
      <div className="flex gap-2">
        <input
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="rounded-lg border border-indigo-400 bg-indigo-600/80 px-3 py-2 text-sm text-white hover:bg-indigo-600" onClick={onNew}>New</button>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-auto pr-1">
        {filtered.length === 0 && <div className="text-sm text-zinc-400">No songs found</div>}
        {filtered.map((s) => (
          <div
            key={s.id}
            className={`w-full text-left rounded-xl border px-3 py-2 cursor-pointer ${
              selectedId === s.id
                ? 'border-indigo-400 bg-indigo-500/10'
                : 'border-white/10 bg-white/5 hover:border-indigo-400'
            }`}
            onClick={() => onSelect(s.id)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium">{s.title || 'Untitled'}</div>
              <div className="text-xs text-zinc-400">
                {new Date(s.updatedAt || s.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
              <button className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-200 hover:border-rose-400 hover:text-rose-300" onClick={() => onDelete(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Editor({ song, onChange, onSave, onUploadBeat, onUploadRecording, onClearBeat, onClearRecording, isSaving, hasSelection }) {
  const fileInputBeat = useRef();
  const fileInputRecording = useRef();
  if (!hasSelection) {
    return (
      <div className="md:col-span-2 flex min-h-[240px] items-center justify-center rounded-xl border border-white/10 bg-white/5 p-6 text-zinc-300">
        Select a song or create a new one
      </div>
    );
  }
  if (!song) {
    return (
      <div className="md:col-span-2 flex min-h-[240px] items-center justify-center rounded-xl border border-white/10 bg-white/5 p-6 text-zinc-300">
        Loading...
      </div>
    );
  }
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="space-y-2">
        <label className="text-xs text-zinc-400">Title</label>
        <input
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          value={song.title || ''}
          onChange={(e) => onChange({ ...song, title: e.target.value })}
          placeholder="Song title"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-zinc-400">Lyrics</label>
        <textarea
          className="min-h-[240px] w-full resize-y rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          value={song.lyrics || ''}
          onChange={(e) => onChange({ ...song, lyrics: e.target.value })}
          placeholder="Write your lyrics here..."
          rows={12}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-zinc-400">Visibility</label>
        <select
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          value={song.status || 'private'}
          onChange={e => onChange({ ...song, status: e.target.value })}
        >
          <option value="private">Private (only you)</option>
          <option value="public">Public (shared with all users)</option>
        </select>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium">Beat</h3>
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-indigo-400">
                Upload Beat
                <input
                  type="file"
                  accept="audio/*"
                  ref={fileInputBeat}
                  onChange={(e) => onUploadBeat(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {(song.beatBlob || song.beatUrl) && (
                <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-rose-400" onClick={onClearBeat}>Clear</button>
              )}
            </div>
          </div>
          <AudioPlayer blob={song.beatBlob} url={song.beatUrl} label={(song.beatBlob || song.beatUrl) ? 'Beat preview' : ''} />
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">Recording</h3>
            <div className="flex items-center gap-3">
              <Recorder onRecorded={onUploadRecording} isDisabled={isSaving} />
              {(song.recordingBlob || song.recordingUrl) && (
                <button className="rounded-lg border border-indigo-400 bg-indigo-600/80 px-4 py-2 text-sm text-white hover:bg-indigo-600 transition" onClick={onClearRecording}>
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="mt-6">
            <AudioPlayer blob={song.recordingBlob} url={song.recordingUrl} label={(song.recordingBlob || song.recordingUrl) ? 'Recording preview' : ''} />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="rounded-lg border border-indigo-400 bg-indigo-600/80 px-4 py-2 text-sm text-white hover:bg-indigo-600" onClick={onSave} disabled={isSaving || !hasSelection}>Save</button>
      </div>
      {isSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [songs, setSongs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editorState, setEditorState] = useState({ title: '', lyrics: '', beatBlob: null, beatUrl: null, recordingBlob: null, recordingUrl: null, status: 'private' });
  const [isSaving, setIsSaving] = useState(false);
  const [publicProjects, setPublicProjects] = useState([]);
  const selectedSong = useMemo(() => songs.find((s) => s.id === selectedId) || null, [songs, selectedId]);
  const toast = useToast();

  useEffect(() => {
    refresh();
    fetchPublicProjects();
  }, []);

  useEffect(() => {
    if (selectedSong) {
      setEditorState({
        title: selectedSong.title || '',
        lyrics: selectedSong.lyrics || '',
        beatBlob: null,
        beatUrl: selectedSong.beatUrl || null,
        recordingBlob: null,
        recordingUrl: selectedSong.recordingUrl || null,
        status: selectedSong.status || 'private',
      });
    }
  }, [selectedSong]);

  async function refresh() {
    const all = await listSongs();
    setSongs(all);
    if (all.length > 0 && !selectedId) setSelectedId(all[0].id);
  }

  async function createNewSong() {
    try {
      const created = await createSong({ title: 'Untitled', lyrics: '', status: 'private' });
      await refresh();
      setSelectedId(created.id);
      setEditorState({ title: created.title || '', lyrics: created.lyrics || '', beatBlob: null, beatUrl: created.beatUrl || null, recordingBlob: null, recordingUrl: created.recordingUrl || null, status: created.status || 'private' });
    } catch (err) {
      toast.error('Failed to create song', err?.message || '');
    }
  }

  function updateSelected(updater) {
    setSongs((prev) => prev.map((s) => (s.id === selectedId ? updater(s) : s)));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      let beatUrl = editorState.beatUrl;
      let beatPublicId = null;
      if (editorState.beatBlob) {
        const beatRes = await uploadBeat(editorState.beatBlob);
        beatUrl = beatRes.url;
        beatPublicId = beatRes.publicId;
      }
      let recordingUrl = editorState.recordingUrl;
      let recordingPublicId = null;
      if (editorState.recordingBlob) {
        const recRes = await uploadRecording(editorState.recordingBlob);
        recordingUrl = recRes.url;
        recordingPublicId = recRes.publicId;
      }
      await updateSong(selectedSong.id, {
        title: editorState.title,
        lyrics: editorState.lyrics,
        beatUrl,
        beatPublicId,
        recordingUrl,
        recordingPublicId,
        status: editorState.status || 'private',
      });
      await refresh();
      toast.success('Song saved!');
    } catch (err) {
      console.error('Save failed', err);
      toast.error('Failed to save song', err?.message || '');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this song?')) return;
    try {
      await removeSong(id);
      await refresh();
      setSelectedId(null);
      toast.success('Song deleted!');
    } catch (err) {
      toast.error('Failed to delete song', err?.message || '');
    }
  }

  function handleEditorChange(next) {
    setEditorState((prev) => ({ ...prev, ...next }));
  }

  function handleUploadBeat(file) {
    setEditorState((prev) => ({ ...prev, beatBlob: file, beatUrl: null }));
  }

  function handleUploadRecording(file) {
    setEditorState((prev) => ({ ...prev, recordingBlob: file, recordingUrl: null }));
  }

  function handleClearBeat() {
    setEditorState((prev) => ({ ...prev, beatBlob: null, beatUrl: null }));
  }

  function handleClearRecording() {
    setEditorState((prev) => ({ ...prev, recordingBlob: null, recordingUrl: null }));
  }

  async function fetchPublicProjects() {
    const res = await fetch('/api/songs/public');
    const data = await res.json();
    setPublicProjects(data);
  }

  // No longer using local export/import

  const working = selectedSong || null;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0b0b0c] text-zinc-200 pt-16 md:pt-20">
      <header className="mx-auto w-full max-w-6xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <div className="font-semibold tracking-wide text-2xl md:text-3xl">Workspace</div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-2 sm:px-4 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="col-span-1 flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl shadow-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-indigo-300 mb-2">My Projects</h2>
          <SongList
            songs={songs}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id)}
            onDelete={handleDelete}
            onNew={createNewSong}
          />
        </section>
        <section className="col-span-1 md:col-span-1 lg:col-span-2 flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl shadow-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-indigo-300 mb-2">Project Editor</h2>
          <Editor
            song={editorState}
            onChange={handleEditorChange}
            onSave={handleSave}
            onUploadBeat={handleUploadBeat}
            onUploadRecording={handleUploadRecording}
            onClearBeat={handleClearBeat}
            onClearRecording={handleClearRecording}
            isSaving={isSaving}
            hasSelection={!!selectedSong}
          />
        </section>
      </main>
    </div>
  );
}

