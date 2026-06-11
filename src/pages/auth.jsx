import React from "react";
import Login from "../components/Login";

const Auth = ({ setUser, onGuest }) => {
  return (
    <>
      <Login setUser={setUser} onGuest={onGuest} />
    </>
  );
};

export default Auth;