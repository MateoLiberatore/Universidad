import React from "react";
import ListItem from "../UI/ListItem";

export default function DatasetList(props) {
  const { datasets, onRemove } = props;

  function renderItem(item) {
    function handleRemove() {
      if (onRemove) onRemove(item.id);
    }

    return <ListItem key={item.id} label={item.name} onRemove={handleRemove} />;
  }

  return <div className="space-y-2">{datasets.map(renderItem)}</div>;
}
