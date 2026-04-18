import { getCloudbaseAuth, isCloudbaseConfigured } from "../lib/cloudbase";

export type AuthUser = {
  uid: string;
  email: string;
  username?: string;
};

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
): Promise<void> {
  await getCloudbaseAuth().signUpWithEmailAndPassword(email, password);
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<AuthUser | null> {
  await getCloudbaseAuth().signInWithEmailAndPassword(email, password);
  return getCurrentAuthUser();
}

export async function signOutAuth(): Promise<void> {
  await getCloudbaseAuth().signOut();
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
