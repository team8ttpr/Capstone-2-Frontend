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
    gradient: 'linear-gradient(135deg, #BE3629 0%, #F94F49 50%, #FF8545 100%)',
    primary: '#BE3629',
    secondary: '#FF8545',
    cardBg: '#1a0f0d',
    infoBg: '#261712',
    textPrimary: '#FFBB67',
    textSecondary: '#DAB79D',
    statsBg: 'rgba(249, 79, 73, 0.15)',
    statsColor: '#F94F49',
    border: '#BE3629',
    postsBg: '#1f1410',
    buttonBg: '#F94F49',
    buttonHover: '#FF8545'
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
  bananaMilk: {
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
    gradient: 'linear-gradient(135deg, #ffe4d6 0%, #ffcab0 100%)',
    primary: '#ff9472',
    secondary: '#ffb899',
    cardBg: '#fffaf8',
    infoBg: '#fff2ed',
    textPrimary: '#8b2500',
    textSecondary: '#cc5500',
    statsBg: 'rgba(255, 148, 114, 0.1)',
    statsColor: '#ff9472',
    border: '#ffcab0',
    postsBg: '#fff2ed',
    buttonBg: '#ff9472',
    buttonHover: '#ffb899'
  },
  sky: {
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
    primary: '#81d4fa',
    secondary: '#4fc3f7',
    cardBg: '#f8fcff',
    infoBg: '#f0f9ff',
    textPrimary: '#0d47a1',
    textSecondary: '#1976d2',
    statsBg: 'rgba(129, 212, 250, 0.1)',
    statsColor: '#81d4fa',
    border: '#b3e5fc',
    postsBg: '#f0f9ff',
    buttonBg: '#81d4fa',
    buttonHover: '#4fc3f7'
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
    gradient: 'linear-gradient(135deg, #8b0000 0%, #b22222 100%)',
    primary: '#8b0000',
    secondary: '#a0001c',
    cardBg: '#1a0000',
    infoBg: '#2d0808',
    textPrimary: '#ffebeb',
    textSecondary: '#ff9999',
    statsBg: 'rgba(139, 0, 0, 0.2)',
    statsColor: '#cc3333',
    border: '#660000',
    postsBg: '#2d0808',
    buttonBg: '#8b0000',
    buttonHover: '#a0001c'
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
    gradient: 'linear-gradient(135deg, #000000 0%, #2c2c2c 100%)',
    primary: '#ffffff',
    secondary: '#f0f0f0',
    cardBg: '#0a0a0a',
    infoBg: '#1a1a1a',
    textPrimary: '#ffffff',
    textSecondary: '#cccccc',
    statsBg: 'rgba(255, 255, 255, 0.1)',
    statsColor: '#ffffff',
    border: '#404040',
    postsBg: '#141414',
    buttonBg: '#ffffff',
    buttonHover: '#e6e6e6'
  },
};

// Theme categories for better organization
export const themeCategories = {
  original: ['default', 'ocean', 'sunset', 'purple', 'forest', 'rose'],
  pastel: ['sakura', 'lavender', 'bananaMilk', 'mint', 'cotton', 'sky'],
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
    const response = await axios.get(`${API_URL}/api/profile/me`, {
      withCredentials: true
    });
    return response.data.profileTheme || 'default';
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
