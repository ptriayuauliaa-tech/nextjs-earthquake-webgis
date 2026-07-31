export default function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-line bg-panel px-4">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-signal" />
        <h1 className="text-sm font-semibold tracking-wide text-ink">
          EARTHQUAKE MONITORING
        </h1>
      </div>
      <p className="font-mono text-xs text-ink-muted">
        Sistem Pemantauan Gempa Publik
      </p>
    </header>
  );
}