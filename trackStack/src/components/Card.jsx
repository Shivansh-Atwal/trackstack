export default function Card({ title, description, icon, children }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 opacity-30 blur-3xl pointer-events-none bg-[radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_0%_100%,rgba(34,211,238,0.25),transparent_40%)]" />
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/40 via-indigo-400/40 to-blue-500/40 transition duration-300 group-hover:from-cyan-400/60 group-hover:via-indigo-400/60 group-hover:to-blue-500/60">
        <div className="rounded-2xl h-full w-full border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-[0_10px_30px_rgba(79,70,229,0.15)] transition-transform duration-300 group-hover:-translate-y-0.5">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 text-indigo-200 flex items-center justify-center text-xl">
                {icon}
              </div>
            )}
            <div>
              {title && <div className="text-zinc-100 font-semibold tracking-tight text-lg">{title}</div>}
              {description && <div className="mt-1 text-sm text-zinc-300/90 leading-relaxed">{description}</div>}
            </div>
          </div>
          {children && <div className="mt-4 pt-3 border-t border-white/10">{children}</div>}
        </div>
      </div>
    </div>
  );
}

