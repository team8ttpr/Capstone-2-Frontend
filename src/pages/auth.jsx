import React from "react";
import Login from "../components/Login";

const Auth = ({ setUser }) => {
  return (
    <>
      <Login setUser={setUser} />
    </>
  );
};

export default Auth;