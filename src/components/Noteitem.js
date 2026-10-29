// frontend/src/components/Noteitem.js

import React, { useState } from "react";
import { Modal } from "bootstrap";
import "./Noteitem.css";

const Noteitem = (props) => {
  const { note, updateNote, deleteNote, showAlert } = props;

  // ✅ checkbox state
  const [checked, setChecked] = useState(false);

  // 🕒 FORMAT DATE
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 🎨 AUTO COLOR FROM TAG
  const getTagColor = (tag) => {
    if (!tag) return "#6c757d";
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 70%, 45%)`;
  };

  const tagColor = getTagColor(note.tag || "General");

  // ✅ OPEN MODAL (SAFE)
  const openModal = (e) => {
    e.stopPropagation();
    const modalEl = document.getElementById(`viewModal-${note._id}`);
    if (!modalEl) return;

    const modalInstance =
      Modal.getInstance(modalEl) || new Modal(modalEl);

    modalInstance.show();
  };

  return (
    <>
      {/* ================= NOTE CARD ================= */}
      <div className="col-md-3">
        <div className="card my-3 h-100 shadow-sm position-relative note-card">

          {/* 🎀 TAG RIBBON (UNCHANGED) */}
          <div className="ribbon">
            <span style={{ backgroundColor: tagColor }}>
              {note.tag || "General"}
            </span>
          </div>

          <div className="card-body d-flex flex-column note-card-body">

            {/* TITLE + ICONS */}
            <div className="d-flex align-items-start">

              {/* ✅ CHECKBOX */}
              <input
                type="checkbox"
                className="form-check-input mt-1 me-2"
                checked={checked}
                onClick={(e) => e.stopPropagation()}
                onChange={() => setChecked(!checked)}
              />

              <h5
                className="card-title mb-0 flex-grow-1"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  paddingRight: "45px",
                }}
              >
                {note.title}
              </h5>

              <div className="d-flex flex-shrink-0 ms-2">
                {/* ✏️ EDIT */}
                <i
                  className="far fa-edit mx-2"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateNote(note);
                  }}
                ></i>

                {/* 🗑 DELETE */}
                <i
                  className="far fa-trash-alt mx-2"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note._id);
                    showAlert("Note deleted", "success");
                  }}
                ></i>
              </div>
            </div>

            {/* DESCRIPTION PREVIEW */}
            <p
              className="card-text text-muted mt-2"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {note.description}
            </p>

            {/* DATE + VIEW */}
            <div className="mt-auto d-flex justify-content-between align-items-center">
              <small className="text-muted">
                {formatDateTime(note.date)}
              </small>

              {/* 👁️ VIEW */}
              <i
                className="far fa-eye fs-5"
                style={{ cursor: "pointer" }}
                onClick={openModal}
              ></i>
            </div>
          </div>
        </div>
      </div>

      {/* ================= VIEW NOTE MODAL ================= */}
      <div
        className="modal fade"
        id={`viewModal-${note._id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">{note.title}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <span
                className="badge mb-2"
                style={{ backgroundColor: tagColor }}
              >
                {note.tag || "General"}
              </span>

              <p className="mt-3" style={{ whiteSpace: "pre-wrap" }}>
                {note.description}
              </p>

              <small className="text-muted">
                Created on: {formatDateTime(note.date)}
              </small>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Noteitem;
