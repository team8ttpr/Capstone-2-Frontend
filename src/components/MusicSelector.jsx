import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import SpotifyEmbed from './SpotifyEmbed';
import '../style/SearchComponent.css';
//for profile
const MusicSelector = ({
  initialItems = [],
  maxItems = 5,
  onSave,
  onClose
}) => {
  const [selectedItems, setSelectedItems] = useState(initialItems);
  const [searchKey, setSearchKey] = useState(0); // key force remount/reset
  const [errorMsg, setErrorMsg] = useState("");

  // Reset selectedItems when initialItems changes (e.g., when reopening modal)
  useEffect(() => {
    setSelectedItems(initialItems);
  }, [initialItems]);

  // Add per-embed settings: theme (color), size (width/height), and width mode
  const defaultWidth = 300;
  const defaultHeight = 80;
  const defaultTheme = 'dark'; // Spotify supports 'dark' and 'light'
  const defaultWidthMode = 'fixed'; // 'fixed' or 'full'

  const handleResultSelect = (item) => {
    if (selectedItems.length >= maxItems) return;
    if (selectedItems.find(i => i.id === item.id)) return;
    setSelectedItems([...selectedItems, item]);
    setSearchKey(Date.now()); // force SearchComponent to reset
  };

  const handleRemove = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const handleSave = () => {
    // Convert width/height to numbers for backend
    const itemsToSave = selectedItems.map(item => ({
      ...item,
      width: item.width !== undefined ? Number(item.width) : undefined,
      height: item.height !== undefined ? Number(item.height) : undefined,
    }));
    onSave(itemsToSave);
    onClose();
  };

  const handleSettingChange = (idx, field, value) => {
    if (field === 'width' && Number(value) > 500) {
      setErrorMsg('Width cannot be greater than 500.');
      return;
    }
    if (field === 'height' && Number(value) > 400) {
      setErrorMsg('Height cannot be greater than 400.');
      return;
    }
    setErrorMsg("");
    setSelectedItems(items => items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="music-selector-overlay">
      <div className="music-selector-modal">
        <div className="music-selector-header">
          {errorMsg && (
            <div style={{ color: 'red', marginBottom: 8 }}>{errorMsg}</div>
          )}
          <button onClick={handleSave} className="save-btn-top">Save</button>
          <h3>Select up to {maxItems} Spotify items</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <SearchComponent key={searchKey} onResultSelect={handleResultSelect} placeholder="Search Spotify..." />
        <div className="selected-music-list-placeholders">
          {[...Array(maxItems)].map((_, idx) => (
            <div key={idx} className="selected-music-placeholder">
              {selectedItems[idx] ? (
                <div className="selected-music-item-preview">
                  <div className="embed-settings-row">
                    <label>
                      Color:
                      <span style={{ marginLeft: 8 }}>
                        <input
                          type="radio"
                          name={`theme-${idx}`}
                          checked={(selectedItems[idx].theme || defaultTheme) === 'dark'}
                          onChange={() => handleSettingChange(idx, 'theme', 'dark')}
                        />
                        <span style={{ margin: '0 8px 0 2px' }}>Dark</span>
                        <input
                          type="radio"
                          name={`theme-${idx}`}
                          checked={(selectedItems[idx].theme || defaultTheme) === 'light'}
                          onChange={() => handleSettingChange(idx, 'theme', 'light')}
                        />
                        <span style={{ marginLeft: 2 }}>Light</span>
                      </span>
                    </label>
                    <label style={{ marginLeft: 24 }}>
                      Size:
                      <select
                        value={selectedItems[idx].widthMode || defaultWidthMode}
                        onChange={e => handleSettingChange(idx, 'widthMode', e.target.value)}
                        style={{ marginLeft: 8 }}
                      >
                        <option value="fixed">Normal ({defaultWidth}px)</option>
                        <option value="full">100%</option>
                      </select>
                    </label>
                  </div>
                  {selectedItems[idx].widthMode === 'full' ? null : (
                    <label style={{ display: 'block', margin: '8px 0' }}>
                      Width:
                      <input
                        type="number"
                        min="100"
                        max="500"
                        value={selectedItems[idx].width || defaultWidth}
                        onChange={e => handleSettingChange(idx, 'width', e.target.value)}
                        style={{ width: 60, marginLeft: 8 }}
                        disabled={selectedItems[idx].widthMode === 'full'}
                      />
                    </label>
                  )}
                  <label style={{ display: 'block', margin: '8px 0' }}>
                    Height:
                    <input
                      type="number"
                      min="60"
                      max="400"
                      value={selectedItems[idx].height || defaultHeight}
                      onChange={e => handleSettingChange(idx, 'height', e.target.value)}
                      style={{ width: 60, marginLeft: 8 }}
                    />
                  </label>
                  <SpotifyEmbed
                    type={selectedItems[idx].type}
                    id={selectedItems[idx].id}
                    width={selectedItems[idx].widthMode === 'full' ? '100%' : (selectedItems[idx].width || defaultWidth)}
                    height={selectedItems[idx].height || defaultHeight}
                    theme={selectedItems[idx].theme || defaultTheme}
                  />
                  <button onClick={() => handleRemove(selectedItems[idx].id)} className="remove-btn">Remove</button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicSelector;
