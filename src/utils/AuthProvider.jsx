// src/utils/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/profile/me", { credentials: "include" });
        if (!alive) return;
        if (res.ok) {
          const me = await res.json();
          setUser(me);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}
