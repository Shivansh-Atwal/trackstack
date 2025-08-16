import { useEffect, useState, useMemo } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import { API_BASE } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Shared() {
  const [publicProjects, setPublicProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const filteredProjects = useMemo(() => {
    if (!query) return publicProjects;
    const q = query.toLowerCase();
    return publicProjects.filter(
      (proj) => (proj.title || '').toLowerCase().includes(q) || 
                (proj.lyrics || '').toLowerCase().includes(q) ||
                (proj.userId?.name || '').toLowerCase().includes(q)
    );
  }, [publicProjects, query]);

  useEffect(() => {
    async function fetchPublicProjects() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/songs/public`);
        if (!res.ok) throw new Error('Failed to fetch public projects');
        const data = await res.json();
        setPublicProjects(data);
      } catch (err) {
        setError('Could not load public projects.');
      } finally {
        setLoading(false);
      }
    }
    fetchPublicProjects();
  }, []);

  function handleCardClick(projectId) {
    navigate(`/project/${projectId}`);
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0b0b0c] text-zinc-200 pt-16 md:pt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Shared Projects</h1>
          <p className="text-zinc-400">Discover music projects shared by the community</p>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-indigo-400 text-white placeholder-zinc-400"
              placeholder="Search projects by title, lyrics, or artist..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>{filteredProjects.length} of {publicProjects.length} projects</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">{error}</div>
        ) : (
          <>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                    {query ? 'No projects found' : 'No shared projects yet'}
                  </h3>
                  <p className="text-zinc-500">
                    {query ? 'Try adjusting your search terms' : 'Be the first to share your music with the community'}
                  </p>
                </div>
              ) : (
                filteredProjects.map((proj) => (
                  <div
                    key={proj._id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all hover:bg-white/10 hover:border-indigo-400/50 hover:scale-105 group"
                    onClick={() => handleCardClick(proj._id)}
                  >
                    {/* Project Card - Simplified */}
                    <div className="space-y-4">
                      {/* Song Title */}
                      <div className="text-center">
                        <h3 className="font-semibold text-white text-lg group-hover:text-indigo-300 transition-colors">
                          {proj.title || 'Untitled Project'}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1">
                          by {proj.userId?.name || 'Unknown Artist'}
                        </p>
                      </div>

                      {/* Recording Audio Only */}
                      {proj.recordingUrl && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <AudioPlayer url={proj.recordingUrl} label="Recording" />
                        </div>
                      )}

                      {/* Project Status */}
                      <div className="flex justify-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          proj.beatUrl 
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                            : 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                        }`}>
                          {proj.beatUrl ? '🎚️ Beat' : '❌ No Beat'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          proj.recordingUrl 
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                            : 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                        }`}>
                          {proj.recordingUrl ? '🎤 Recording' : '❌ No Recording'}
                        </span>
                      </div>

                      {/* Quick Info */}
                      <div className="text-center">
                        <p className="text-xs text-zinc-500">
                          Click to view full project
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Community Stats */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-2xl">🎵</span>
                <span className="text-zinc-300">
                  {publicProjects.length} project{publicProjects.length !== 1 ? 's' : ''} shared
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
