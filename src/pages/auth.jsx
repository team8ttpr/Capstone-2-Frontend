import React from "react";
import Login from "../components/Login";

const Auth = ({ setUser }) => {
  return (
    <>
      <h1>This page is for the log in form and demo panel</h1>
      <Login setUser={setUser} />
    </>
  );
};

export default Auth;