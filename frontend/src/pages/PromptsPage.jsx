import React, { useState, useEffect } from "react";
import PromptCard from "../components/prompts/PromptCard";
import { listPrompts, createPrompt, updatePrompt, deletePrompt } from "../api/services/promptService";
import { useNavigate } from "react-router-dom";

export default function PromptsPage({ token }) {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    listPrompts(token).then(setPrompts).catch(() => {});
  }, [token]);

  const save = async () => {
    if (!title.trim() || !text.trim()) {
      setError("Título y prompt requeridos");
      return;
    }
    try {
      let result;
      if (editing) {
        result = await updatePrompt(token, editing.id, {
          title,
          description: desc,
          prompt_text: text
        });
        setPrompts(prev => prev.map(p => (p.id === result.id ? result : p)));
      } else {
        result = await createPrompt(token, {
          title,
          description: desc,
          prompt_text: text
        });
        setPrompts(prev => [result, ...prev]);
      }
      setEditing(null);
      setTitle("");
      setDesc("");
      setText("");
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async p => {
    await deletePrompt(token, p.id);
    setPrompts(prev => prev.filter(x => x.id !== p.id));
  };

  const usePrompt = p => navigate("/analysis", { state: { prompt: p.prompt_text } });

  const startEdit = p => {
    setEditing(p);
    setTitle(p.title);
    setDesc(p.description || "");
    setText(p.prompt_text);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-2xl text-primary-50 font-semibold">Prompts</h1>

      {error && (
        <div className="p-3 bg-amber-900 text-amber-200 rounded-md text-sm border border-amber-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {prompts.map(p => (
          <PromptCard
            key={p.id}
            prompt={p}
            onUse={usePrompt}
            onEdit={startEdit}
            onDelete={remove}
          />
        ))}
      </div>

      <div className="bg-secondary-950 border border-secondary-800 rounded-xl p-4 space-y-3">
        <h2 className="text-lg text-primary-50 font-medium">
          {editing ? "Editar prompt" : "Nuevo prompt"}
        </h2>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título"
          className="w-full p-2 bg-secondary-900 border border-secondary-700 rounded-md text-primary-50"
        />

        <input
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Descripción"
          className="w-full p-2 bg-secondary-900 border border-secondary-700 rounded-md text-primary-50"
        />

        <textarea
          rows={6}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Texto completo del prompt"
          className="w-full p-2 bg-secondary-900 border border-secondary-700 rounded-md text-primary-50"
        />

        <button
          onClick={save}
          className="px-4 py-2 bg-accent-600 text-primary-900 rounded-md text-sm"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
