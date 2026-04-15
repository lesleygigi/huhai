# 《胡亥模拟器》开发任务拆解

本文档将 `tools.md` 中的技术方案拆解为可执行任务。任务顺序以“先跑通最小原型，再迁移剧本，再完善表现和调试”为原则。

## 里程碑总览

| 里程碑 | 目标 | 完成标志 |
| --- | --- | --- |
| M0 | 环境准备 | 本地可以运行 Node、npm、Git，VS Code 可编辑项目 |
| M1 | 工程初始化 | Vite + React + TypeScript 项目可以启动 |
| M2 | 目录结构落地 | `story/`、`data/`、`public/`、`src/engine/` 等目录齐备 |
| M3 | 序章可玩原型 | 浏览器中可以游玩“沙丘之谋”核心三选项 |
| M4 | 调试工具 | 可以查看当前数值、标记、路线和选择历史 |
| M5 | 视觉小说表现 | 背景、立绘、音乐、音效标签链路跑通 |
| M6 | 第一章迁移 | 序章选择可以影响第一章内容和数值 |
| M7 | 结局判定 | 可以根据数值和标记预判或触发结局 |

## Task 0：环境配置

### 本地影响范围约束

本任务默认只允许影响当前项目目录：

- 不执行全局安装，例如 `npm install -g ...`。
- 不修改 shell 配置文件，例如 `~/.bashrc`、`~/.zshrc`。
- 不修改系统级 Node、npm、Git 配置。
- npm 命令使用项目内缓存目录 `./.npm-cache`，避免写入用户级 npm cache。
- VS Code 只写入本项目的 `.vscode/` 推荐配置；是否安装扩展由使用者手动决定。

### 0.1 检查基础工具

目标：只检查本机是否具备前端项目开发条件，不修改任何文件。

执行：

```bash
node -v
npm -v
git --version
```

验收：

- Node.js 可用。
- npm 可用。
- Git 可用。

建议版本：

- Node.js 20 LTS 或更新版本。
- npm 10 或更新版本。

### 0.2 配置 VS Code

目标：通过项目内 `.vscode/` 推荐配置保证剧本和代码有良好编辑体验。

新增：

```text
.vscode/
  extensions.json
  settings.json
```

`extensions.json` 中只声明推荐扩展，不自动安装，不影响其他目录：

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

可选推荐：

- Ink 语法高亮或 Inky 相关扩展。
- TypeScript React 支持扩展。

验收：

- `.vscode/extensions.json` 存在。
- `.ts`、`.tsx`、`.ink` 文件有基本语法高亮。
- VS Code 只在打开本项目时显示扩展推荐。

### 0.3 建立 Git 基线

目标：避免后续迁移剧本和工程初始化时难以回退。

执行：

```bash
git status
```

验收：

- 明确当前工作区状态。
- 确认 `scripts/` 原始剧本不会被覆盖。

备注：

- 若项目尚未初始化 Git，可后续执行 `git init`。
- 不要删除或重写 `scripts/` 中的 Markdown 剧本。

## Task 1：初始化前端工程 ✅

### 1.1 创建 Vite + React + TypeScript 项目

目标：建立浏览器预览基础。

执行方式：

```bash
npm --cache ./.npm-cache create vite@latest . -- --template react-ts
```

如果当前目录已有文件，执行前需要确认 Vite 不会覆盖 `scripts/`、`tools.md`、`task.md`。

验收：

- 存在 `package.json`。
- 存在 `src/`。
- 存在 `vite.config.ts`。
- 可以安装依赖。

### 1.2 安装依赖

目标：安装前端和叙事运行依赖。

执行：

```bash
npm --cache ./.npm-cache install
npm --cache ./.npm-cache install inkjs
```

可选依赖：

```bash
npm --cache ./.npm-cache install -D chokidar-cli
```

验收：

- `node_modules/` 存在。
- `package-lock.json` 存在。
- `inkjs` 已写入 `package.json`。
- `.npm-cache/` 存在，npm 缓存保留在当前项目目录。

### 1.3 启动开发服务器

目标：确认随时预览链路成立。

执行：

```bash
npm run dev
```

验收：

- 浏览器可以打开本地 Vite 页面。
- 修改 `src/` 中的代码后页面会刷新或热更新。

## Task 2：目录结构落地 ✅

### 2.1 创建剧情目录

目标：建立 Ink 剧情脚本位置。

新增：

```text
story/
  main.ink
  prologue.ink
  chapter1.ink
  chapter2.ink
  chapter3.ink
  chapter4.ink
  chapter5.ink
```

验收：

- `story/main.ink` 作为剧情入口。
- `story/prologue.ink` 用于序章原型。
- 后续章节文件先占位，不急于迁移全文。

### 2.2 创建数据目录

目标：把数值、标记、结局和素材配置从代码中分离。

新增：

```text
data/
  stats.json
  flags.json
  endings.json
  assets.json
```

验收：

- `stats.json` 定义数值名称、初始值、范围和说明。
- `flags.json` 定义标记名称、互斥关系和说明。
- `endings.json` 先写入少量示例结局条件。
- `assets.json` 先写入占位素材 ID。

### 2.3 创建素材目录

目标：为后续立绘、背景、音乐、音效留出稳定路径。

新增：

```text
public/
  images/
    backgrounds/
    portraits/
      huhai/
      zhao_gao/
      li_si/
      meng_yi/
      ziying/
      zhang_han/
  audio/
    music/
    sfx/
```

验收：

- 背景图统一放在 `public/images/backgrounds/`。
- 立绘按角色分目录。
- 音乐和音效分开存放。

### 2.4 创建前端模块目录

目标：避免所有逻辑堆在 `App.tsx`。

新增或调整：

```text
src/
  engine/
    ink.ts
    save.ts
    tags.ts
    endings.ts
  components/
    GameView.tsx
    TextBox.tsx
    ChoiceList.tsx
    DebugPanel.tsx
    BackgroundLayer.tsx
    PortraitLayer.tsx
  styles/
    game.css
```

验收：

- Ink 运行逻辑在 `src/engine/ink.ts`。
- 存档逻辑在 `src/engine/save.ts`。
- 演出标签解析在 `src/engine/tags.ts`。
- 结局判定在 `src/engine/endings.ts`。
- UI 组件按职责拆分。

## Task 3：Ink 剧情入口与基础规范 ✅

### 3.1 编写 `story/main.ink`

目标：集中定义全局变量并进入序章。

内容范围：

- 残暴值。
- 威望值。
- 恐惧值。
- 赵高好感度。
- 宗室支持度。
- 子婴好感度。
- 章邯好感度。
- 蒙毅好感度。
- 权谋值。
- 赵高罪证。
- 基础标记列表。

验收：

- 变量名稳定，后续前端可以读取。
- 入口跳转到序章。

### 3.2 编写 `story/prologue.ink`

目标：迁移序章核心可玩片段。

范围：

- 沙丘之夜开场。
- 赵高告知始皇驾崩。
- “可想做皇帝？”核心选择。
- A：同意矫诏。
- B：拒绝并告发。
- C：表面答应，暗中布局。

验收：

- 三个选择都能走通。
- 每个选择至少改变一个数值或标记。
- 每个选择都能进入一个临时结算段落。

### 3.3 统一 Ink 标签格式

目标：后续可由前端解析演出命令。

格式：

```ink
# bg: sha_qiu_night
# show: zhao_gao serious right
# hide: zhao_gao
# music: night_palace
# sfx: door_open
# fade: black
# shake: light
```

验收：

- `prologue.ink` 至少包含一个 `bg` 标签。
- `prologue.ink` 至少包含一个 `show` 标签。
- 前端可以读取当前段落的标签列表。

## Task 4：Ink 编译与加载链路 ✅

### 4.1 确定 Ink 加载方式

目标：让浏览器可以运行剧情。

可选方案：

- 方案 A：使用 Ink 编译器生成 JSON，再由 `inkjs` 加载。
- 方案 B：开发期先使用手写 JSON 或最小剧情对象验证 UI，再接入 Ink 编译。

建议：

- 最终采用方案 A。
- 若编译器安装受阻，先用方案 B 跑通 UI。

验收：

- 浏览器中可以创建 Ink Story 实例。
- 可以读取当前文本。
- 可以读取当前选择。
- 点击选择后剧情推进。

### 4.2 增加 npm 脚本

目标：标准化开发命令。

建议脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "story:build": "inklecate -o public/story/main.json story/main.ink",
    "story:watch": "chokidar 'story/**/*.ink' -c 'npm run story:build'"
  }
}
```

验收：

- `npm run dev` 可以启动预览。
- `npm run build` 可以构建前端。
- 剧情编译命令可执行或已记录阻塞原因。

## Task 5：最小游戏播放器

### 5.1 实现 `GameView`

目标：承载完整游戏界面。

功能：

- 加载剧情。
- 显示背景层。
- 显示立绘层。
- 显示文本框。
- 显示选择按钮。
- 显示调试面板。

验收：

- 浏览器页面不再是 Vite 默认页。
- 页面直接进入《胡亥模拟器》序章原型。

### 5.2 实现 `TextBox`

目标：显示当前剧情文本。

功能：

- 显示叙述文本。
- 显示角色台词。
- 支持点击继续。

验收：

- 多行文本排版正常。
- 长文本不会溢出容器。

### 5.3 实现 `ChoiceList`

目标：显示并处理选择。

功能：

- 显示当前可选项。
- 点击选项后调用 Ink 选择逻辑。
- 选择后推进剧情。

验收：

- A/B/C 三个序章选项都可点击。
- 点击后文本和状态发生变化。

### 5.4 实现重新开始

目标：方便反复测试分支。

功能：

- 重置 Ink Story。
- 清空当前运行时 UI 状态。
- 回到序章开头。

验收：

- 点击“重新开始”后数值和标记回到初始状态。

## Task 6：调试面板

### 6.1 显示变量

目标：创作时能确认数值变化。

显示：

- 残暴值。
- 威望值。
- 恐惧值。
- 赵高好感度。
- 宗室支持度。
- 子婴好感度。
- 章邯好感度。
- 蒙毅好感度。
- 权谋值。
- 赵高罪证。

验收：

- 点击不同选择后，变量显示实时更新。

### 6.2 显示标记

目标：创作时能确认路线状态。

显示：

- 当前获得的所有标记。
- 互斥标记冲突提醒。

验收：

- 选择“同意矫诏”后显示【矫诏同谋】。
- 选择“表面答应，暗中布局”后显示【隐忍待发】。

### 6.3 显示选择历史

目标：方便复盘测试路径。

显示：

- 选择节点名称。
- 玩家选择文本。
- 选择后获得的关键标记。

验收：

- 每次点击选择后，历史记录追加一条。

### 6.4 显示当前路线

目标：快速判断当前是主线、隐忍线、告发线等。

规则示例：

- 有【矫诏同谋】：主线。
- 有【隐忍待发】：隐忍线。
- 有【知情不报】：沉默线。
- 有【曾试图告发】：告发失败线。

验收：

- 调试面板显示当前路线名称。

## Task 7：存档与读档

### 7.1 实现本地存档

目标：允许保存当前进度。

功能：

- 使用 `localStorage` 保存 Ink 状态。
- 保存当前 UI 演出状态。
- 保存选择历史。

验收：

- 点击保存后刷新页面，仍可读档恢复。

### 7.2 实现读档

目标：恢复之前测试进度。

功能：

- 从 `localStorage` 读取。
- 恢复剧情位置。
- 恢复变量和标记。

验收：

- 读档后可以继续选择。

### 7.3 实现导入导出 JSON

目标：方便记录和复现 bug。

功能：

- 导出当前存档 JSON。
- 粘贴 JSON 后恢复进度。

验收：

- 一个测试路径可以导出并在刷新后导入恢复。

## Task 8：演出标签解析

### 8.1 实现 `tags.ts`

目标：解析 Ink 标签。

输入示例：

```text
bg: sha_qiu_night
show: zhao_gao serious right
music: night_palace
```

输出示例：

```ts
{
  type: "show",
  character: "zhao_gao",
  expression: "serious",
  position: "right"
}
```

验收：

- 支持 `bg`、`show`、`hide`、`music`、`sfx`。
- 未知标签不会导致游戏崩溃。

### 8.2 实现背景层

目标：根据 `bg` 标签切换背景。

功能：

- 从 `data/assets.json` 查找背景路径。
- 设置当前背景。
- 支持淡入淡出。

验收：

- 序章开头能显示沙丘夜色占位背景。

### 8.3 实现立绘层

目标：根据 `show` 和 `hide` 标签显示角色。

功能：

- 支持 left、center、right 三个位置。
- 支持表情差分。
- 支持隐藏指定角色。

验收：

- 赵高立绘可出现在右侧。
- 胡亥立绘可出现在左侧。
- `hide` 标签能移除角色。

### 8.4 实现音频控制

目标：根据 `music` 和 `sfx` 标签播放音频。

功能：

- BGM 循环播放。
- 切换 BGM 时停止旧音乐。
- SFX 单次播放。
- 提供静音开关。

验收：

- 进入序章时可播放占位 BGM。
- 点击选择时可播放占位音效。

## Task 9：数据表落地

### 9.1 编写 `data/stats.json`

目标：从 `scripts/sheet.md` 抽取数值定义。

字段：

- `id`
- `name`
- `initial`
- `min`
- `max`
- `description`

验收：

- 至少包含 `scripts/sheet.md` 中的主要数值。
- 调试面板可读取中文名称和范围。

### 9.2 编写 `data/flags.json`

目标：从 `scripts/sheet.md` 抽取标记词典。

字段：

- `id`
- `name`
- `chapter`
- `description`
- `exclusiveGroup`

验收：

- 至少包含序章、宗室、李斯、章邯、指鹿为马相关标记。
- 调试面板可检测互斥冲突。

### 9.3 编写 `data/endings.json`

目标：从 `scripts/sheet.md` 抽取结局条件。

字段：

- `id`
- `name`
- `type`
- `route`
- `conditions`

验收：

- 至少录入 3 个 HE、3 个 BE、2 个 TE。
- 结局判定模块可以读取并计算满足度。

## Task 10：结局判定模块

### 10.1 实现 `endings.ts`

目标：根据当前数值和标记判断结局状态。

功能：

- 判断 `min` 条件。
- 判断 `max` 条件。
- 判断必需标记。
- 判断禁止标记。
- 输出满足和缺失条件。

验收：

- 调试面板能显示“可能结局”。
- 能显示每个结局缺少什么条件。

### 10.2 接入调试面板

目标：让作者边玩边看结局走向。

显示：

- 最接近的结局。
- 已满足条件。
- 未满足条件。
- 锁死原因。

验收：

- 当获得【宗室屠夫】时，部分 HE 显示锁死。

## Task 11：第一章迁移

### 11.1 迁移扶苏处置节点

目标：验证序章标记影响第一章。

来源：

- `scripts/chapter1.md`
- `scripts/chapter_outline.md`

选项：

- 坚持赐死。
- 改为流放。
- 暗中赦免并结盟。

验收：

- “暗中赦免并结盟”仅在【隐忍待发】路线可用。

### 11.2 迁移蒙氏兄弟节点

目标：继续验证数值和标记变化。

选项：

- 处死蒙恬蒙毅。
- 赦免留用。
- 贬为庶民。

验收：

- 选择赦免时宗室支持或蒙毅好感变化。
- 选择处死时赵高好感和威望变化。

## Task 12：视觉和交互 polish

### 12.1 基础视觉风格

目标：形成稳定的视觉小说阅读界面。

要求：

- 背景铺满。
- 立绘不遮挡文本。
- 文本框可读性高。
- 选项按钮清晰。
- 移动端不溢出。

验收：

- 桌面端和移动端都能正常阅读和选择。

### 12.2 对话历史

目标：玩家可以回看已读文本。

功能：

- 保存已显示文本。
- 打开历史面板。
- 显示最近若干条。

验收：

- 点击历史按钮可以查看之前文本。

### 12.3 设置面板

目标：提供基础体验设置。

功能：

- 字号。
- 文本速度。
- BGM 音量。
- SFX 音量。
- 静音。

验收：

- 设置可保存到本地。

## Task 13：测试与验收

### 13.1 手动路径测试

目标：确认主要路径可走通。

至少测试：

- A：同意矫诏。
- B：拒绝并告发。
- C：表面答应，暗中布局。
- 重新开始。
- 保存和读档。

验收：

- 无白屏。
- 无控制台错误。
- 数值符合预期。
- 标记符合预期。

### 13.2 构建测试

目标：确认项目可发布。

执行：

```bash
npm run build
```

验收：

- 构建成功。
- 没有 TypeScript 编译错误。

### 13.3 预览构建产物

目标：确认生产构建也能运行。

执行：

```bash
npm run preview
```

验收：

- 生产预览页面能打开。
- 序章原型能正常游玩。

## 优先级建议

### P0：必须先做

- Task 0：环境配置。
- Task 1：初始化前端工程。
- Task 2：目录结构落地。
- Task 3：Ink 剧情入口与基础规范。
- Task 5：最小游戏播放器。

### P1：原型完成必需

- Task 4：Ink 编译与加载链路。
- Task 6：调试面板。
- Task 8：演出标签解析。
- Task 9：数据表落地。

### P2：扩展体验

- Task 7：存档与读档。
- Task 10：结局判定模块。
- Task 11：第一章迁移。
- Task 12：视觉和交互 polish。

### P3：持续完善

- 后续章节迁移。
- 正式美术素材替换。
- 音频素材替换。
- 路线完整测试。
- 发布页面。

## 第一轮最小交付范围

第一轮建议只追求“能玩、能看数值、能继续扩写”。

必须完成：

- Vite + React + TypeScript 项目启动。
- `story/prologue.ink` 跑通。
- 浏览器显示序章文本和三选项。
- 选择后数值和标记变化。
- 调试面板显示变量和标记。
- 背景和立绘标签至少各跑通一个。

暂不追求：

- 完整章节迁移。
- 完整结局判定。
- 正式美术。
- 完整音频。
- 自动播放、历史记录、设置面板等体验功能。
