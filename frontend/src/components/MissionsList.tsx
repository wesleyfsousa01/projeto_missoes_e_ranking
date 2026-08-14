import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Mission, CompletedMission } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { CheckCircle, Target, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import confetti from "canvas-confetti";

export const MissionsList = () => {
  const { isAuthenticated, updateScore, logout } = useAuth();
  const navigate = useNavigate();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      try {
        const [missionsRes, completedRes] = await Promise.all([
          api.get<Mission[]>("/missions"),
          isAuthenticated
            ? api.get<CompletedMission[]>("/missions/completed")
            : Promise.resolve({ data: [] }),
        ]);

        setMissions(missionsRes.data);
        if (isAuthenticated) {
          const ids = new Set(completedRes.data.map((m) => m.missionId));
          setCompletedIds(ids);
        } else {
          setCompletedIds(new Set());
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
        } else {
          toast.error("Erro ao buscar missões disponíveis.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [isAuthenticated, logout]);

  const handleComplete = async (mission: Mission) => {
    if (!isAuthenticated) {
      toast("Faça login para completar missões!", {
        icon: <LogIn className="w-4 h-4" />,
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    if (completedIds.has(mission.id)) return;

    setLoadingIds((prev) => new Set(prev).add(mission.id));

    try {
      const response = await api.post(`/missions/${mission.id}/complete`);
      updateScore(response.data.currentScore);

      const nextSize = completedIds.has(mission.id)
        ? completedIds.size
        : completedIds.size + 1;

      setCompletedIds((prev) => new Set(prev).add(mission.id));

      if (nextSize === missions.length && missions.length > 0) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff1c1c", "#ffffff", "#ffaaaa"],
        });
        toast.success("Parabéns! Você concluiu TODAS as missões!", {
          icon: "🎉",
          duration: 5000,
        });
      } else {
        toast.success(
          `Missão "${mission.title}" concluída! +${mission.points} pts`,
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorType = error.response.data?.error;
        if (errorType === "MissionAlreadyCompletedError") {
          toast.error("Você já completou esta missão!");
          setCompletedIds((prev) => new Set(prev).add(mission.id)); // Sync state just in case
        } else {
          toast.error(
            error.response.data?.message || "Erro ao completar missão.",
          );
        }
      } else {
        toast.error("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(mission.id);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className="flex justify-center p-8">
          <span className="text-white/50 animate-pulse">
            Carregando missões...
          </span>
        </div>
      ) : missions.length === 0 ? (
        <div className="bg-surface rounded-2xl p-8 text-center border border-white/5 shadow-xl">
          <Target className="w-12 h-12 mx-auto text-white/20 mb-4" />
          <p className="text-white/50">Nenhuma missão disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missions.map((mission) => {
            const isCompleted = completedIds.has(mission.id);
            const isLoading = loadingIds.has(mission.id);

            return (
              <div
                key={mission.id}
                className={`bg-surface border p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-lg ${
                  isCompleted
                    ? "border-primary/20 opacity-80"
                    : "border-white/5 hover:border-white/10 hover:shadow-xl"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3
                      className={`text-lg font-bold ${isCompleted ? "text-primary" : "text-white"}`}
                    >
                      {mission.title}
                    </h3>
                    <span className="font-mono text-xs px-2 py-1 bg-background rounded border border-white/5 text-primary shrink-0">
                      {mission.points} pts
                    </span>
                  </div>
                  <p className="text-sm text-white/60 mb-6">
                    {mission.description}
                  </p>
                </div>

                <button
                  onClick={() => handleComplete(mission)}
                  disabled={isCompleted || isLoading}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isCompleted
                      ? "bg-primary/10 text-primary cursor-not-allowed border border-primary/20"
                      : "bg-primary hover:bg-primary/90 text-white hover:scale-[1.02]"
                  }`}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Processando...</span>
                  ) : isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Concluída
                    </>
                  ) : (
                    "Completar Missão"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
