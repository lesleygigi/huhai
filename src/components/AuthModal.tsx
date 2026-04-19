import { useEffect, useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateVerificationCode,
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
  onRegisterStart: (email: string, password: string) => Promise<void>;
  onRegisterVerify: (verificationCode: string) => Promise<void>;
};

export function AuthModal({
  open,
  mode,
  configured,
  statusMessage,
  onClose,
  onSwitchMode,
  onLogin,
  onRegisterStart,
  onRegisterVerify,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setVerificationCode("");
      setAwaitingVerification(false);
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

    setSubmitting(true);
    setLocalError("");

    try {
      if (mode === "login") {
        const passwordError = validatePassword(password);
        if (passwordError) {
          setLocalError(passwordError);
          return;
        }
        await onLogin(email.trim(), password);
      } else {
        if (!awaitingVerification) {
          const passwordError = validatePassword(password);
          if (passwordError) {
            setLocalError(passwordError);
            return;
          }
          await onRegisterStart(email.trim(), password);
          setAwaitingVerification(true);
        } else {
          const verificationCodeError = validateVerificationCode(verificationCode);
          if (verificationCodeError) {
            setLocalError(verificationCodeError);
            return;
          }
          await onRegisterVerify(verificationCode.trim());
        }
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
            disabled={mode === "register" && awaitingVerification}
          />
        </label>

        {mode === "register" && awaitingVerification ? (
          <label className="settings-field auth-field">
            <span>邮箱验证码</span>
            <input
              type="text"
              value={verificationCode}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="输入邮箱收到的验证码"
              onChange={(event) => setVerificationCode(event.currentTarget.value)}
            />
          </label>
        ) : null}

        <p className="auth-help">
          {mode === "login"
            ? "使用已验证的邮箱和密码登录。"
            : awaitingVerification
              ? "验证码已发送到邮箱，请输入邮件中的验证码完成注册。"
              : "先填写邮箱和密码，提交后系统会向邮箱发送验证码。"}
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
                : awaitingVerification
                  ? "校验中…"
                  : "发送中…"
              : mode === "login"
                ? "登录"
                : awaitingVerification
                  ? "完成注册"
                  : "发送验证码"}
          </button>
        </div>
      </div>
    </section>
  );
}
