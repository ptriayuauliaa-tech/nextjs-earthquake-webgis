interface SummaryBarProps {
  earthquakeCount: number;
  areaCount: number;
  lastUpdated?: number;
}

export default function SummaryBar({
  earthquakeCount,
  areaCount,
  lastUpdated,
}: SummaryBarProps) {
  return (
    <div className="flex items-center gap-6 border-b border-line bg-panel px-4 py-2 font-mono text-xs text-ink-muted">
      <span>
        Gempa ditampilkan: <span className="text-ink">{earthquakeCount}</span>
      </span>
      <span>
        Area pantauan: <span className="text-ink">{areaCount}</span>
      </span>
      {lastUpdated && (
        <span>
          Update terakhir:{" "}
          <span className="text-ink">
            {new Date(lastUpdated).toLocaleTimeString("id-ID")}
          </span>
        </span>
      )}
    </div>
  );
}