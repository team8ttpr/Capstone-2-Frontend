import React, { useState } from 'react';
import { Palette, Check } from '@mui/icons-material';
import { colorThemes, themeCategories } from '../utils/themeManager';
import '../style/ColorThemeSelector.css';

const ColorThemeSelector = ({ currentTheme, onThemeChange, isOpen, onToggle, hideToggleButton = false }) => {
  const formatThemeName = (themeId) => {
    return themeId.charAt(0).toUpperCase() + themeId.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const themesByCategory = Object.entries(themeCategories).map(([category, themeIds]) => ({
    category,
    categoryName: formatCategoryName(category),
    themes: themeIds.map(themeId => ({
      id: themeId,
      name: formatThemeName(themeId),
      gradient: colorThemes[themeId].gradient
    }))
  }));

  return (
    <div className="color-theme-selector">
      {!hideToggleButton && (
        <button 
          className="theme-toggle-btn"
          onClick={onToggle}
          title="Change profile theme"
        >
          <Palette />
          Theme
        </button>
      )}
      
      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-dropdown-header">
            <h3>Choose Profile Theme</h3>
          </div>
          <div className="theme-categories">
            {themesByCategory.map((category) => (
              <div key={category.category} className="theme-category">
                <h4 className="category-title">{category.categoryName}</h4>
                <div className="theme-options">
                  {category.themes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                      onClick={() => onThemeChange(theme.id)}
                    >
                      <div 
                        className="theme-preview"
                        style={{ background: theme.gradient }}
                      >
                        {currentTheme === theme.id && (
                          <Check className="theme-check" />
                        )}
                      </div>
                      <span className="theme-name">{theme.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorThemeSelector;
