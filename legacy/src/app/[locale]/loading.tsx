export default function LocaleLoading() {
  return (
    <main className="pt-20 pb-12 px-4 max-w-6xl mx-auto" aria-busy="true" aria-live="polite">
      <div className="mb-6 h-6 w-40 rounded bg-bg-card animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-bg-card/60 p-4">
            <div className="mb-4 aspect-[4/3] rounded-xl bg-bg-secondary animate-pulse" />
            <div className="mb-2 h-4 w-3/4 rounded bg-bg-secondary animate-pulse" />
            <div className="mb-2 h-3 w-full rounded bg-bg-secondary animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-bg-secondary animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}
