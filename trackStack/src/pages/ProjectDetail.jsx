import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listSongs } from '../api';
import AudioPlayer from '../components/AudioPlayer';
import { useToast } from '../contexts/ToastContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    fetchSong();
  }, [id]);

  async function fetchSong() {
    try {
      setIsLoading(true);
      console.log('Fetching song with ID:', id);
      
      // Use the proper API function instead of direct fetch
      const songs = await listSongs();
      console.log('All songs fetched:', songs);
      
      const foundSong = songs.find(s => s.id === id || s._id === id);
      console.log('Found song:', foundSong);
      
      if (!foundSong) {
        throw new Error('Project not found');
      }
      
      setSong(foundSong);
    } catch (err) {
      console.error('Failed to fetch song:', err);
      showError(err.message || 'Failed to load project');
      navigate('/my-projects');
    } finally {
      setIsLoading(false);
    }
  }

  function handleBack() {
    navigate(-1);
  }

  function handleEdit() {
    navigate('/app');
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-[#0b0b0c] text-zinc-200 pt-16 md:pt-20">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-[#0b0b0c] text-zinc-200 pt-16 md:pt-20">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0b0b0c] text-zinc-200 pt-16 md:pt-20">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBack}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {song.title || 'Untitled Project'}
              </h1>
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  song.status === 'public' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                }`}>
                  {song.status === 'public' ? 'Public' : 'Private'}
                </span>
                <span>Created {new Date(song.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Edit Project
            </button>
          </div>
        </div>

        {/* Main Content - Spotify-like Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Audio Players */}
          <div className="space-y-6">
            {/* Beat Section */}
            {song.beatUrl && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">🎵 Beat</h3>
                  <p className="text-sm text-zinc-400">Instrumental track</p>
                </div>
                <AudioPlayer url={song.beatUrl} label="Beat" />
              </div>
            )}

            {/* Recording Section */}
            {song.recordingUrl && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">🎤 Recording</h3>
                  <p className="text-sm text-zinc-400">Vocal track</p>
                </div>
                <AudioPlayer url={song.recordingUrl} label="Recording" />
              </div>
            )}

            {/* No Audio Message */}
            {!song.beatUrl && !song.recordingUrl && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-2">No Audio Yet</h3>
                <p className="text-zinc-500">Upload a beat or recording to hear your project</p>
              </div>
            )}
          </div>

          {/* Right Side - Lyrics */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">📝 Lyrics</h3>
              <p className="text-sm text-zinc-400">Song lyrics and notes</p>
            </div>
            
            {song.lyrics ? (
              <div className="bg-white/5 rounded-lg p-4">
                <div className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed">
                  {song.lyrics}
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-2">No Lyrics Yet</h3>
                <p className="text-zinc-500">Add lyrics to your project to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Project Stats */}
       
      </div>
    </div>
  );
}
