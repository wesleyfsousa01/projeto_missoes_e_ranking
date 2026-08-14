import React, { createContext, useContext, useState } from "react";
import type { Player } from "../types";

interface AuthContextData {
  player: Player | null;
  isAuthenticated: boolean;
  login: (token: string, player: Player) => void;
  logout: () => void;
  updateScore: (newScore: number) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player, setPlayer] = useState<Player | null>(() => {
    const storedToken = localStorage.getItem("@MissoesRanking:token");
    const storedPlayer = localStorage.getItem("@MissoesRanking:player");

    if (storedToken && storedPlayer) {
      try {
        return JSON.parse(storedPlayer);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (token: string, player: Player) => {
    localStorage.setItem("@MissoesRanking:token", token);
    localStorage.setItem("@MissoesRanking:player", JSON.stringify(player));
    setPlayer(player);
  };

  const logout = () => {
    localStorage.removeItem("@MissoesRanking:token");
    localStorage.removeItem("@MissoesRanking:player");
    setPlayer(null);
  };

  const updateScore = (newScore: number) => {
    if (player) {
      const updatedPlayer = { ...player, score: newScore };
      setPlayer(updatedPlayer);
      localStorage.setItem(
        "@MissoesRanking:player",
        JSON.stringify(updatedPlayer),
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{ player, isAuthenticated: !!player, login, logout, updateScore }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
