import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import type { RankingPlayer } from "../types";
import { Trophy, Crown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const Ranking = () => {
  const { player: currentUser } = useAuth();
  const [ranking, setRanking] = useState<RankingPlayer[]>([]);

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
      setRanking(newRanking);
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
          <ul className="flex flex-col gap-3 relative pt-1">
            <AnimatePresence>
              {ranking.map((player, index) => {
                const isCurrentUser = currentUser?.id === player.id;
                const isTop1 = index === 0 && player.score > 0;

                return (
                  <motion.li
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      layout: { type: "spring", bounce: 0.2, duration: 0.5 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },
                    }}
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      isTop1
                        ? "bg-yellow-400/10 border border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                        : isCurrentUser
                          ? "bg-primary/20 border border-primary/50 shadow-[0_0_15px_rgba(255,28,28,0.2)]"
                          : "bg-background border border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-black ${
                          isTop1
                            ? "text-yellow-400"
                            : isCurrentUser
                              ? "text-primary"
                              : "text-white/30"
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <span
                        className={`font-medium flex items-center gap-2 truncate max-w-[120px] sm:max-w-[150px] ${
                          isCurrentUser ? "text-white font-bold" : ""
                        }`}
                      >
                        {player.name}
                        {isTop1 && (
                          <Crown className="w-4 h-4 text-yellow-400" />
                        )}
                        {isCurrentUser && !isTop1 && (
                          <span className="text-xs text-primary/80 ml-1">
                            (Você)
                          </span>
                        )}
                        {isCurrentUser && isTop1 && (
                          <span className="text-xs text-yellow-400/80 ml-1">
                            (Você)
                          </span>
                        )}
                      </span>
                    </div>
                    <div
                      className={`font-mono text-sm px-2 py-1 rounded-md border ${
                        isTop1
                          ? "bg-yellow-400/20 border-yellow-400/30"
                          : "bg-background border-white/5"
                      }`}
                    >
                      <span
                        className={`font-bold ${isTop1 ? "text-yellow-400" : "text-primary"}`}
                      >
                        {player.score}
                      </span>{" "}
                      <span
                        className={
                          isTop1 ? "text-yellow-400/80" : "text-white/50"
                        }
                      >
                        pts
                      </span>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
};
