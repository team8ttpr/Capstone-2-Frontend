import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/MiniDrawer.css';
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Mail
} from '@mui/icons-material';

const menuItems = [
  { text: 'Analytics', path: '/dashboard/analytics' },
  { text: 'Top Tracks', path: '/dashboard/toptracks' },
  { text: 'Top Artist', path: '/dashboard/topartist' },
  { text: 'My Playlist', path: '/dashboard/myplaylist' }
];

export default function MiniDrawer() {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
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
                  {index % 2 === 0 ? <Inbox /> : <Mail />}
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
