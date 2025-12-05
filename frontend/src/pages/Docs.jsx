export default function DocsPage() {
  function renderSection(section) {
    return (
      <div
        key={section.title}
        className="
          rounded-xl border border-slate-700
          bg-slate-900/60
          p-5 mb-6
          shadow-lg shadow-black/30
          text-slate-200
        "
      >
        <h2 className="text-xl font-bold tracking-wide mb-3 text-emerald-400">
          {section.title}
        </h2>

        <p className="text-sm leading-relaxed text-slate-300 mb-4">
          {section.description}
        </p>

        {section.endpoints?.map(renderEndpoint)}
      </div>
    );
  }

  function renderEndpoint(endpoint) {
    return (
      <div
        key={endpoint.path}
        className="border border-slate-700 rounded-lg p-4 mb-3 bg-slate-950/60"
      >
        <p className="font-mono text-emerald-300">{endpoint.method}</p>
        <p className="font-mono text-slate-200">{endpoint.path}</p>
        <p className="text-sm text-slate-400 mt-2">{endpoint.details}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-16 py-10 text-slate-50 bg-linear-to-br from-slate-950 via-slate-900 to-black">
      <h1 className="text-3xl font-extrabold tracking-[0.18em] mb-8">
        Documentación de la API
      </h1>

      {docs.sections.map(renderSection)}
    </div>
  );
}