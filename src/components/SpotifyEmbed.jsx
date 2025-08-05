import React from 'react';

const SpotifyEmbed = ({ type = "track", id, width = "100%", height = 152 }) => {
    if (!id || !type) {
        return null;
    }
    
    const src = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
    
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