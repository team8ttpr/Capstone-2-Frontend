import React from "react";
import MiniDrawer from '../components/MiniDrawer';
import UserListeningHistory from '../components/UserListeningHistory';
import TopGenresAndArtists from '../components/TopGenresAndArtists';
import RecommendationsOfTheDay from '../components/RecommendationsOfTheDay';

const Analytics = () => {
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
          <h1>{getGreeting()}!</h1>
          <p>This is what you recently listened to:</p>
        </div>
        <UserListeningHistory />
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <TopGenresAndArtists />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <RecommendationsOfTheDay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;