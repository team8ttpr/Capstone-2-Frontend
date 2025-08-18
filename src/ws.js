import { createContext } from "react";
import { io } from "socket.io-client";
import { API_URL } from "./shared";

export const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: true,
});

export const PresenceContext = createContext({
  online: new Set(),
  setOnline: () => {},
  socket,
});