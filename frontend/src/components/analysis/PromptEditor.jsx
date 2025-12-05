import React from "react";
import InputControl from "../UI/InputControl";
import Button from "../UI/Button";

export default function PromptEditor(props) {
  const { title, content, onChangeTitle, onChangeContent, onSave } = props;

  function handleSave() {
    if (onSave) onSave();
  }

  return (
    <div
      className="
        rounded-xl border border-slate-800 bg-slate-900/60
        p-6 shadow-lg shadow-black/40
      "
    >
      <InputControl
        id="title"
        label="Título"
        value={title}
        onChange={onChangeTitle}
      />

      <InputControl
        id="content"
        label="Contenido"
        value={content}
        onChange={onChangeContent}
        className="mt-4"
      />

      <Button className="mt-6" onClick={handleSave}>
        Guardar prompt
      </Button>
    </div>
  );
}
