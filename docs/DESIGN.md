# agents-info 设计（极简版）

> 对外提供 AI Coding Agents（Codex / Claude Code / WorkBuddy…）的元信息：
> 标识、skills 目录、官网、图标。**仓库即分发**：用户直接拉取本仓库文件使用。

## 1. 原则

- 不引入 npm 包、HTTP 服务、构建产物等任何分发层——仓库里的文件就是最终交付物
- 数据只有一个源文件，杜绝多文件同步问题
- skills 目录 / detect 数据复用上游 [skill-one/agents-skills `agents.jsonl`](https://github.com/skill-one/agents-skills/blob/main/src/core/agents.jsonl) 的成熟格式（84 个 agent），本项目只富化 `website` / `icon` 两个字段
- schema 基于上游，仅做一处更名：`global` → `skills_dir`（本清单只有全局一层，`global` 的"作用域"含义冗余且不自解释；同步上游数据时做一行字段映射即可）

## 2. 文件结构（核心设计）

```
agents-info/
├── README.md          # 使用入口：字段说明 + 多语言使用示例 + 新增 agent 流程
├── agents.jsonl       # ★ 唯一数据源：每行一个 agent
├── icons/
│   ├── codex.svg      # 文件名 = agent 的 name，零映射成本
│   ├── claude-code.svg
│   └── ...
└── docs/
    └── DESIGN.md      # 本文档
```

**为什么是"一个 JSONL + 一个图标目录"：**

| 决策 | 理由 |
|---|---|
| 单文件 `agents.jsonl` 而非每代理一个文件 | 用户 `grep`/`jq` 一个文件即可查任何 agent；新增 agent = 追加一行，git diff 清晰；与上游格式一致，同步成本低 |
| JSONL 而非 JSON 数组 | 逐行追加/逐行 diff；jq、Python、TS 均可三行内解析（见 README 示例）；上游同格式可直接对照 |
| `icons/` 一品牌一文件，变体复用父品牌 | 同产品区域版/CLI 版共用一个图标文件（如 `qoder-cn` → `qoder-color.svg`），`icon` 字段显式指向实际文件，无需运行时映射 |
| 图标缺失时不建占位文件 | 数据行中 `icon: null`，消费端回退通用图形/首字母色块；错误图标比缺失更糟 |

## 3. 数据格式

每行一个 JSON 对象（字段说明见 README）：

```jsonl
{"name":"codex","display":"Codex","website":"https://openai.com/codex","icon":"icons/codex.svg","skills_dir":{"env_home":{"var":"CODEX_HOME","default":".codex","path":"skills"}},"detect":[{"env_home":{"var":"CODEX_HOME","default":".codex"}},{"system":"/etc/codex"}]}
```

- `name` / `display` / `skills_dir` / `detect`：语义沿用上游（`skills_dir` 即上游的 `global`）
- `website`：官网，允许 `null`（待补全）
- `icon`：仓库相对路径 `icons/<name>.svg` 或完整 `https://` URL，允许 `null`

## 4. 用户使用方式（README 中给出对应示例）

```bash
# 查单个 agent
jq -c 'select(.name=="codex")' agents.jsonl
grep '"name":"workbuddy"' agents.jsonl
```

```python
import json
agents = {a["name"]: a for a in map(json.loads, open("agents.jsonl"))}
```

```ts
import agents from "./agents.jsonl" with { type: "json" }; // 或逐行 JSON.parse
```

图标：本地 `icons/codex.svg`，或远程
`https://raw.githubusercontent.com/<org>/agents-info/main/icons/codex.svg`。

## 5. 维护流程

- **新增 agent**：`agents.jsonl` 追加一行（website/icon 可先 null）+ 可选放一个 `icons/<name>.svg`
- **同步上游目录变更**：对照上游 agents.jsonl 手工更新对应行的 `global`/`detect`（84 条变更频率低，暂不需要脚本；未来条目多了再加一个 `scripts/sync` 也不影响用户）
- **README 即文档**：字段表 + 使用示例 + 新增流程都写在 README，用户拉下来先看它

## 6. 分期

- **M1**：README + `agents.jsonl`（全量导入上游 84 条，website/icon 置 null）+ `icons/` 目录
- **M2**：逐批补齐 website / icon（可按知名度优先：codex、claude-code、cursor、workbuddy…）
