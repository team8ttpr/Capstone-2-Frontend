import React from "react";

const ShareModal = ({
  open,
  onClose,
  onCopyLink,
  linkCopied,
  twitterUrl,
  onRepost,
  repostDisabled = false,
}) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Share Post</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className="modal-content">
          <button className="modal-option copy" onClick={onCopyLink}>
            <div className="option-icon copy">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
            </div>
            <div className="option-details">
              <h4>Copy Link</h4>
              <p>Copy link to this post</p>
            </div>
            {linkCopied && (
              <svg
                className="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            )}
          </button>

          <a
            className="modal-option"
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="option-icon" style={{ color: "#1da1f2", borderColor: "#1da1f2" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 5.924c-.793.352-1.646.59-2.542.697a4.48 4.48 0 0 0 1.964-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.488 0-4.505 2.017-4.505 4.505 0 .353.04.698.117 1.028C7.728 9.37 4.1 7.548 1.671 4.905a4.48 4.48 0 0 0-.609 2.267c0 1.563.796 2.942 2.008 3.753a4.48 4.48 0 0 1-2.04-.564v.057c0 2.184 1.553 4.006 3.617 4.422a4.48 4.48 0 0 1-2.035.077c.574 1.793 2.24 3.098 4.215 3.133A8.99 8.99 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.017c8.26 0 12.785-6.842 12.785-12.785 0-.195-.004-.39-.013-.583A9.13 9.13 0 0 0 24 4.59a8.97 8.97 0 0 1-2.54.697z" />
              </svg>
            </div>
            <div className="option-details">
              <h4>Share to Twitter</h4>
              <p>Open Twitter to share this post</p>
            </div>
          </a>
          <button className="modal-option repost" onClick={onRepost} disabled={repostDisabled}>
            <div className="option-icon repost">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
              </svg>
            </div>
            <div className="option-details">
              <h4>Repost</h4>
              <p>Repost to your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;