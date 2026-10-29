import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";

const Notes = (props) => {
  const context = useContext(NoteContext);

  // ✅ deleteNote was missing earlier
  const { notes, getNotes, editNote, deleteNote } = context;

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);

  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    props.showAlert("Updated Successfully", "success");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AddNote showAlert={props.showAlert} />

      {/* EDIT MODAL TRIGGER */}
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch modal
      </button>

      {/* EDIT MODAL */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Note</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form>
                <input
                  className="form-control mb-2"
                  name="etitle"
                  value={note.etitle}
                  onChange={onChange}
                  minLength={5}
                  required
                />
                <input
                  className="form-control mb-2"
                  name="edescription"
                  value={note.edescription}
                  onChange={onChange}
                  minLength={5}
                  required
                />
                <input
                  className="form-control"
                  name="etag"
                  value={note.etag}
                  onChange={onChange}
                />
              </form>
            </div>

            <div className="modal-footer">
              <button
                ref={refClose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                disabled={
                  note.etitle.length < 5 || note.edescription.length < 5
                }
                className="btn btn-primary"
                onClick={handleClick}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NOTES GRID */}
      <div className="row">
        <h2>Your Notes</h2>
        {notes.length === 0 && "No notes to display"}

        {notes.map((note) => (
          <Noteitem
            key={note._id}
            note={note}
            updateNote={updateNote}
            deleteNote={deleteNote}   
            showAlert={props.showAlert}
          />
        ))}
      </div>
    </>
  );
};

export default Notes;
