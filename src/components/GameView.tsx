import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  getFlagNames,
  getRouteName,
  type ChoiceHistoryItem,
} from "../engine/debug";
import { loadStory, type StoryRuntime, type StorySnapshot } from "../engine/ink";
import {
  createDialogueHistoryItem,
  type DialogueHistoryItem,
} from "../engine/history";
import {
  applyStoryTags,
  initialPresentationState,
  resolvePresentationState,
  type PortraitState,
  type PresentationState,
} from "../engine/presentation";
import {
  clearSave,
  createSaveData,
  getAllSlots,
  readSave,
  writeSave,
  type SlotInfo,
} from "../engine/save";
import {
  readSettings,
  writeSettings,
  type GameSettings,
} from "../engine/settings";
import { getShortcutPathBySceneName } from "../engine/shortcuts";
import {
  getCurrentAuthUser,
  signInWithEmailAndPassword,
  signOutAuth,
  signUpWithEmailAndPassword,
  verifyEmailSignUpCode,
  type PendingEmailSignUp,
  type AuthUser,
} from "../engine/auth";
import { isCloudbaseConfigured } from "../lib/cloudbase";
import { AuthModal } from "./AuthModal";
import { BackgroundLayer } from "./BackgroundLayer";
import { ChoiceList } from "./ChoiceList";
import { GameMenu } from "./GameMenu";
import { HistoryPanel } from "./HistoryPanel";
import { PortraitLayer } from "./PortraitLayer";
import { SettingsPanel } from "./SettingsPanel";
import { ShortcutsPanel } from "./ShortcutsPanel";
import { TextBox } from "./TextBox";
import "./../styles/game.css";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; runtime: StoryRuntime; snapshot: StorySnapshot }
  | { status: "error"; message: string };

type AuthModalMode = "login" | "register";

const speakerCharacterMap: Record<string, string> = {
  胡亥: "huhai",
  赵高: "zhao_gao",
  李斯: "li_si",
  蒙毅: "meng_yi",
};

const knownSpeakers = new Set([
  ...Object.keys(speakerCharacterMap),
  "冯去疾",
  "子婴",
  "陈胜",
  "吴广",
  "使者",
  "章邯",
  "韩谈",
  "属官甲",
  "公孙季",
  "阎乐",
  "刘邦",
  "项羽",
  "扶苏",
  "访客",
  "公子高",
  "蒙恬",
  "吕郡守",
  "将领",
]);

const defaultPortraitExpressions: Record<string, string> = {
  huhai: "anxious",
  zhao_gao: "serious",
  li_si: "serious",
  meng_yi: "serious",
};

function getLineSpeaker(line: string): string | undefined {
  const match = line.match(/^([^：:]{1,12})[：:]/);
  const speaker = match?.[1]?.trim();
  
  if (speaker && knownSpeakers.has(speaker)) {
    return speaker;
  }
  
  return undefined;
}

function getSpeakingPortraitState(
  state: PresentationState,
  line: string
): PresentationState {
  const speaker = getLineSpeaker(line);
  const character = speaker ? speakerCharacterMap[speaker] : undefined;
  const emptyPortraits = {
    left: null,
    center: null,
    right: null,
  };

  if (!character) {
    return {
      ...state,
      portraits: emptyPortraits,
    };
  }

  const existingPortrait = Object.values(state.portraits).find(
    (portrait): portrait is PortraitState => portrait?.character === character
  );

  return {
    ...state,
    portraits: {
      ...emptyPortraits,
      center: {
        character,
        expression:
          existingPortrait?.expression ??
          defaultPortraitExpressions[character] ??
          "serious",
      },
    },
  };
}

export function GameView() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [history, setHistory] = useState<ChoiceHistoryItem[]>([]);
  const [dialogueHistory, setDialogueHistory] = useState<DialogueHistoryItem[]>(
    []
  );
  const [saveMessage, setSaveMessage] = useState("");
  const [slots, setSlots] = useState<SlotInfo[]>(() => getAllSlots());
  const [lineIndex, setLineIndex] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentShortcutPath, setCurrentShortcutPath] = useState<
    string | undefined
  >("prologue_start");
  const [settings, setSettings] = useState<GameSettings>(() => readSettings());
  const [presentation, setPresentation] = useState<PresentationState>(
    initialPresentationState
  );
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("login");
  const pendingEmailSignUpRef = useRef<PendingEmailSignUp | null>(null);

  const authConfigured = isCloudbaseConfigured();

  const routeName = useMemo(() => {
    if (loadState.status !== "ready") {
      return "未开始";
    }
    return getRouteName(getFlagNames(loadState.snapshot.variables.flags));
  }, [loadState]);

  const currentLine = useMemo(() => {
    if (loadState.status !== "ready") return "";
    return loadState.snapshot.lines[lineIndex] ?? "";
  }, [loadState, lineIndex]);

  const activePresentation = useMemo(() => {
    if (loadState.status !== "ready") return initialPresentationState;
    const canAdvanceLine = lineIndex < loadState.snapshot.lines.length - 1;
    const showChoices = !canAdvanceLine && loadState.snapshot.choices.length > 0;
    return showChoices
      ? getSpeakingPortraitState(presentation, "")
      : getSpeakingPortraitState(presentation, currentLine);
  }, [currentLine, presentation, loadState, lineIndex]);

  const resolvedPresentation = useMemo(
    () => resolvePresentationState(activePresentation),
    [activePresentation]
  );

  const currentSpeaker = useMemo(
    () => getLineSpeaker(currentLine),
    [currentLine]
  );

  useEffect(() => {
    let mounted = true;

    loadStory()
      .then((runtime) => {
        if (!mounted) return;
        const snapshot = runtime.getSnapshot();
        setPresentation(applyStoryTags(initialPresentationState, snapshot.tags));
        setLineIndex(0);
        setDialogueHistory(
          snapshot.lines[0] ? [createDialogueHistoryItem(1, [snapshot.lines[0]])] : []
        );
        setLoadState({ status: "ready", runtime, snapshot });
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!authConfigured) {
      setAuthReady(true);
      setAuthMessage("尚未配置 CloudBase 环境 ID，账号功能暂不可用。");
      return () => {
        mounted = false;
      };
    }

    getCurrentAuthUser()
      .then((user) => {
        if (!mounted) return;
        setAuthUser(user);
        setAuthReady(true);
        setAuthMessage(user ? "已恢复登录状态。" : "");
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        setAuthReady(true);
        setAuthUser(null);
        setAuthMessage(
          error instanceof Error ? error.message : "恢复登录状态失败。"
        );
      });

    return () => {
      mounted = false;
    };
  }, [authConfigured]);

  function updateSettings(nextSettings: GameSettings) {
    setSettings(nextSettings);
    writeSettings(nextSettings);
  }

  function appendDialogueHistory(lines: string[], choice?: string) {
    if (lines.length === 0 && !choice) return;
    setDialogueHistory((current) => {
      const nextId = (current.at(-1)?.id ?? 0) + 1;
      return [
        ...current,
        createDialogueHistoryItem(nextId, lines, choice),
      ].slice(-80);
    });
  }

  function rememberShortcut(snapshot: StorySnapshot, explicitPath?: string) {
    const path = explicitPath ?? getShortcutPathBySceneName(snapshot.variables.scene_name);
    if (path) setCurrentShortcutPath(path);
  }

  const viewStyle = {
    "--reader-font-size":
      settings.fontSize === "small"
        ? "26px"
        : settings.fontSize === "large"
          ? "34px"
          : "30px",
  } as CSSProperties;

  if (loadState.status === "loading") {
    return (
      <main className="game-view" style={viewStyle}>
        <section className="game-shell">正在载入沙丘之夜……</section>
      </main>
    );
  }

  if (loadState.status === "error") {
    return (
      <main className="game-view" style={viewStyle}>
        <section className="game-shell">
          <h1>载入失败</h1>
          <p>{loadState.message}</p>
        </section>
      </main>
    );
  }

  const { runtime, snapshot } = loadState;
  const canAdvanceLine = lineIndex < snapshot.lines.length - 1;
  const showChoices = !canAdvanceLine && snapshot.choices.length > 0;

  function advanceLine() {
    if (!canAdvanceLine) return;
    const nextIndex = lineIndex + 1;
    setLineIndex(nextIndex);
    appendDialogueHistory([snapshot.lines[nextIndex]]);
  }

  function choose(index: number) {
    if (loadState.status !== "ready") return;
    const choice = snapshot.choices[index];
    const nextSnapshot = runtime.choose(index);
    const nextFlags = getFlagNames(nextSnapshot.variables.flags);
    setPresentation((current) => applyStoryTags(current, nextSnapshot.tags));
    appendDialogueHistory([], choice?.text);
    if (nextSnapshot.lines[0]) appendDialogueHistory([nextSnapshot.lines[0]]);
    setHistory((current) => [
      ...current,
      {
        id: current.length + 1,
        text: choice?.text ?? `选择 ${index + 1}`,
        routeName: getRouteName(nextFlags),
        flags: nextFlags,
      },
    ]);
    setLineIndex(0);
    rememberShortcut(nextSnapshot);
    setLoadState({ status: "ready", runtime, snapshot: nextSnapshot });
  }

  function restart() {
    const nextSnapshot = runtime.restart();
    setHistory([]);
    setLineIndex(0);
    setDialogueHistory(
      nextSnapshot.lines[0] ? [createDialogueHistoryItem(1, [nextSnapshot.lines[0]])] : []
    );
    setPresentation(applyStoryTags(initialPresentationState, nextSnapshot.tags));
    setSaveMessage("已重新开始。");
    setCurrentShortcutPath("prologue_start");
    setLoadState({ status: "ready", runtime, snapshot: nextSnapshot });
  }

  function jumpToScene(path: string) {
    const nextSnapshot = runtime.jumpTo(path);
    setHistory([]);
    setLineIndex(0);
    setDialogueHistory(
      nextSnapshot.lines[0] ? [createDialogueHistoryItem(1, [nextSnapshot.lines[0]])] : []
    );
    setPresentation(applyStoryTags(initialPresentationState, nextSnapshot.tags));
    setSaveMessage(`已跳转至剧情点：${path}`);
    rememberShortcut(nextSnapshot, path);
    setShortcutsOpen(false);
    setLoadState({ status: "ready", runtime, snapshot: nextSnapshot });
  }

  function saveGame(slotId: number) {
    const chapterName = String(snapshot.variables.chapter_name || "未知章节");
    const sceneName = String(snapshot.variables.scene_name || "未知场景");
    const save = createSaveData(runtime.toJson(), chapterName, sceneName, history, dialogueHistory);
    writeSave(slotId, save);
    setSlots(getAllSlots());
    setSaveMessage(`已保存至槽位 ${slotId}：${chapterName} ${sceneName}`);
  }

  function loadGame(slotId: number) {
    try {
      const save = readSave(slotId);
      if (!save) {
        setSaveMessage(`槽位 ${slotId} 没有可读取的存档。`);
        return;
      }
      const nextSnapshot = runtime.loadJson(save.inkStateJson);
      setHistory(save.history);
      setLineIndex(0);
      setDialogueHistory(
        save.dialogueHistory.length > 0 ? save.dialogueHistory :
        nextSnapshot.lines[0] ? [createDialogueHistoryItem(1, [nextSnapshot.lines[0]])] : []
      );
      setPresentation(applyStoryTags(initialPresentationState, nextSnapshot.tags));
      setSaveMessage(`已读档（槽位 ${slotId}）：${new Date(save.savedAt).toLocaleString()}`);
      rememberShortcut(nextSnapshot);
      setLoadState({ status: "ready", runtime, snapshot: nextSnapshot });
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : String(error));
    }
  }

  function clearLocalSave(slotId: number) {
    clearSave(slotId);
    setSlots(getAllSlots());
    setSaveMessage(`已清除槽位 ${slotId} 的存档。`);
  }

  async function handleLogin(email: string, password: string) {
    const user = await signInWithEmailAndPassword(email, password);
    setAuthUser(user);
    setAuthReady(true);
    setAuthMessage(user ? `已登录：${user.email}` : "登录成功，但未获取到用户信息。");
    setAuthModalOpen(false);
  }

  async function handleRegister(email: string, password: string) {
    const pending = await signUpWithEmailAndPassword(email, password);
    pendingEmailSignUpRef.current = pending;
    setAuthMessage(`验证码已发送到 ${email}，请输入邮件中的验证码完成注册。`);
  }

  async function handleRegisterVerify(verificationCode: string) {
    const pending = pendingEmailSignUpRef.current;
    if (!pending) {
      throw new Error("注册会话已失效，请重新发送验证码。");
    }

    const user = await verifyEmailSignUpCode(pending, verificationCode);
    pendingEmailSignUpRef.current = null;
    setAuthUser(user);
    setAuthReady(true);
    setAuthMessage(user ? `注册并登录成功：${user.email}` : "注册成功，请继续登录。");
    setAuthModalOpen(false);
    setAuthModalMode("login");
  }

  function closeAuthModal() {
    pendingEmailSignUpRef.current = null;
    setAuthModalOpen(false);
  }

  function switchAuthMode(mode: AuthModalMode) {
    pendingEmailSignUpRef.current = null;
    setAuthModalMode(mode);
  }

  async function handleSignOut() {
    try {
      await signOutAuth();
      setAuthUser(null);
      setAuthMessage("已退出登录。");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "退出登录失败。");
    }
  }

  return (
    <main className="game-view" style={viewStyle}>
      <section className="game-shell" aria-label="胡亥模拟器">
        <section className="scene-stage" aria-label="演出区">
          <BackgroundLayer
            backgroundId={presentation.background}
            imagePath={resolvedPresentation.backgroundPath}
          />
          <PortraitLayer
            portraits={activePresentation.portraits}
            portraitPaths={resolvedPresentation.portraitPaths}
          />

          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-label="菜单"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <GameMenu
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            onRestart={restart}
            onHistory={() => { setHistoryOpen(true); setMenuOpen(false); }}
            onSettings={() => { setSettingsOpen(true); setMenuOpen(false); }}
            snapshot={snapshot}
            routeName={routeName}
            history={history}
            settings={settings}
            updateSettings={updateSettings}
            slots={slots}
            saveMessage={saveMessage}
            onSave={saveGame}
            onLoad={loadGame}
            onClear={clearLocalSave}
            onShortcuts={() => setShortcutsOpen(true)}
            authConfigured={authConfigured}
            authReady={authReady}
            authUser={authUser}
            authStatusMessage={authMessage}
            onOpenLogin={() => {
              setAuthModalMode("login");
              setAuthModalOpen(true);
            }}
            onOpenRegister={() => {
              setAuthModalMode("register");
              setAuthModalOpen(true);
            }}
            onSignOut={handleSignOut}
            audioInfo={{ music: presentation.music, sfx: presentation.sfxQueue }}
          />

          {shortcutsOpen && (
            <ShortcutsPanel
              currentPath={currentShortcutPath}
              onJump={jumpToScene}
              onClose={() => setShortcutsOpen(false)}
            />
          )}

          {showChoices && (
            <div className="choice-overlay">
              <ChoiceList
                choices={snapshot.choices.map((choice) => choice.text)}
                onChoose={choose}
              />
            </div>
          )}
        </section>

        <section className="dialogue-stage" aria-label="剧本文本">
          <TextBox
            line={currentLine}
            speaker={currentSpeaker}
            canAdvance={canAdvanceLine}
            onAdvance={advanceLine}
          />
        </section>
      </section>

      <HistoryPanel
        open={historyOpen}
        items={dialogueHistory}
        onClose={() => setHistoryOpen(false)}
      />
      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        onChange={updateSettings}
        onClose={() => setSettingsOpen(false)}
      />
      <AuthModal
        open={authModalOpen}
        mode={authModalMode}
        configured={authConfigured}
        statusMessage={authMessage}
        onClose={closeAuthModal}
        onSwitchMode={switchAuthMode}
        onLogin={handleLogin}
        onRegisterStart={handleRegister}
        onRegisterVerify={handleRegisterVerify}
      />
    </main>
  );
}
