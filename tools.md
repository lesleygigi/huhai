# 《胡亥模拟器》技术栈落地方案

## 目标

《胡亥模拟器》是一款以文字叙事、分支选择、隐藏数值、标记判定和多结局为核心的历史题材文字模拟器。当前 `scripts/` 目录已经包含完整的 Markdown 剧本、章节大纲、分支图、数值表和结局条件。

本方案的目标是：

- 使用代码创作，而不是拖拽式编辑器。
- 支持随时预览剧情、选项、数值变化和结局判定。
- 后续可以加入立绘、背景、BGM、音效和转场。
- 保留现有 Markdown 剧本作为原始创作稿，逐步迁移到可运行脚本。

## 推荐技术栈

### 核心选择

```text
叙事脚本：Ink
脚本运行时：inkjs
前端框架：Vite + TypeScript + React
样式：CSS
运行平台：浏览器
编辑器：VS Code
版本管理：Git
```

### 分工

| 层级 | 工具 | 责任 |
| --- | --- | --- |
| 剧情脚本 | Ink | 正文、选择、跳转、变量、条件、标记 |
| 剧情运行 | inkjs | 在浏览器中运行 Ink 剧情 |
| 游戏界面 | React | 文本框、选项、立绘、背景、调试面板、菜单 |
| 开发预览 | Vite | 本地开发服务器、热更新、快速预览 |
| 类型与规则 | TypeScript | 存档、数值、结局判定、素材表、调试逻辑 |
| 视觉样式 | CSS | 视觉小说式布局、转场、响应式界面 |

## 为什么选择这套方案

### Ink 适合当前剧本

项目现有内容包含：

- 多章节主线。
- 大量选择节点。
- 隐藏数值，例如残暴值、威望值、恐惧值、赵高好感度。
- 标记系统，例如【矫诏同谋】、【隐忍待发】、【庇护宗室】。
- 多结局条件判定。

这些都可以自然映射到 Ink 的变量、列表、条件分支和跳转。

### Vite + React 适合随时预览

Vite 可以启动本地网页预览：

```bash
npm run dev
```

之后在浏览器中测试游戏。修改前端代码后可以热更新；修改 Ink 剧情后可以重新编译并刷新预览。

### 前端可承载立绘和背景

Ink 只处理剧情逻辑。视觉表现由 React 和 CSS 处理，因此可以加入：

- 背景图。
- 人物立绘。
- 表情差分。
- BGM。
- 音效。
- 淡入淡出。
- 震屏。
- 存档和读档。
- 数值调试面板。

## 不优先选择的工具

### Ren'Py

Ren'Py 适合传统视觉小说，内置立绘、背景、音频、存档等能力很强。如果项目最终更接近传统 AVG，可以考虑。

不作为首选的原因：

- 当前需求强调浏览器内随时预览。
- 项目核心是分支数值模拟，Web 技术栈更灵活。
- 后续如果需要调试隐藏数值、结局条件和路线树，网页调试面板更容易定制。

### Twine

Twine 适合互动小说，但默认工作流偏图形化 passage 管理。虽然可以使用 Twee + Tweego 纯文本开发，但大型项目中结构容易分散。

不作为首选的原因：

- 用户明确希望使用代码创作，而不是拖拽工具。
- 当前剧本已经按章节组织，Ink 更适合逐章迁移。

### Yarn Spinner + Godot/Unity

Yarn Spinner 适合接入 Godot 或 Unity 的对话系统。

不作为首选的原因：

- 当前项目没有地图、战斗、角色移动等强游戏引擎需求。
- 引入 Godot/Unity 会增加工程复杂度。
- 浏览器预览和快速文本迭代不如 Vite 轻量。

## 推荐目录结构

建议保留现有 `scripts/`，新增可运行工程结构：

```text
huhai/
  scripts/
    chapter0.md
    chapter1.md
    chapter2.md
    chapter3.md
    chapter4.md
    chapter5.md
    branch.md
    sheet.md
    chapter_outline.md

  story/
    prologue.ink
    chapter1.ink
    chapter2.ink
    chapter3.ink
    chapter4.ink
    chapter5.ink
    main.ink

  data/
    stats.json
    flags.json
    endings.json
    assets.json

  public/
    images/
      backgrounds/
      portraits/
    audio/
      music/
      sfx/

  src/
    engine/
      ink.ts
      save.ts
      endings.ts
      tags.ts
    components/
      GameView.tsx
      TextBox.tsx
      ChoiceList.tsx
      PortraitLayer.tsx
      BackgroundLayer.tsx
      DebugPanel.tsx
    styles/
      game.css
    main.tsx

  package.json
  vite.config.ts
  tools.md
```

## 剧本迁移策略

不要一次性迁移全部章节。建议按“可玩闭环”推进。

### 第一阶段：序章原型

目标：把 `scripts/chapter0.md` 中“沙丘之谋”的核心选择做成可运行版本。

范围：

- 序章开场。
- 赵高告知始皇驾崩。
- 核心选择节点：
  - A：同意矫诏。
  - B：拒绝并告发。
  - C：表面答应，暗中布局。
- 基础数值：
  - 残暴值。
  - 威望值。
  - 恐惧值。
  - 赵高好感度。
  - 权谋值。
- 基础标记：
  - 【矫诏同谋】。
  - 【隐忍待发】。
  - 【知情不报】。
  - 【曾试图告发】。

### 第二阶段：第一章到第二章

目标：验证跨章节变量和标记继承。

范围：

- 扶苏处置。
- 蒙氏兄弟处置。
- 宗室处置。
- 大兴土木。
- 调试面板显示路线、数值和标记。

### 第三阶段：完整结局判定

目标：把 `scripts/sheet.md` 中的结局阈值转成可测试规则。

范围：

- `data/endings.json` 保存结局条件。
- `src/engine/endings.ts` 负责判定当前可能结局。
- 调试面板显示“已满足条件”和“缺失条件”。

### 第四阶段：视觉小说表现层

目标：加入背景、立绘、音乐和转场。

范围：

- 背景图切换。
- 角色立绘显示与隐藏。
- 表情差分。
- BGM 和音效。
- 淡入淡出、震屏等演出指令。

## Ink 脚本规范

### 基础变量

建议在 `story/main.ink` 或公共入口中集中定义：

```ink
VAR cruelty = 0
VAR prestige = 0
VAR fear = 0
VAR zhao_gao = 0
VAR clan_support = 0
VAR ziying = 0
VAR zhang_han = 0
VAR meng_yi = 0
VAR strategy = 0
VAR zhao_gao_evidence = 0
```

### 标记

Ink 可以使用 `LIST` 表示关键标记：

```ink
LIST flags = 矫诏同谋, 隐忍待发, 知情不报, 曾试图告发, 庇护宗室, 宗室屠夫, 保李斯, 反杀赵高
```

获得标记：

```ink
~ flags += 矫诏同谋
```

判断标记：

```ink
{flags ? 隐忍待发:
    你压低声音，假意顺从赵高。
- else:
    你沉默地看着案上的遗诏。
}
```

### 选择节点

选择文本应尽量保留原 Markdown 剧本中的文学表达，同时在选择后集中写数值变化。

```ink
=== prologue_conspiracy ===

赵高：“臣问公子，可想做皇帝？”

* [同意矫诏]
    ~ flags += 矫诏同谋
    ~ fear += 1
    ~ zhao_gao += 2
    你垂下眼睛。你的手在袖中攥紧，指甲几乎刺破掌心。
    胡亥：“这帝位……我取了。”
    -> chapter1

* [拒绝并告发]
    ~ fear += 1
    胡亥：“此乃大逆！我要面见丞相，揭发赵高！”
    -> report_to_mengyi

* [表面答应，暗中布局]
    ~ flags += 隐忍待发
    ~ fear += 1
    ~ strategy += 1
    你低下头，掩去眼中的惊惧。
    -> chapter1
```

## 演出标签规范

Ink 的标签交给前端解析。建议统一使用以下格式：

```ink
# bg: sha_qiu_night
# show: zhao_gao serious right
# hide: zhao_gao
# music: night_palace
# sfx: door_open
# fade: black
# shake: light
```

### 标签含义

| 标签 | 示例 | 作用 |
| --- | --- | --- |
| `bg` | `# bg: sha_qiu_night` | 切换背景 |
| `show` | `# show: zhao_gao serious right` | 显示人物立绘 |
| `hide` | `# hide: zhao_gao` | 隐藏人物 |
| `music` | `# music: night_palace` | 播放 BGM |
| `sfx` | `# sfx: door_open` | 播放音效 |
| `fade` | `# fade: black` | 触发淡入淡出 |
| `shake` | `# shake: light` | 触发震屏 |

## 素材规范

建议统一使用 ID，不在 Ink 中直接写文件路径。

### 目录

```text
public/images/backgrounds/sha_qiu_night.webp
public/images/backgrounds/side_hall_candle.webp
public/images/portraits/huhai/anxious.webp
public/images/portraits/huhai/calm.webp
public/images/portraits/zhao_gao/serious.webp
public/images/portraits/zhao_gao/smile.webp
public/audio/music/night_palace.mp3
public/audio/sfx/door_open.mp3
```

### assets.json

```json
{
  "backgrounds": {
    "sha_qiu_night": "/images/backgrounds/sha_qiu_night.webp",
    "side_hall_candle": "/images/backgrounds/side_hall_candle.webp"
  },
  "portraits": {
    "huhai": {
      "anxious": "/images/portraits/huhai/anxious.webp",
      "calm": "/images/portraits/huhai/calm.webp"
    },
    "zhao_gao": {
      "serious": "/images/portraits/zhao_gao/serious.webp",
      "smile": "/images/portraits/zhao_gao/smile.webp"
    }
  },
  "music": {
    "night_palace": "/audio/music/night_palace.mp3"
  },
  "sfx": {
    "door_open": "/audio/sfx/door_open.mp3"
  }
}
```

## 前端功能规划

### 最小可玩版本

- 显示剧情文本。
- 显示选择按钮。
- 点击选择后推进剧情。
- 显示当前数值。
- 显示当前标记。
- 支持重新开始。

### 创作调试版本

- 显示当前 Ink knot/stitch。
- 显示历史选择。
- 显示全部变量。
- 显示全部标记。
- 显示当前可能结局。
- 显示结局条件缺口。
- 支持导出当前存档 JSON。
- 支持导入存档 JSON。

### 体验版本

- 标题界面。
- 存档/读档。
- 自动播放。
- 对话历史。
- 背景、立绘、音乐。
- 设置界面。
- 字体大小调整。

## 结局判定建议

结局条件建议先放在 `data/endings.json`，不要全部写死在 Ink 中。这样便于调试和修改。

示例：

```json
[
  {
    "id": "he_mingjun_nixi",
    "name": "HE·明君逆袭",
    "type": "HE",
    "conditions": {
      "max": {
        "cruelty": 3,
        "fear": 2
      },
      "min": {
        "prestige": 7,
        "clan_support": 3,
        "ziying": 4,
        "zhang_han": 5
      },
      "flags": ["巨鹿大捷"]
    }
  }
]
```

前端调试面板可以读取这个文件，并实时告诉作者：

```text
HE·明君逆袭
已满足：残暴值 <= 3，宗室支持度 >= 3
未满足：威望值还差 2，章邯好感度还差 1，缺少【巨鹿大捷】
```

## 开发命令

初始化项目后，建议使用：

```bash
npm install
npm run dev
npm run build
```

如果使用 Ink 编译步骤，可以增加：

```bash
npm run story:build
npm run story:watch
```

建议的 `package.json` 脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run story:build && vite build",
    "preview": "vite preview",
    "story:build": "inklecate -o public/story/main.json story/main.ink",
    "story:watch": "chokidar 'story/**/*.ink' -c 'npm run story:build'"
  }
}
```

实际脚本可以根据所选 Ink 编译方式调整。

## VS Code 建议

推荐安装：

- Ink 语法高亮或 Inky 相关扩展。
- ESLint。
- Prettier。
- TypeScript Vue/React 相关扩展按实际框架选择。

建议工作流：

1. 左侧打开 `.ink` 剧本。
2. 右侧打开浏览器预览。
3. 保存 `.ink`。
4. 自动重新编译剧情。
5. 刷新或热更新游戏预览。
6. 用调试面板检查数值、标记和结局条件。

## 近期执行计划

### Step 1：创建前端工程

在当前目录初始化 Vite + React + TypeScript 项目。

### Step 2：建立 `story/` 和 `data/`

新增：

- `story/main.ink`
- `story/prologue.ink`
- `data/stats.json`
- `data/flags.json`
- `data/endings.json`
- `data/assets.json`

### Step 3：迁移序章核心选择

从 `scripts/chapter0.md` 提取“沙丘之谋”三选项，写入 `story/prologue.ink`。

### Step 4：实现网页播放器

实现：

- 剧情文本渲染。
- 选项渲染。
- Ink 状态推进。
- 基础存档。
- 调试面板。

### Step 5：加入视觉标签解析

实现：

- `# bg`
- `# show`
- `# hide`
- `# music`
- `# sfx`

### Step 6：补充第一批临时素材

先使用占位背景和占位立绘，让演出链路跑通。之后再替换正式素材。

## 最小原型验收标准

第一版原型完成时，应满足：

- 可以在浏览器中开始游戏。
- 可以读到序章开场。
- 可以选择 A/B/C 三个核心分支。
- 选择会改变数值和标记。
- 调试面板能显示当前数值和标记。
- 可以重新开始。
- 至少支持一个背景标签和一个立绘标签。

达到这个标准后，再继续迁移第一章和后续复杂结局条件。
