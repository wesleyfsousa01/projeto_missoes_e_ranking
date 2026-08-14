import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
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

  const login = useCallback((token: string, newPlayer: Player) => {
    localStorage.setItem("@MissoesRanking:token", token);
    localStorage.setItem("@MissoesRanking:player", JSON.stringify(newPlayer));
    setPlayer(newPlayer);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("@MissoesRanking:token");
    localStorage.removeItem("@MissoesRanking:player");
    setPlayer(null);
  }, []);

  const updateScore = useCallback((newScore: number) => {
    setPlayer((prev) => {
      if (prev) {
        const updatedPlayer = { ...prev, score: newScore };
        localStorage.setItem(
          "@MissoesRanking:player",
          JSON.stringify(updatedPlayer),
        );
        return updatedPlayer;
      }
      return prev;
    });
  }, []);

  const value = useMemo(
    () => ({
      player,
      isAuthenticated: !!player,
      login,
      logout,
      updateScore,
    }),
    [player, login, logout, updateScore],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
