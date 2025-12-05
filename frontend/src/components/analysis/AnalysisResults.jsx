import React from "react";
import Card from "../elements/Card";

export default function AnalysisResults(props) {
  const { results } = props;

  function renderItem(item, index) {
    return (
      <div
        key={index}
        className="
          border border-slate-700 rounded-lg
          bg-slate-900/60
          p-4 mb-3
          shadow-sm shadow-black/20
        "
      >
        <p className="text-slate-300 text-sm leading-relaxed">
          {item}
        </p>
      </div>
    );
  }

  return (
    <Card title="Resultados del análisis">
      {results.map(renderItem)}
    </Card>
  );
}
