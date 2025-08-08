// Theme management utility with React hooks for backend-only theme persistence
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../shared';

// color themes settings, 
export const colorThemes = {
  default: {
    gradient: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)',
    primary: '#1db954',
    secondary: '#1ed760',
    cardBg: '#1e1e1e',
    infoBg: '#2a2a2a',
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3',
    statsBg: 'rgba(29, 185, 84, 0.1)',
    statsColor: '#1db954',
    border: '#333333',
    postsBg: '#2a2a2a',
    buttonBg: '#1db954',
    buttonHover: '#1ed760'
  },
  ocean: {
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    primary: '#1e3c72',
    secondary: '#2a5298',
    cardBg: '#0f1419',
    infoBg: '#1a2332',
    textPrimary: '#e1f5fe',
    textSecondary: '#81d4fa',
    statsBg: 'rgba(30, 60, 114, 0.15)',
    statsColor: '#2a5298',
    border: '#1e3c72',
    postsBg: '#1a2332',
    buttonBg: '#2a5298',
    buttonHover: '#1e3c72'
  },
  sunset: {
    gradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
    primary: '#ff7e5f',
    secondary: '#feb47b',
    cardBg: '#2d1b1b',
    infoBg: '#3d2626',
    textPrimary: '#fff8e1',
    textSecondary: '#ffcc80',
    statsBg: 'rgba(255, 126, 95, 0.15)',
    statsColor: '#ff7e5f',
    border: '#ff7e5f',
    postsBg: '#3d2626',
    buttonBg: '#ff7e5f',
    buttonHover: '#feb47b'
  },
  purple: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primary: '#667eea',
    secondary: '#764ba2',
    cardBg: '#1a1625',
    infoBg: '#2d2438',
    textPrimary: '#f3e5f5',
    textSecondary: '#ce93d8',
    statsBg: 'rgba(102, 126, 234, 0.15)',
    statsColor: '#667eea',
    border: '#667eea',
    postsBg: '#2d2438',
    buttonBg: '#667eea',
    buttonHover: '#764ba2'
  },
  forest: {
    gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    primary: '#134e5e',
    secondary: '#71b280',
    cardBg: '#0d1f1a',
    infoBg: '#1a3329',
    textPrimary: '#e8f5e8',
    textSecondary: '#a5d6a7',
    statsBg: 'rgba(19, 78, 94, 0.15)',
    statsColor: '#71b280',
    border: '#134e5e',
    postsBg: '#1a3329',
    buttonBg: '#71b280',
    buttonHover: '#134e5e'
  },
  rose: {
    gradient: 'linear-gradient(135deg, #ad5389 0%, #3c1053 100%)',
    primary: '#ad5389',
    secondary: '#3c1053',
    cardBg: '#1a0d1a',
    infoBg: '#2d1b2d',
    textPrimary: '#fce4ec',
    textSecondary: '#f8bbd9',
    statsBg: 'rgba(173, 83, 137, 0.15)',
    statsColor: '#ad5389',
    border: '#ad5389',
    postsBg: '#2d1b2d',
    buttonBg: '#ad5389',
    buttonHover: '#3c1053'
  },
  sakura: {
    gradient: 'linear-gradient(135deg, #ffe4e6 0%, #ffccd5 100%)',
    primary: '#ff7a9a',
    secondary: '#ffb3c6',
    cardBg: '#fff5f7',
    infoBg: '#ffeef1',
    textPrimary: '#5a1a3a',
    textSecondary: '#8b2655',
    statsBg: 'rgba(255, 122, 154, 0.1)',
    statsColor: '#ff7a9a',
    border: '#ffe0e6',
    postsBg: '#ffeef1',
    buttonBg: '#ff7a9a',
    buttonHover: '#ffb3c6'
  },
  lavender: {
    gradient: 'linear-gradient(135deg, #e6e6fa 0%, #ddd6fe 100%)',
    primary: '#9f7aea',
    secondary: '#b794f6',
    cardBg: '#faf9ff',
    infoBg: '#f3f1ff',
    textPrimary: '#2d1b69',
    textSecondary: '#553c9a',
    statsBg: 'rgba(159, 122, 234, 0.1)',
    statsColor: '#9f7aea',
    border: '#e9e7ff',
    postsBg: '#f3f1ff',
    buttonBg: '#9f7aea',
    buttonHover: '#b794f6'
  },
  peach: {
    gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
    primary: '#e17055',
    secondary: '#fab1a0',
    cardBg: '#fffbf0',
    infoBg: '#fff4e6',
    textPrimary: '#5a2d0c',
    textSecondary: '#8b4513',
    statsBg: 'rgba(225, 112, 85, 0.1)',
    statsColor: '#e17055',
    border: '#ffecd1',
    postsBg: '#fff4e6',
    buttonBg: '#e17055',
    buttonHover: '#fab1a0'
  },
  mint: {
    gradient: 'linear-gradient(135deg, #d4f5e9 0%, #a7f3d0 100%)',
    primary: '#34d399',
    secondary: '#6ee7b7',
    cardBg: '#f0fdf9',
    infoBg: '#ecfef5',
    textPrimary: '#064e3b',
    textSecondary: '#166534',
    statsBg: 'rgba(52, 211, 153, 0.1)',
    statsColor: '#34d399',
    border: '#d1fae5',
    postsBg: '#ecfef5',
    buttonBg: '#34d399',
    buttonHover: '#6ee7b7'
  },
  cotton: {
    gradient: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
    primary: '#c4b5fd',
    secondary: '#ddd6fe',
    cardBg: '#2a2438',
    infoBg: '#352e47',
    textPrimary: '#faf5ff',
    textSecondary: '#e9d5ff',
    statsBg: 'rgba(196, 181, 253, 0.15)',
    statsColor: '#c4b5fd',
    border: '#c4b5fd',
    postsBg: '#352e47',
    buttonBg: '#c4b5fd',
    buttonHover: '#ddd6fe'
  },
  sky: {
    gradient: 'linear-gradient(135deg, #bae6fd 0%, #7dd3fc 100%)',
    primary: '#7dd3fc',
    secondary: '#bae6fd',
    cardBg: '#1e293b',
    infoBg: '#334155',
    textPrimary: '#f0f9ff',
    textSecondary: '#bae6fd',
    statsBg: 'rgba(125, 211, 252, 0.15)',
    statsColor: '#7dd3fc',
    border: '#7dd3fc',
    postsBg: '#334155',
    buttonBg: '#7dd3fc',
    buttonHover: '#bae6fd'
  },
  shadow: {
    gradient: 'linear-gradient(135deg, #1f2937 0%, #4b5563 100%)',
    primary: '#6b7280',
    secondary: '#9ca3af',
    cardBg: '#0f172a',
    infoBg: '#1e293b',
    textPrimary: '#f1f5f9',
    textSecondary: '#cbd5e1',
    statsBg: 'rgba(107, 114, 128, 0.15)',
    statsColor: '#9ca3af',
    border: '#374151',
    postsBg: '#1e293b',
    buttonBg: '#6b7280',
    buttonHover: '#9ca3af'
  },
  crimson: {
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    primary: '#dc2626',
    secondary: '#ef4444',
    cardBg: '#1f1315',
    infoBg: '#2a1a1d',
    textPrimary: '#fef2f2',
    textSecondary: '#fca5a5',
    statsBg: 'rgba(220, 38, 38, 0.15)',
    statsColor: '#dc2626',
    border: '#dc2626',
    postsBg: '#2a1a1d',
    buttonBg: '#dc2626',
    buttonHover: '#ef4444'
  },
  neon: {
    gradient: 'linear-gradient(135deg, #ff0080 0%, #00ffff 100%)',
    primary: '#ff0080',
    secondary: '#00ffff',
    cardBg: '#0f0f1a',
    infoBg: '#1a1a2e',
    textPrimary: '#ffffff',
    textSecondary: '#ccffff',
    statsBg: 'rgba(255, 0, 128, 0.15)',
    statsColor: '#00ffff',
    border: '#ff0080',
    postsBg: '#0f0f1a',
    buttonBg: '#ff0080',
    buttonHover: '#00ffff'
  },
  void: {
    gradient: 'linear-gradient(135deg, #1a0033 0%, #330066 100%)',
    primary: '#6600cc',
    secondary: '#9933ff',
    cardBg: '#0a0015',
    infoBg: '#150029',
    textPrimary: '#e6ccff',
    textSecondary: '#ccb3ff',
    statsBg: 'rgba(102, 0, 204, 0.15)',
    statsColor: '#9933ff',
    border: '#330066',
    postsBg: '#150029',
    buttonBg: '#6600cc',
    buttonHover: '#9933ff'
  },
  electric: {
    gradient: 'linear-gradient(135deg, #001a33 0%, #0066ff 100%)',
    primary: '#0099ff',
    secondary: '#0066ff',
    cardBg: '#000d1a',
    infoBg: '#001122',
    textPrimary: '#e6f7ff',
    textSecondary: '#b3e0ff',
    statsBg: 'rgba(0, 153, 255, 0.15)',
    statsColor: '#0066ff',
    border: '#0099ff',
    postsBg: '#001122',
    buttonBg: '#0099ff',
    buttonHover: '#0066ff'
  }
};

// Theme categories for better organization
export const themeCategories = {
  original: ['default', 'ocean', 'sunset', 'purple', 'forest', 'rose'],
  pastel: ['sakura', 'lavender', 'peach', 'mint', 'cotton', 'sky'],
  dark: ['shadow', 'crimson', 'neon', 'void', 'electric']
};

// Helper function to get theme by id
export const getTheme = (themeId) => {
  return colorThemes[themeId] || colorThemes.default;
};

// save theme to backend 
export const saveThemeToServer = async (theme) => {
  try {
    const currentUserResponse = await axios.get(`${API_URL}/api/profile/me`, {
      withCredentials: true
    });
    const currentUser = currentUserResponse.data;
    
    const response = await axios.patch(`${API_URL}/api/profile/me`, { 
      profileTheme: theme,
      firstName: currentUser.firstName || null,
      lastName: currentUser.lastName || null,
      bio: currentUser.bio || null,
      profileImage: currentUser.profileImage || null
    }, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });
    
    return {
      success: true,
      theme: response.data.profileTheme
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to save theme'
    };
  }
};

// Load theme from server
export const loadThemeFromServer = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/profile/me/theme`, {
      withCredentials: true
    });
    return response.data.theme || 'default';
  } catch (error) {
    return 'default';
  }
};

// React hook for theme management
export const useThemeManager = (user = null) => {
  const [theme, setTheme] = useState('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTheme = useCallback(async () => {
    if (!user) return 'default';
    
    try {
      setLoading(true);
      setError(null);
      const savedTheme = await loadThemeFromServer();
      setTheme(savedTheme);
      return savedTheme;
    } catch (err) {
      setError(err.message);
      setTheme('default');
      return 'default';
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveTheme = useCallback(async (newTheme) => {
    try {
      setLoading(true);
      setError(null);
      setTheme(newTheme); // update UI immediately
      
      const result = await saveThemeToServer(newTheme);
      if (!result.success) setError(result.error);
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  return {
    theme,
    setTheme,
    saveTheme,
    loadTheme,
    loading,
    error,
    clearError: () => setError(null)
  };
};

// functions for backward compatibility
export const saveTheme = async (theme) => {
  const result = await saveThemeToServer(theme);
  return {
    success: result.success,
    serverError: result.error,
    theme: result.theme || theme
  };
};

export const loadTheme = async () => {
  return await loadThemeFromServer();
};

export const loadUserTheme = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/api/profile/${username}`, {
      withCredentials: true
    });
    return response.data.profileTheme || 'default';
  } catch (error) {
    return 'default';
  }
};
