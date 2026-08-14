import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/Input";
import axios from "axios";

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side basic validation
    let hasError = false;
    const newErrors: typeof errors = {};
    if (!name) {
      newErrors.name = "O nome é obrigatório.";
      hasError = true;
    }
    if (!email) {
      newErrors.email = "O e-mail é obrigatório.";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "A senha é obrigatória.";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      // Auto-login after registration
      login(response.data.access_token, response.data.player);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { message, error: errorType } = error.response.data;

        if (errorType === "EmailAlreadyExistsError") {
          setErrors({ email: message || "E-mail já cadastrado." });
        } else if (Array.isArray(message)) {
          // NestJS validation array
          const formErrors: typeof errors = {};
          message.forEach((msg: string) => {
            if (
              msg.toLowerCase().includes("nome") ||
              msg.toLowerCase().includes("name")
            ) {
              formErrors.name = msg;
            } else if (
              msg.toLowerCase().includes("e-mail") ||
              msg.toLowerCase().includes("email")
            ) {
              formErrors.email = msg;
            } else if (
              msg.toLowerCase().includes("senha") ||
              msg.toLowerCase().includes("password")
            ) {
              formErrors.password = msg;
            } else {
              formErrors.general = msg;
            }
          });
          setErrors(formErrors);
        } else {
          setErrors({ general: message || "Erro ao realizar cadastro." });
        }
      } else {
        setErrors({ general: "Erro inesperado. Tente novamente mais tarde." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm p-6 bg-surface border border-white/5 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Criar Conta</h1>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-sm text-red-500 text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="Seu nome"
          />
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="seu@email.com"
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="••••••"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar e Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};
