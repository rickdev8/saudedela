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
    age: number;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          age: data.age,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorCode = result.code ?? result.error?.code;

        if (errorCode === "EMAIL_IN_USE" || result.error === "EMAIL_IN_USE") {
          setApiError("EMAIL_IN_USE");
          return;
        }

        setApiError(
          result.error?.fieldErrors
            ? "Verifique os campos"
            : (result.message ?? result.error ?? "Erro ao criar conta"),
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
                maxLength={100}
                type="text"
                placeholder="Como você gostaria de ser chamada?"
              />
            </label>

            <label htmlFor="age">
              Idade
              <input
                {...register("age", {
                  required: "Digite sua idade",
                  valueAsNumber: true,
                  min: { value: 13, message: "A idade mínima é 13 anos" },
                  max: { value: 120, message: "Digite uma idade válida" },
                })}
                id="age"
                maxLength={3}
                type="number"
                min="13"
                max="120"
                inputMode="numeric"
                placeholder="Ex.: 28"
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
                maxLength={254}
                type="email"
                placeholder="voce@email.com"
              />
            </label>

            <label htmlFor="password">
              Senha
              <div className="password-field">
                <input
                  {...register("password", {
                    required: "Crie uma senha",
                    minLength: { value: 8, message: "Mínimo de 8 caracteres" },
                  })}
                  id="password"
                  maxLength={128}
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </label>

            <label htmlFor="confirmPassword">
              Confirme sua senha
              <div className="password-field">
                <input
                  {...register("confirmPassword", {
                    required: "Confirme sua senha",
                    validate: (value) =>
                      value === watch("password") || "As senhas não coincidem",
                  })}
                  id="confirmPassword"
                  maxLength={128}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repita sua senha"
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                  aria-pressed={showConfirmPassword}
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                >
                  {showConfirmPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </label>

            <p className="privacy-note">
              <span aria-hidden="true">+</span> Seus dados de saúde ficam
              protegidos e pertencem somente a você.
            </p>
            <button
              className="button-primary auth-submit"
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting && (
                <span className="auth-spinner" aria-hidden="true" />
              )}
              <span>{isSubmitting ? "Criando conta..." : "Criar conta"}</span>
            </button>
            {apiError && (
  <div
    className={`auth-alert ${
      apiError === "EMAIL_IN_USE" ? "auth-alert-email" : ""
    }`}
    role="alert"
    aria-live="polite"
  >
    <span className="auth-alert-icon" aria-hidden="true">
      !
    </span>

    <div className="auth-alert-content">
      <strong>
        {apiError === "EMAIL_IN_USE"
          ? "Este e-mail já está cadastrado"
          : "Não foi possível criar sua conta"}
      </strong>

      <p>
        {apiError === "EMAIL_IN_USE"
          ? "Você já tem uma conta com este e-mail. Entre nela ou utilize outro endereço."
          : apiError}
      </p>

      {apiError === "EMAIL_IN_USE" && (
        <Link href="/entrar" className="auth-alert-link">
          Ir para entrar →
        </Link>
      )}
    </div>
  </div>
)}
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
