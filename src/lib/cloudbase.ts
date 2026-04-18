import cloudbase from "@cloudbase/js-sdk";

const cloudbaseEnvId = import.meta.env.VITE_CLOUDBASE_ENV_ID?.trim() ?? "";

let appInstance: ReturnType<typeof cloudbase.init> | null = null;
let authInstance: ReturnType<ReturnType<typeof cloudbase.init>["auth"]> | null = null;
let databaseInstance: ReturnType<ReturnType<typeof cloudbase.init>["database"]> | null = null;

function getRequiredEnvId(): string {
  if (!cloudbaseEnvId) {
    throw new Error("缺少 CloudBase 环境 ID，请配置 VITE_CLOUDBASE_ENV_ID。");
  }

  return cloudbaseEnvId;
}

export function getCloudbaseEnvId(): string {
  return cloudbaseEnvId;
}

export function isCloudbaseConfigured(): boolean {
  return cloudbaseEnvId.length > 0;
}

export function getCloudbaseApp() {
  if (!appInstance) {
    appInstance = cloudbase.init({
      env: getRequiredEnvId(),
    });
  }

  return appInstance;
}

export function getCloudbaseAuth() {
  if (!authInstance) {
    authInstance = getCloudbaseApp().auth();
  }

  return authInstance;
}

export function getCloudbaseDatabase() {
  if (!databaseInstance) {
    databaseInstance = getCloudbaseApp().database();
  }

  return databaseInstance;
}
