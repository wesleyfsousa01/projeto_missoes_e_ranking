import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { LogoutModal } from "./LogoutModal";

export const Header = () => {
  const { player, isAuthenticated, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <header className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mb-8 border-b border-white/5">
      <Link
        to="/"
        className="group flex flex-col hover:opacity-80 transition-opacity"
      >
        <h1 className="text-3xl font-black text-primary tracking-tighter">
          MISSÕES & RANKING
        </h1>
        <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
          O desafio gamificado.
        </p>
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated && player ? (
          <div className="flex items-center gap-6 bg-surface px-4 py-2 rounded-full border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold truncate max-w-[100px]">
                  {player.name}
                </span>
                <span className="text-xs text-primary font-mono">
                  {player.score} pts
                </span>
              </div>
            </div>
            <div className="w-[1px] h-6 bg-white/10"></div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-white/50 hover:text-red-500 transition-colors p-1"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-white hover:text-primary transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-bold bg-primary hover:bg-primary/90 rounded-full transition-colors"
            >
              Cadastrar
            </Link>
          </div>
        )}
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logout();
        }}
      />
    </header>
  );
};
