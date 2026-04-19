import { getCloudbaseAuth, isCloudbaseConfigured } from "../lib/cloudbase";

export type AuthUser = {
  uid: string;
  email: string;
  username?: string;
};

export type PendingEmailSignUp = {
  email: string;
  verifyOtp: (params: { token: string; messageId?: string }) => Promise<unknown>;
};

type CloudbaseAuthErrorLike = {
  category?: string;
  code?: string;
  message?: string;
  helpMessage?: string;
};

function normalizeAuthErrorMessage(error: CloudbaseAuthErrorLike | null | undefined): string {
  if (!error) {
    return "认证失败，请稍后重试。";
  }

  const code = error.code ?? "";

  if (code === "invalid_username_or_password" || code === "wrong_password") {
    return "邮箱或密码错误。";
  }

  if (code === "user_not_found" || code === "not_found") {
    return "账号不存在，请先注册。";
  }

  if (code === "invalid_password") {
    return "密码错误。";
  }

  if (error.category === "provider_not_enabled" || code === "login_method_disabled") {
    return "当前环境未开启邮箱密码登录。";
  }

  if (error.category === "user_pending") {
    return "账号尚未完成验证，请先完成邮箱验证。";
  }

  return error.message || error.helpMessage || "认证失败，请稍后重试。";
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error) {
    return error;
  }

  if (error && typeof error === "object") {
    const authError = error as CloudbaseAuthErrorLike;
    const normalized = normalizeAuthErrorMessage(authError);
    if (normalized) {
      return normalized;
    }
  }

  return fallback;
}

function normalizeAuthUser(user: {
  uid?: string;
  email?: string;
  username?: string;
} | null): AuthUser | null {
  if (!user?.uid || !user.email) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
    username: user.username,
  };
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  if (!isCloudbaseConfigured()) {
    return null;
  }

  const user = await getCloudbaseAuth().getCurrentUser();
  return normalizeAuthUser(user);
}

export async function signUpWithEmailAndPassword(
  email: string,
  password: string
): Promise<PendingEmailSignUp> {
  const result = await getCloudbaseAuth().signUp({
    email,
    password,
  });

  const error = result?.error;
  if (error) {
    throw new Error(normalizeAuthErrorMessage(error));
  }

  const verifyOtp = result?.data?.verifyOtp;
  if (typeof verifyOtp !== "function") {
    throw new Error("CloudBase 未返回验证码校验函数。");
  }

  return {
    email,
    verifyOtp,
  };
}

export async function verifyEmailSignUpCode(
  pending: PendingEmailSignUp,
  verificationCode: string
): Promise<AuthUser | null> {
  await pending.verifyOtp({
    token: verificationCode,
  });

  return getCurrentAuthUser();
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<AuthUser | null> {
  try {
    const result = await getCloudbaseAuth().signInWithPassword({
      email,
      password,
    });

    if (result?.error) {
      throw new Error(normalizeAuthErrorMessage(result.error));
    }

    const user = normalizeAuthUser(result?.data?.user ?? null);
    if (user) {
      return user;
    }

    return getCurrentAuthUser();
  } catch (error) {
    throw new Error(toErrorMessage(error, "登录失败，请稍后重试。"));
  }
}

export async function signOutAuth(): Promise<void> {
  try {
    await getCloudbaseAuth().signOut();
  } catch (error) {
    throw new Error(toErrorMessage(error, "退出登录失败。"));
  }
}

export function validateEmail(email: string): string | null {
  const normalized = email.trim();

  if (!normalized) {
    return "请输入邮箱地址。";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return "邮箱格式不正确。";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "请输入密码。";
  }

  if (password.length < 8 || password.length > 32) {
    return "密码长度需在 8 到 32 位之间。";
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "密码需同时包含字母和数字。";
  }

  return null;
}

export function validateVerificationCode(code: string): string | null {
  const normalized = code.trim();

  if (!normalized) {
    return "请输入邮箱验证码。";
  }

  if (!/^\d{4,8}$/.test(normalized)) {
    return "验证码格式不正确。";
  }

  return null;
}
