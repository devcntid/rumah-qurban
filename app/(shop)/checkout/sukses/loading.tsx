export default function SuksesLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center skeleton-delay">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-green-100 animate-pulse" />
        </div>
        <div className="h-5 w-52 rounded bg-slate-200 animate-pulse mx-auto mb-2" />
        <div className="h-3 w-44 rounded bg-slate-100 animate-pulse mx-auto mb-6" />
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-md mb-6">
          <div className="h-3 w-24 rounded bg-slate-200 animate-pulse mb-2" />
          <div className="h-6 w-36 rounded bg-slate-200 animate-pulse mb-3" />
          <div className="h-px bg-slate-200 w-full mb-3" />
          <div className="h-3 w-28 rounded bg-slate-200 animate-pulse mb-2" />
          <div className="h-5 w-44 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="h-11 w-full rounded-md bg-slate-200 animate-pulse mb-3" />
        <div className="h-9 w-full rounded-md bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}
