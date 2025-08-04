import React, { useState } from "react";
import Modal from "../components/PostForm";

const myPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="dashboard-summary">
      <h1>Social Summary</h1>
      <p>This is the page for user's posts and drafts.</p>
      <Modal modal={isModalOpen} toggleModal={toggleModal} />
    </div>
  );
};

export default myPost;

/* line 15 " <Modal modal={isModalOpen} toggleModal={toggleModal} /> "
calls the button from the PostForm page that enaables the modal pop up */
