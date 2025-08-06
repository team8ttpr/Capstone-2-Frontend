import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../shared';
import SpotifyEmbed from './SpotifyEmbed';
import '../style/SearchComponent.css';

const SearchComponent = ({ onResultSelect, placeholder = "Search for music..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    tracks: [],
    artists: [],
    albums: [],
    playlists: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tracks');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ tracks: [], artists: [], albums: [], playlists: [] });
      setHasSearched(false);
      setError('');
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true);
      setError('');
      setHasSearched(true);

      console.log('Searching for:', searchQuery);
      console.log('API URL:', API_URL);

      const response = await axios.get(`${API_URL}/api/search-songs`, {
        params: { q: searchQuery.trim() },
        timeout: 10000
      });

      console.log('Search response:', response.data);
      setResults(response.data);
    } catch (err) {
      console.error('Search error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      
      if (err.code === 'ECONNABORTED') {
        setError('Search timed out. Please try again.');
      } else if (err.response?.status === 500) {
        setError(`Server error: ${err.response?.data?.error || 'Internal server error'}`);
      } else if (err.response?.status === 400) {
        setError(`Bad request: ${err.response?.data?.error || 'Invalid search query'}`);
      } else if (err.response) {
        setError(`Search failed: ${err.response?.data?.error || `HTTP ${err.response.status}`}`);
      } else if (err.request) {
        setError('Cannot connect to search service. Please check your connection.');
      } else {
        setError(`Search failed: ${err.message}`);
      }
      
      setResults({ tracks: [], artists: [], albums: [], playlists: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
  };

  const getSpotifyId = (item) => {
    if (item.spotify_url) {
      const match = item.spotify_url.match(/\/(track|artist|album|playlist)\/([a-zA-Z0-9]+)/);
      return match ? match[2] : null;
    }
    return item.id;
  };

  const renderResultItem = (item) => {
    const spotifyId = getSpotifyId(item);
    
    return (
      <div 
        key={item.id} 
        className="search-result-item"
        onClick={() => handleResultClick(item)}
      >
        <div className="result-image">
          {item.image ? (
            <img src={item.image} alt={item.name} />
          ) : (
            <div className="placeholder-image">
              {item.type === 'artist' ? '👤' : 
               item.type === 'album' ? '💿' : 
               item.type === 'playlist' ? '📋' : '🎵'}
            </div>
          )}
        </div>
        
        <div className="result-info">
          <h4 className="result-name">{item.name}</h4>
          {item.author && <p className="result-author">{item.author}</p>}
          
          {item.type === 'track' && item.album && (
            <p className="result-detail">Album: {item.album}</p>
          )}
          
          {item.type === 'artist' && item.followers > 0 && (
            <p className="result-detail">{item.followers.toLocaleString()} followers</p>
          )}
          
          {item.type === 'album' && (
            <p className="result-detail">
              {item.total_tracks} tracks • {item.release_date?.split('-')[0]}
            </p>
          )}
          
          {item.type === 'playlist' && (
            <p className="result-detail">{item.track_count} tracks</p>
          )}
        </div>

        <div className="result-actions">
          {spotifyId && (
            <div className="spotify-embed-mini">
              <SpotifyEmbed 
                type={item.type} 
                id={spotifyId} 
                width="300" 
                height="80" 
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const tabs = [
    { key: 'tracks', label: 'Tracks', count: results.tracks?.length || 0 },
    { key: 'artists', label: 'Artists', count: results.artists?.length || 0 },
    { key: 'albums', label: 'Albums', count: results.albums?.length || 0 },
    { key: 'playlists', label: 'Playlists', count: results.playlists?.length || 0 }
  ];

  return (
    <div className="search-component">
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        {loading && <div className="search-loading">🔍</div>}
      </div>

      {error && (
        <div className="search-error">
          <p>{error}</p>
          <button onClick={() => performSearch(query)} className="retry-btn">
            Retry Search
          </button>
        </div>
      )}

      {hasSearched && !error && (
        <div className="search-results">
          <div className="search-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`search-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="search-results-content">
            {results[activeTab]?.length > 0 ? (
              <div className="results-list">
                {results[activeTab].map(renderResultItem)}
              </div>
            ) : (
              <div className="no-results">
                <p>No {activeTab} found for "{query}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;