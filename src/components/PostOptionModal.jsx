import React from "react";

const PostOptionsModal = ({
  open,
  onClose,
  onGoToPost,
  isOwner,
  isDraft,
  onEdit,
  onDelete,
  onUnfollow,
}) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Post Options</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className="modal-content">
          <button className="modal-option" onClick={onGoToPost}>
            <div className="option-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
            <div className="option-details">
              <h4>Go to Post</h4>
              <p>View full post page</p>
            </div>
          </button>

          {!isOwner && (
            <button className="modal-option danger" onClick={onUnfollow}>
              <div className="option-icon danger">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 31.906 32"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                >
                  <path d="M29.323,28.000 L31.610,30.293 C31.999,30.684 31.999,31.316 31.610,31.707 C31.415,31.902 31.160,32.000 30.905,32.000 C30.649,32.000 30.394,31.902 30.200,31.707 L27.913,29.414 L25.627,31.707 C25.432,31.902 25.177,32.000 24.922,32.000 C24.667,32.000 24.412,31.902 24.217,31.707 C23.827,31.316 23.827,30.684 24.217,30.293 L26.503,28.000 L24.217,25.707 C23.827,25.316 23.827,24.684 24.217,24.293 C24.606,23.902 25.237,23.902 25.627,24.293 L27.913,26.586 L30.200,24.293 C30.589,23.902 31.220,23.902 31.610,24.293 C31.999,24.684 31.999,25.316 31.610,25.707 L29.323,28.000 ZM21.638,22.294 C22.028,22.684 22.028,23.317 21.638,23.707 C21.249,24.097 20.618,24.098 20.228,23.706 L19.231,22.706 C19.031,22.505 18.925,22.229 18.940,21.947 C18.956,21.664 19.089,21.400 19.308,21.222 C22.876,18.321 23.000,13.053 23.000,13.000 L23.000,7.000 C22.444,4.024 18.877,2.035 16.019,2.001 L15.948,2.003 C13.076,2.003 9.529,4.087 8.968,7.087 L8.964,12.994 C8.964,13.045 9.019,18.324 12.587,21.225 C12.845,21.435 12.982,21.761 12.952,22.093 C12.922,22.425 12.728,22.720 12.436,22.880 L1.988,28.594 L1.988,30.000 L20.933,30.000 C21.484,30.000 21.930,30.448 21.930,31.000 C21.930,31.552 21.484,32.000 20.933,32.000 L1.988,32.000 C0.888,32.000 -0.007,31.103 -0.007,30.000 L-0.007,28.000 C-0.007,27.634 0.193,27.297 0.513,27.122 L10.274,21.785 C7.005,18.239 7.000,13.232 7.000,13.000 L7.000,7.000 L6.987,6.832 C7.672,2.777 12.112,0.043 15.865,0.003 L15.948,-0.000 C19.718,-0.000 24.219,2.744 24.908,6.829 L24.922,6.996 L24.926,12.990 C24.926,13.227 24.888,18.479 21.380,22.034 L21.638,22.294 Z" />
                </svg>
              </div>
              <div className="option-details">
                <h4>Unfollow</h4>
                <p>Stop following this user</p>
              </div>
            </button>
          )}

          {isOwner && isDraft && (
            <button className="modal-option" onClick={onEdit}>
              <div className="option-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </div>
              <div className="option-details">
                <h4>Edit Draft</h4>
                <p>Modify your draft post</p>
              </div>
            </button>
          )}

          {isOwner && (
            <button className="modal-option danger" onClick={onDelete}>
              <div className="option-icon danger">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </div>
              <div className="option-details">
                <h4>Delete Post</h4>
                <p>Permanently remove this post</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostOptionsModal;