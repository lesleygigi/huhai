import type { AuthUser } from "../engine/auth";

type AccountPanelProps = {
  configured: boolean;
  authReady: boolean;
  currentUser: AuthUser | null;
  statusMessage: string;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onSignOut: () => void;
};

export function AccountPanel({
  configured,
  authReady,
  currentUser,
  statusMessage,
  onOpenLogin,
  onOpenRegister,
  onSignOut,
}: AccountPanelProps) {
  return (
    <section className="account-panel" aria-label="账号状态">
      <div className="account-panel-header">
        <p className="eyebrow">账号</p>
        <strong>
          {currentUser ? currentUser.email : configured ? "未登录" : "未配置"}
        </strong>
      </div>

      <p className="account-panel-status">
        {configured
          ? authReady
            ? currentUser
              ? "已恢复登录状态，可在后续步骤接入云存档。"
              : "登录后可启用云存档。"
            : "正在恢复登录状态……"
          : "尚未配置 CloudBase 环境 ID，当前只能使用本地存档。"}
      </p>

      {statusMessage ? <p className="account-panel-message">{statusMessage}</p> : null}

      <div className="account-panel-actions">
        {currentUser ? (
          <button type="button" onClick={onSignOut}>
            退出登录
          </button>
        ) : (
          <>
            <button type="button" onClick={onOpenLogin} disabled={!configured}>
              登录账号
            </button>
            <button type="button" onClick={onOpenRegister} disabled={!configured}>
              注册账号
            </button>
          </>
        )}
      </div>
    </section>
  );
}
