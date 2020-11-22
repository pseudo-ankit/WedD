import React, { useState } from "react";
import Header from "./Header";
import CreateArea from "./CreateArea";
import Footer from "./Footer";
import Note from "./Note";
// import notes from "../notes";

// function App() {
//   return (
//     <div>
//       <Header />
//       {notes.map((note) => (
//         <Note key={note.key} title={note.title} content={note.content} />
//       ))}
//       ;
//       <Footer />
//     </div>
//   );
// }

function App() {
  const [notes, setNotes] = useState([
    {
      title: "Note Title",
      content: "Note Content",
    },
  ]);

  function addNote(note) {
    setNotes((prevValues) => {
      return [...prevValues, note];
    });
  }

  function deleteNote(id) {
    setNotes(
      notes.filter((note, index) => {
        return index !== id;
      })
    );
  }

  return (
    <div>
      <Header />
      <CreateArea addNote={addNote} notes={notes} setNotes={setNotes} />
      {notes.map((note, index) => (
        <Note
          key={index}
          id={index}
          title={note.title}
          content={note.content}
          deleteNote={deleteNote}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;
