import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
  const { isAuthed } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a2a] text-white">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-28 lg:pt-36 xl:pt-44 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Create. Collaborate. Share.
            </h1>
              <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
                The ultimate platform for singers and songwriters to bring their musical ideas to life. 
                Write lyrics, record vocals, mix beats, and share your creativity with the world.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {!isAuthed ? (
                <>
                  <Link
                    to="/signup"
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/25"
                  >
                    🎵 Start Creating Free
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 border-2 border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-2xl text-lg transition-all duration-300 hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
              <Link
                to="/app"
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/25"
              >
                  🎤 Go to Workspace
              </Link>
              )}
            </div>

            {/* Music Icons Animation */}
            <div className="flex justify-center items-center space-x-8 mb-16">
              <div className="animate-bounce delay-100">🎵</div>
              <div className="animate-bounce delay-200">🎤</div>
              <div className="animate-bounce delay-300">🎧</div>
              <div className="animate-bounce delay-500">🎼</div>
              <div className="animate-bounce delay-700">🎹</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to Create Music
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              From lyrics to final mix, we've got all the tools to turn your musical vision into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:border-purple-500/30 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">✍️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Lyrics Writing</h3>
              <p className="text-zinc-400 leading-relaxed">
                Write, edit, and organize your song lyrics with our intuitive text editor. 
                Save multiple versions and never lose your creative flow.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:border-pink-500/30 group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🎤</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Voice Recording</h3>
              <p className="text-zinc-400 leading-relaxed">
                Record your vocals directly in the browser. High-quality audio capture 
                with real-time monitoring and easy editing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:border-blue-500/30 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🎵</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Beat Upload</h3>
              <p className="text-zinc-400 leading-relaxed">
                Upload your own beats or instrumentals. Support for multiple audio formats 
                with instant preview and playback controls.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:border-green-500/30 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Share & Collaborate</h3>
              <p className="text-zinc-400 leading-relaxed">
                Share your projects with the community or keep them private. 
                Get feedback, collaborate with other artists, and grow together.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:border-yellow-500/30 group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Mobile First</h3>
              <p className="text-zinc-400 leading-relaxed">
                Create music anywhere, anytime. Fully responsive design that works 
                perfectly on all devices, from phones to desktops.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:border-indigo-500/30 group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure & Private</h3>
              <p className="text-zinc-400 leading-relaxed">
                Your music is safe with us. Choose what to share publicly and 
                what to keep private. Full control over your creative work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join the Music Community
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Connect with fellow musicians, discover new talent, and be part of a growing 
              community of creators who share your passion for music
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Community Stats */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-4xl font-bold text-purple-400 mb-2">1000+</div>
                  <div className="text-zinc-400">Active Musicians</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-4xl font-bold text-blue-400 mb-2">5000+</div>
                  <div className="text-zinc-400">Songs Created</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-4xl font-bold text-pink-400 mb-2">100+</div>
                  <div className="text-zinc-400">Daily Collaborations</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
                  <div className="text-zinc-400">Creative Support</div>
                </div>
            </div>
          </div>

            {/* Right Side - Community Image */}
            <div className="text-center">
          <div className="relative">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <div className="text-8xl">🎭</div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">🎵</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse delay-1000">
                  <span className="text-xl">🎤</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Create Your Next Hit?
          </h2>
          <p className="text-xl text-zinc-300 mb-8">
            Join thousands of musicians who are already creating amazing music on TrackStack
          </p>
          {!isAuthed ? (
            <Link
              to="/signup"
              className="inline-block px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-3xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/25"
            >
              🚀 Get Started Today
            </Link>
          ) : (
            <Link
              to="/app"
              className="inline-block px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-3xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/25"
            >
              🎤 Continue Creating
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-4">
              TrackStack
            </div>
            <p className="text-zinc-400 mb-6">
              Empowering musicians to create, collaborate, and share their passion with the world
            </p>
            <div className="flex justify-center space-x-6 text-sm text-zinc-500">
              <span>© 2024 TrackStack</span>
              <span>•</span>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <span>•</span>
              <Link to="/services" className="hover:text-white transition-colors">Services</Link>
              <span>•</span>
              <span>Privacy Policy</span>
            </div>
            </div>
        </div>
      </footer>
    </div>
  );
}

