"use client";

import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { POST } from "../api/auth/login/route";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
};

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

export default function EntrarPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const router = useRouter()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setApiError(null)
    setIsSubmitting(true)
  
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        setApiError(result.error ?? "E-mail ou senha incorretos")
        return
      }
  
      router.push("/acompanhe-se") 
    } catch {
      setApiError("Não foi possível conectar ao servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-form-column">
          <Brand />
          <div className="auth-heading">
            <p className="auth-context">Sua saúde, com mais clareza</p>
            <h1>
              Continue de onde
              <br />
              <em>você parou.</em>
            </h1>
            <p>
              Entre para acompanhar suas informações e conversar com o
              assistente SaúdeDela.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <label htmlFor="email">
              E-mail
              <input
                {...register("email")}
                id="email"
                name="email"
                type="email"
                placeholder="voce@email.com"
              />
            </label>
            <label htmlFor="password">
              Senha
              <div className="password-field">
                <input
                  {...register("password")}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                />
                <button type="button" aria-label="Mostrar senha">
                  Mostrar
                </button>
              </div>
            </label>
            <div className="auth-row">
              <span />
              <Link href="#recuperar">Esqueci minha senha</Link>
            </div>
            <button className="button-primary auth-submit" type="submit">
              Entrar
            </button>
          </form>
          <p className="auth-switch">
            Não tem conta? <Link href="/criar-conta">Criar conta</Link>
          </p>
        </div>
        <aside className="auth-panel" aria-label="Mensagem de confiança">
          <div className="auth-panel-mark">
            <PulseMark />
          </div>
          <p>Informação para você</p>
          <h2>
            Seu cuidado começa quando você consegue <em>entender.</em>
          </h2>
          <div className="auth-panel-note">
            <span>SaúdeDela</span>
            <strong>
              Baseada em evidências
              <br />
              Feita para mulheres
            </strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
