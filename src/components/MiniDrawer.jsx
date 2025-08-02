import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/MiniDrawer.css';
import {
  ChevronLeft,
  ChevronRight,
  Analytics,
  MusicNote,
  Person,
  QueueMusic,
  Feed,
  People,
  Message,
  Notifications
} from '@mui/icons-material';

const dashboardMenuItems = [
  { text: 'Analytics', path: '/dashboard/analytics', icon: 'Analytics' },
  { text: 'Top Tracks', path: '/dashboard/toptracks', icon: 'MusicNote' },
  { text: 'Top Artist', path: '/dashboard/topartist', icon: 'Person' },
  { text: 'My Playlist', path: '/dashboard/myplaylist', icon: 'QueueMusic' }
];

const socialMenuItems = [
  { text: 'Feed', path: '/social/feed', icon: 'Feed' },
  { text: 'Friends', path: '/social/friends', icon: 'People' },
  { text: 'My Posts', path: '/social/mypost', icon: 'Message' },
  { text: 'Notifications', path: '/social/notifications', icon: 'Notifications' }
];

const iconComponents = {
  Analytics,
  MusicNote,
  Person,
  QueueMusic,
  Feed,
  People,
  Message,
  Notifications
};

export default function MiniDrawer({ menuType = 'dashboard' }) {
  const [open, setOpen] = useState(true);
  
  const menuItems = menuType === 'social' ? socialMenuItems : dashboardMenuItems;

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const getIcon = (iconName) => {
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent /> : <Analytics />;
  };

  return (
    <div className={`dashboard-drawer ${!open ? 'collapsed' : ''}`}>
      <div className={`dashboard-drawer-paper ${!open ? 'collapsed' : ''}`}>
        <div className="drawer-header">
          <button className="drawer-toggle-btn" onClick={handleDrawerToggle}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
        <hr className="sidebar-divider" />
        <ul className="sidebar-list">
          {menuItems.map((item, index) => (
            <li key={item.text} className="sidebar-list-item">
              <Link
                to={item.path}
                className={`sidebar-list-button ${!open ? 'collapsed' : ''}`}
              >
                <div className={`sidebar-list-icon ${!open ? 'collapsed' : ''}`}>
                  {getIcon(item.icon)}
                </div>
                <span className={`sidebar-list-text ${!open ? 'collapsed' : ''}`}>
                  {item.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
