import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { RankingPlayer } from "../types";
import { Trophy } from "lucide-react";

export const Ranking = () => {
  const [ranking, setRanking] = useState<RankingPlayer[]>([]);
  const [pingIndex, setPingIndex] = useState<number | null>(null);

  useEffect(() => {
    // Determine the WS URL (if using Vite proxy, we can just use the path, but io() needs standard hostname if no proxy is configured for WS)
    // We'll use the current host but with the /ranking namespace.
    // In production, NGINX routes /socket.io to the backend.
    const socket: Socket = io("/ranking", {
      path: "/socket.io", // default
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Conectado ao Ranking WS");
    });

    socket.on("ranking_update", (newRanking: RankingPlayer[]) => {
      setRanking((prevRanking) => {
        // Compare top player to trigger ping animation if changes
        if (
          prevRanking.length > 0 &&
          newRanking.length > 0 &&
          prevRanking[0].id !== newRanking[0].id
        ) {
          setPingIndex(0);
          setTimeout(() => setPingIndex(null), 1000);
        }
        return newRanking;
      });
    });

    socket.on("connect_error", (error) => {
      console.error("Erro no WebSocket:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-xl border border-white/5 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <Trophy className="text-primary w-6 h-6" />
        <h2 className="text-xl font-bold">Top Jogadores</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {ranking.length === 0 ? (
          <p className="text-white/50 text-center py-8">
            Nenhum jogador pontuou ainda.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {ranking.map((player, index) => (
              <li
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  index === 0
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-background border border-white/5"
                } ${pingIndex === index ? "animate-ping" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-black ${index === 0 ? "text-primary" : "text-white/30"}`}
                  >
                    #{index + 1}
                  </span>
                  <span className="font-medium truncate max-w-[120px] sm:max-w-[180px]">
                    {player.name}
                  </span>
                </div>
                <div className="font-mono text-sm bg-background px-2 py-1 rounded-md border border-white/5">
                  <span className="text-primary font-bold">{player.score}</span>{" "}
                  pts
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
