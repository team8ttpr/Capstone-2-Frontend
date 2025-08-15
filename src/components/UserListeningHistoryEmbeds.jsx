import React from "react";
import SpotifyEmbed from "./SpotifyEmbed";
import "../style/UserListeningHistoryEmbeds.css";

const UserListeningHistoryEmbeds = ({ recentTracks }) => {
  if (!recentTracks || recentTracks.length === 0) {
    return <div>No recent tracks found.</div>;
  }

  return (
    <div className="listening-history-embeds-container">
      <div className="listening-history-embeds-scroll">
        {recentTracks.map((item) => (
          <div className="embed-item" key={item.track.id}>
            <SpotifyEmbed type="track" id={item.track.id} width="100%" height={80} />
            <div className="embed-details">
              Album: {item.track.album}
              {item.timeAgo && !item.timeAgo.startsWith("NaN") && (
                <><br />Played: {item.timeAgo}</>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserListeningHistoryEmbeds;
