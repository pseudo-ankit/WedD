import React, { useState } from "react";

function CreateArea({ addNote }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function handleTitle(event) {
    setTitle(event.target.value);
  }

  function handleContent(event) {
    setContent(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    addNote({
      title: title,
      content: content,
    });
    setTitle("");
    setContent("");
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={title}
          onChange={handleTitle}
        />
        <textarea
          name="content"
          placeholder="Take a note..."
          rows="3"
          value={content}
          onChange={handleContent}
        />
        <button>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
