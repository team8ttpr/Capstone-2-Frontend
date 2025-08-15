// src/ws.js
import { io } from "socket.io-client";
import { API_URL } from "./shared";

// one shared connection for the whole app
export const socket = io(API_URL, {
  withCredentials: true, // send httpOnly cookie
  transports: ["websocket"], // optional, snappier
  // auth: { token }                // only if you pass a JWT manually
});
