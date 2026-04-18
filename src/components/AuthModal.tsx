import { useEffect, useState } from "react";
import {
  validateEmail,
  validatePassword,
} from "../engine/auth";

type AuthMode = "login" | "register";

type AuthModalProps = {
  open: boolean;
  mode: AuthMode;
  configured: boolean;
  statusMessage: string;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
};

export function AuthModal({
  open,
  mode,
  configured,
  statusMessage,
  onClose,
  onSwitchMode,
  onLogin,
  onRegister,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setSubmitting(false);
      setLocalError("");
    }
  }, [open, mode]);

  if (!open) {
    return null;
  }

  async function handleSubmit() {
    if (!configured) {
      setLocalError("尚未配置 CloudBase 环境 ID。");
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setLocalError(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setLocalError(passwordError);
      return;
    }

    setSubmitting(true);
    setLocalError("");

    try {
      if (mode === "login") {
        await onLogin(email.trim(), password);
      } else {
        await onRegister(email.trim(), password);
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="overlay-panel auth-panel" aria-label="账号登录">
      <header className="overlay-header">
        <div>
          <p className="eyebrow">账号</p>
          <h2>{mode === "login" ? "登录账号" : "注册账号"}</h2>
        </div>
        <button type="button" onClick={onClose}>
          关闭
        </button>
      </header>

      <div className="auth-panel-body">
        <div className="auth-tabs" role="tablist" aria-label="认证方式">
          <button
            type="button"
            className={mode === "login" ? "auth-tab is-active" : "auth-tab"}
            onClick={() => onSwitchMode("login")}
          >
            登录
          </button>
          <button
            type="button"
            className={mode === "register" ? "auth-tab is-active" : "auth-tab"}
            onClick={() => onSwitchMode("register")}
          >
            注册
          </button>
        </div>

        <label className="settings-field auth-field">
          <span>邮箱</span>
          <input
            type="email"
            value={email}
            autoComplete="email"
            placeholder="name@example.com"
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </label>

        <label className="settings-field auth-field">
          <span>密码</span>
          <input
            type="password"
            value={password}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="至少 8 位，需包含字母和数字"
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </label>

        <p className="auth-help">
          {mode === "login"
            ? "使用已验证的邮箱和密码登录。"
            : "注册后 CloudBase 会发送验证邮件，完成验证后再登录。"}
        </p>

        {localError ? <p className="auth-error">{localError}</p> : null}
        {!localError && statusMessage ? (
          <p className="auth-status">{statusMessage}</p>
        ) : null}

        <div className="auth-actions">
          <button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting
              ? mode === "login"
                ? "登录中…"
                : "注册中…"
              : mode === "login"
                ? "登录"
                : "注册"}
          </button>
        </div>
      </div>
    </section>
  );
}
