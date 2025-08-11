import React from 'react';

const SpotifyEmbed = ({ type = "track", id, width = "100%", height = 152, theme = 'dark' }) => {
    if (!id || !type) {
        return null;
    }
    // Add theme param if provided
    let src = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=${theme === 'light' ? 1 : 0}`;
    return (
        <iframe
                src={src}
                width={width}
                height={height}
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`${type} embed`}
            />
    );
};

export default SpotifyEmbed;