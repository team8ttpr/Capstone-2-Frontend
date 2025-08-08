import React from "react";
import MiniDrawer from "../components/MiniDrawer";

const Friends = () => {
  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>Friends</h1>
          <p>
            This is the page for user's follower/following lists and add
            Friends.
          </p>

          {/* Basic Table */}
          <table
            border="1"
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
                <th>Column 4</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, index) => (
                <tr key={index}>
                  <td>Row {index + 1} - Col 1</td>
                  <td>Row {index + 1} - Col 2</td>
                  <td>Row {index + 1} - Col 3</td>
                  <td>Row {index + 1} - Col 4</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Friends;
