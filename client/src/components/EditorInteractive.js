import React, { useState } from 'react';
import NodeTree from './NodeTree';

function EditorInteractive() {
  const [formState, setFormState] = useState({
    title: '',
    descriptionShort: '',
    // Weitere Felder hier hinzufügen
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(value, name);
  };

  return (
    <div>
      <input
        type='text'
        name='title'
        value={formState.title}
        placeholder='Titel'
        onChange={handleInputChange}
      />
      <input
        type='text'
        name='descriptionShort'
        value={formState.descriptionShort}
        placeholder='Kurzbeschreibung'
        onChange={handleInputChange}
      />
      {/* Weitere Input-Felder hier hinzufügen */}
      <NodeTree />
    </div>

  );
}

export default EditorInteractive;
