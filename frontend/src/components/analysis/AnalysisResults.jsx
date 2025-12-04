import React from "react";

export default function AnalysisResults({ table, onExport, exporting }) {
  if (!table || !table.columns) return null;

  const { columns, rows } = table;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-secondary-700 rounded-lg bg-secondary-950">
        <table className="min-w-full text-sm text-primary-50">
          <thead className="bg-secondary-900">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-4 py-2 text-left font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-secondary-950" : "bg-secondary-900"}
              >
                {columns.map(col => (
                  <td key={col} className="px-4 py-2">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        {["csv", "xlsx", "pdf", "json"].map(fmt => (
          <button
            key={fmt}
            onClick={() => onExport(fmt)}
            disabled={exporting}
            className="px-4 py-2 rounded-md bg-accent-600 hover:bg-accent-500 text-primary-900 text-sm transition disabled:opacity-60"
          >
            {exporting ? "Exportando..." : fmt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
