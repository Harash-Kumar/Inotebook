// frontend/src/components/About.js

import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";

const About = (props) => {
  const context = useContext(noteContext);
  const { notes, getNotes, deleteNote, editNote } = context;

  // 🔹 MODAL REF
  const ref = useRef(null);
  const refClose = useRef(null);

  // 🔹 STATE FOR EDIT NOTE
  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  // 🔹 FETCH NOTES
  useEffect(() => {
    getNotes();
    // eslint-disable-next-line
  }, []);

  // 🔹 OPEN MODAL FROM NOTEITEM
  const updateNote = (currentNote) => {
    ref.current.click(); // 🔥 OPEN MODAL
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  // 🔹 HANDLE UPDATE
  const handleClick = (e) => {
    e.preventDefault();
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    props.showAlert("Note updated successfully", "success");
  };

  // 🔹 HANDLE CHANGE
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* 🔹 HIDDEN MODAL BUTTON */}
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#editModal"
        ref={ref}
      >
        Launch modal
      </button>

      {/* 🔹 EDIT MODAL */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="etitle"
                    value={note.etitle}
                    onChange={onChange}
                    minLength={3}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="edescription"
                    value={note.edescription}
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    name="etag"
                    value={note.etag}
                    onChange={onChange}
                  />
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
                disabled={
                  note.etitle.length < 3 || note.edescription.length < 5
                }
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 NOTES LIST */}
      <div className="container my-3">
        <h2>Your Notes</h2>
        {notes.length === 0 && "No notes to display"}

        <div className="row">
          {notes.map((note) => (
            <Noteitem
              key={note._id}
              note={note}
              updateNote={updateNote} // 🔥 VERY IMPORTANT
              deleteNote={deleteNote}
              showAlert={props.showAlert}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default About;