import { useEffect, useState, useMemo } from 'react';
import { listSongs, removeSong } from '../api';
import { useToast } from '../contexts/ToastContext';
import AudioPlayer from '../components/AudioPlayer';
import { useNavigate } from 'react-router-dom';

export default function MyProjects() {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const filteredSongs = useMemo(() => {
    if (!query) return songs;
    const q = query.toLowerCase();
    return songs.filter(
      (s) => (s.title || '').toLowerCase().includes(q) || (s.lyrics || '').toLowerCase().includes(q)
    );
  }, [songs, query]);

  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    try {
      setIsLoading(true);
      const allSongs = await listSongs();
      console.log('Fetched songs:', allSongs); // Debug log
      setSongs(allSongs);
    } catch (err) {
      console.error('Failed to fetch songs:', err);
      showError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project?')) return;
    try {
      await removeSong(id);
      await fetchSongs();
      showSuccess('Project deleted successfully!');
    } catch (err) {
      showError('Failed to delete project');
    }
  }

  function handleCardClick(song) {
    console.log('Clicking on song:', song); // Debug log
    
    // Handle both id and _id fields (MongoDB uses _id, but some APIs might use id)
    const songId = song.id || song._id;
    
    if (songId) {
      console.log('Navigating to project:', songId);
      navigate(`/project/${songId}`);
    } else {
      console.error('No valid ID found for song:', song);
      showError('Invalid project ID');
    }
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

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0b0b0c] text-zinc-200 pt-16 md:pt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Projects</h1>
          <p className="text-zinc-400">Manage and organize your music projects</p>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-indigo-400 text-white placeholder-zinc-400"
              placeholder="Search projects by title or lyrics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>{filteredSongs.length} of {songs.length} projects</span>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSongs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                {query ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-zinc-500">
                {query ? 'Try adjusting your search terms' : 'Create your first music project to get started'}
              </p>
            </div>
          ) : (
            filteredSongs.map((song) => (
              <div
                key={song.id || song._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all hover:bg-white/10 hover:border-indigo-400/50 hover:scale-105 group"
                onClick={() => handleCardClick(song)}
              >
                {/* Project Card - Simplified */}
                <div className="space-y-4">
                  {/* Song Title */}
                  <div className="text-center">
                    <h3 className="font-semibold text-white text-lg group-hover:text-indigo-300 transition-colors">
                      {song.title || 'Untitled Project'}
                    </h3>
                  </div>

                  {/* Recording Audio Only */}
                  {song.recordingUrl && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <AudioPlayer url={song.recordingUrl} label="Recording" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      song.status === 'public' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                    }`}>
                      {song.status === 'public' ? 'Public' : 'Private'}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/app');
                      }}
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(song.id || song._id);
                      }}
                      className="text-sm text-rose-400 hover:text-rose-300 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/app')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            <span>🎵</span>
            Create New Project
          </button>
        </div>
      </div>
    </div>
  );
}