"use client";

import { useState } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

function PulseMark() {
  return (
    <span className="pulse-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M7 17h5l2.1-6 3.4 11 2.2-5H25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Brand() {
  return (
    <Link className="brand auth-brand" href="/">
      <PulseMark />
      <span>
        Saúde<span>Dela</span>
      </span>
    </Link>
  );
}

export default function CriarContaPage() {
  const router = useRouter();

  type Inputs = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setApiError(
          result.error?.fieldErrors
            ? "Verifique os campos"
            : (result.error ?? "Erro ao criar conta"),
        );
        return;
      }

      router.push("/entrar");
    } catch (err) {
      setApiError("Não foi possível conectar ao servidor");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-form-column">
          <Brand />
          <div className="auth-heading">
            <p className="auth-context">Um espaço só seu</p>
            <h1>
              Comece a cuidar
              <br />
              <em>de você.</em>
            </h1>
            <p>
              Crie sua conta para registrar sinais, acompanhar padrões e
              encontrar informação confiável.
            </p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">
              Nome
              <input
                {...register("name", {
                  required: "Digite seu nome",
                  minLength: { value: 2, message: "Nome muito curto" },
                })}
                id="name"
                type="text"
                placeholder="Como você gostaria de ser chamada?"
              />
            </label>

            <label htmlFor="email">
              E-mail
              <input
                {...register("email", {
                  required: "Digite seu e-mail",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "E-mail inválido",
                  },
                })}
                id="email"
                type="email"
                placeholder="voce@email.com"
              />
            </label>

            <label htmlFor="password">
              Senha
              <input
                {...register("password", {
                  required: "Crie uma senha",
                  minLength: { value: 8, message: "Mínimo de 8 caracteres" },
                })}
                id="password"
                type="password"
                placeholder="Crie uma senha"
              />
            </label>

            <label htmlFor="confirmPassword">
              Confirme sua senha
              <input
                {...register("confirmPassword", {
                  required: "Confirme sua senha",
                  validate: (value) =>
                    value === watch("password") || "As senhas não coincidem",
                })}
                id="confirmPassword"
                type="password"
                placeholder="Repita sua senha"
              />
            </label>

            <p className="privacy-note">
              <span aria-hidden="true">+</span> Seus dados de saúde ficam
              protegidos e pertencem somente a você.
            </p>
            <button
              className="button-primary auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
          <p className="auth-switch">
            Já tem conta? <Link href="/entrar">Entrar</Link>
          </p>
        </div>
        <aside className="auth-panel" aria-label="Mensagem de confiança">
          <div className="auth-panel-mark">
            <PulseMark />
          </div>
          <p>Um acompanhamento mais atento</p>
          <h2>
            Pequenos registros podem revelar <em>grandes padrões.</em>
          </h2>
          <div className="auth-panel-note">
            <span>SaúdeDela</span>
            <strong>
              Privacidade em primeiro lugar
              <br />
              Cuidado no seu ritmo
            </strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
