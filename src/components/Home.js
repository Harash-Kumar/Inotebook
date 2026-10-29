// frontend/src/components/Home.js

import React from "react";
import AddNote from "./AddNote"; // 🔹 ADD NOTE FORM ONLY

const Home = (props) => {
  const { showAlert } = props;

  return (
    <div className="container my-3">

      {/* 🔹 ONLY ADD NOTE FORM */}
      <AddNote showAlert={showAlert} />
    </div>
  );
};

export default Home;
