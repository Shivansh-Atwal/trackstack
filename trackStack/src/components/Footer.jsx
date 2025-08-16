import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-white/10 bg-black/30 text-zinc-300">
      {/* Top blue crystal line */}
      <div className="pointer-events-none absolute inset-x-0 -top-[2px] h-[2px]">
        <div className="h-full w-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-blue-500" />
        <div className="absolute inset-0 blur-md opacity-40 bg-gradient-to-r from-cyan-400 via-indigo-400 to-blue-500" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-white font-semibold tracking-wide">🎵 TrackStack</div>
            <p className="mt-2 text-sm text-zinc-400 max-w-prose">
              Write lyrics, attach beats, and record ideas. Keep everything local to your device with quick backup and restore.
            </p>
          </div>

          <div>
            <div className="text-zinc-200 font-medium">Links</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link className="hover:text-indigo-300" to="/">Home</Link></li>
              <li><Link className="hover:text-indigo-300" to="/app">Open App</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-zinc-200 font-medium">Info</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li><a className="hover:text-indigo-300" href="#features">Features</a></li>
              <li><a className="hover:text-indigo-300" href="#faq">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-4 md:flex-row">
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} TrackStack. All rights reserved.</p>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span>Local-first</span>
            <span>•</span>
            <span>No sign-in required</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

