# 020 Step 4 云存档集合结构定稿

## 目标

为 [task/020.md](/data/2t/projects_moved/travel_project/jll/huhai/task/020.md#L314) 的 Step 4 固定一套唯一可执行的云存档结构，供后续：

- Step 5：配置安全规则
- Step 9：封装云存档读写
- Step 10：改造现有存档面板

统一使用。

---

## 集合名

第一版云存档集合统一命名为：

- `save_slots`

后续前端代码、控制台配置、安全规则、测试文档都统一使用这个名字，不再另起：

- `saves`
- `saveSlots`
- `save_slot`

---

## 文档结构

第一版每个用户每个槽位对应一条当前生效文档。

```ts
type CloudSaveSlot = {
  _id?: string;
  userId: string;
  slotId: number;
  version: number;
  chapterName: string;
  sceneName: string;
  inkStateJson: string;
  history: unknown[];
  dialogueHistory: unknown[];
  savedAt: string;
  createdAt: string;
  updatedAt: string;
};
```

---

## 字段说明

### 1. `_id`

- CloudBase 文档主键
- 由数据库生成或由后续写入逻辑维护
- 前端不以 `_id` 作为业务槽位主键

### 2. `userId`

- 当前登录用户的唯一 ID
- 用于权限隔离
- 后续安全规则必须围绕它判断

### 3. `slotId`

- 槽位编号
- 取值范围固定为 `1..6`
- 与当前本地存档 `TOTAL_SLOTS = 6` 保持一致

### 4. `version`

- 存档结构版本号
- 第一版固定为 `1`
- 后续如果 `SaveData` 结构升级，走版本迁移

### 5. `chapterName`

- 章节展示名
- 对应当前本地存档里的 `chapterName`
- 保持 camelCase 命名，不改成下划线

### 6. `sceneName`

- 场景展示名
- 对应当前本地存档里的 `sceneName`

### 7. `inkStateJson`

- 核心 Ink 运行状态
- 对应当前本地存档里的 `inkStateJson`
- 是读档恢复的关键字段

### 8. `history`

- 选择历史
- 结构与当前本地 `SaveData.history` 一致

### 9. `dialogueHistory`

- 对话历史
- 结构与当前本地 `SaveData.dialogueHistory` 一致

### 10. `savedAt`

- 玩家点击保存时的业务时间
- 使用 ISO 字符串

### 11. `createdAt`

- 该槽位记录首次创建时间
- 使用 ISO 字符串

### 12. `updatedAt`

- 该槽位记录最近一次云端更新的时间
- 使用 ISO 字符串
- 后续“最后写入覆盖”以它为主参考

---

## 与本地 `SaveData` 的映射

当前本地结构见 [src/engine/save.ts](/data/2t/projects_moved/travel_project/jll/huhai/src/engine/save.ts#L1)。

映射关系固定如下：

```ts
type SaveData = {
  version: 1;
  savedAt: string;
  chapterName: string;
  sceneName: string;
  inkStateJson: string;
  history: ChoiceHistoryItem[];
  dialogueHistory: DialogueHistoryItem[];
};
```

### 映射规则

- `version` -> `version`
- `savedAt` -> `savedAt`
- `chapterName` -> `chapterName`
- `sceneName` -> `sceneName`
- `inkStateJson` -> `inkStateJson`
- `history` -> `history`
- `dialogueHistory` -> `dialogueHistory`

额外补充云端字段：

- `userId`
- `slotId`
- `createdAt`
- `updatedAt`

---

## 业务约束

### 一、每个用户最多 6 个当前槽位

固定为：

- `slotId = 1..6`

不在第一版扩展成动态槽位数量。

### 二、每个用户每个槽位只保留 1 条有效文档

业务约束是：

- 同一个 `userId`
- 同一个 `slotId`
- 最终只有 1 条当前生效记录

第一版不做历史版本保留，不做多版本快照集合。

### 三、覆盖策略

保存某个槽位时：

1. 先按 `userId + slotId` 查询是否已有记录
2. 若存在：
   - 更新该记录
3. 若不存在：
   - 新建记录

不要每次保存都新增一条新文档，否则后面读档会变成取“最新一条”，不必要地增加复杂度。

---

## 推荐读取方式

### 一、列出当前用户所有槽位

按当前用户查询：

- `userId == 当前用户 ID`

然后按：

- `slotId` 升序

最终前端补齐空槽位。

### 二、读取单个槽位

按：

- `userId == 当前用户 ID`
- `slotId == 指定槽位`

返回唯一记录。

### 三、删除槽位

按：

- `userId == 当前用户 ID`
- `slotId == 指定槽位`

删除对应文档。

---

## 时间字段口径

第一版所有时间字段统一使用：

- ISO 字符串

例如：

```ts
new Date().toISOString()
```

这样做的原因是：

1. 当前本地存档已经这么做
2. 前后端映射最简单
3. 方便直接比较和显示

---

## 示例文档

```json
{
  "userId": "uid_xxx",
  "slotId": 1,
  "version": 1,
  "chapterName": "第一章",
  "sceneName": "章台殿",
  "inkStateJson": "{...}",
  "history": [],
  "dialogueHistory": [],
  "savedAt": "2026-04-19T12:34:56.000Z",
  "createdAt": "2026-04-19T12:34:56.000Z",
  "updatedAt": "2026-04-19T12:34:56.000Z"
}
```

---

## 命名约束

后续一律使用以下命名：

- 集合名：`save_slots`
- 字段名：camelCase

即：

- `chapterName`
- `sceneName`
- `inkStateJson`
- `dialogueHistory`

不要混入：

- `chapter_name`
- `scene_name`
- `ink_state_json`

---

## 本步完成判定

当以下条件都满足时，Step 4 可视为完成：

1. 已确认集合名为 `save_slots`
2. 已确认文档结构
3. 已确认 `userId + slotId` 的业务唯一性
4. 已确认保存即覆盖的策略
5. 后续代码与规则均按该文档执行

---

## 下一步依赖

Step 5 配置安全规则时，需要直接围绕以下字段工作：

- `userId`
- `slotId`

Step 9 写云存档读写时，需要直接围绕以下集合与结构工作：

- `save_slots`
- `CloudSaveSlot`
