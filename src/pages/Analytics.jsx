import React from "react";
import MiniDrawer from '../components/MiniDrawer';
import UserListeningHistory from '../components/UserListeningHistory';
import TopGenresAndArtists from '../components/TopGenresAndArtists';
import RecommendationsOfTheDay from '../components/RecommendationsOfTheDay';
import DemoBanner from '../components/DemoBanner';

const Analytics = ({ demo = false }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="dashboard-layout">
      <MiniDrawer />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1db954', marginBottom: '1.2rem', textShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>{getGreeting()}!</h1>
        </div>
        {demo && <DemoBanner feature="listening stats" />}
        <UserListeningHistory demo={demo} />
        <div className="dash-split" style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', flexWrap: 'wrap', minHeight: '0' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <TopGenresAndArtists demo={demo} />
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <RecommendationsOfTheDay demo={demo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;