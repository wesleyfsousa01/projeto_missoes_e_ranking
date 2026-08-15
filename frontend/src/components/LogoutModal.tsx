import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface border border-white/10 p-6 rounded-2xl shadow-xl max-w-sm w-full flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <LogOut className="w-6 h-6 ml-[-2px]" />
        </div>
        <h2 className="text-xl font-bold mb-2">Sair da conta</h2>
        <p className="text-white/60 text-sm mb-6">
          Tem certeza que deseja sair? Você precisará fazer login novamente para
          acessar sua conta.
        </p>
        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-500/20"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};
