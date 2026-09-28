# 数据格式与维护指南（开发向）

用户只需看 [README.md](../README.md)；本文面向想理解数据、贡献数据或二次开发的开发者。

## 数据格式

`agents.jsonl` 每行一个 JSON 对象，字段顺序固定：

```jsonl
{"name":"codex","display":"Codex","website":"https://openai.com/codex","icon":"icons/codex-color.svg","repo":"https://github.com/openai/codex","stars":126881,"skills_dir":{"env_home":{"var":"CODEX_HOME","default":".codex","path":"skills"}},"detect":[{"env_home":{"var":"CODEX_HOME","default":".codex"}},{"system":"/etc/codex"}]}
```

### 字段说明

| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | string | 唯一机器标识符 |
| `display` | string | 人类可读展示名 |
| `website` | string \| null | 官网地址；无官网的兜底条目为 `null` |
| `icon` | string \| null | 仓库相对路径 `icons/<file>` 或完整 `https://` URL；未确认为 `null` |
| `repo` | string \| null | 开源仓库地址；仅当产品源码开源时填写（文档/issue 仓库不算），闭源为 `null` |
| `stars` | number \| null | 开源仓库 star 数（采集快照，千位为约数）；`repo` 为 `null` 时为 `null` |
| `skills_dir` | object | 全局 skills 目录定位方式（四种互斥写法，见下） |
| `detect` | array | 安装检测条件，**满足任一即视为已安装** |

### `skills_dir` 的四种定位方式（互斥）

| 写法 | 解析规则 | 示例 |
|---|---|---|
| `{"home": ".cursor/skills"}` | 相对用户主目录 `~/` | `~/.cursor/skills` |
| `{"config": "opencode/skills"}` | 相对配置目录（`$XDG_CONFIG_HOME` 或 `~/.config`） | `~/.config/opencode/skills` |
| `{"env_home": {"var":"CODEX_HOME","default":".codex","path":"skills"}}` | 环境变量（缺省 `default`）下拼 `path` | `$CODEX_HOME/skills` |
| `{"env_var": {"var":"EVE_GLOBAL_SKILLS_DIR"}}` | 直接使用该环境变量指向的目录 | `$EVE_GLOBAL_SKILLS_DIR` |

### `detect` 的检测键

| 键 | 检测含义 |
|---|---|
| `home` | 用户主目录下存在该标志路径 |
| `cwd` | 当前工作目录下存在该标志路径 |
| `config` | 配置目录下存在该标志路径 |
| `env_home` | 环境变量（或其默认值）指向的目录存在 |
| `env_var` | 环境变量指向的路径存在 |
| `system` | 系统级路径存在（如 `/etc/codex`） |

### 与上游的关系

目录数据源自 [skill-one/agents-skills `agents.jsonl`](https://github.com/skill-one/agents-skills/blob/main/src/core/agents.jsonl)，本项目追加 `website` / `icon` / `repo` / `stars` 字段，并将其 `global` 字段更名为 `skills_dir`（语义不变）。同步上游数据时需做一行字段映射。

## 图标策略

- 一品牌一文件：同产品的区域版/CLI 版复用父品牌图标（如 `qoder-cn` → `icons/qoder-color.svg`），`icon` 字段显式指向实际文件
- 来源：LobeHub 图标库矢量 SVG（`-color` 彩色/单色）、GitHub 组织头像 PNG、官网 favicon/logo
- 质量规则（参考 skill-one）：只收官方品牌图；identicon、个人照片、占位符一律拒绝——错误图标比缺失更糟
- `icon: null` 不做回退假设，由消费端自行决定展示方式
- 图标仅用于标识目的，版权归各自所有者

### 暗色 / 亮色模式

SVG 是静态文件，**没有任何自动换色机制**；能否双模式使用取决于图形自身颜色与背景的对比度。文件名即兼容性约定：

| 文件形态 | 数量 | 兼容性 |
|---|---|---|
| `*-color.svg` | 22 | 双模式正常（品牌色在黑/白背景上均有足够对比度） |
| `*.png` | 37 | 双模式正常（色彩已烘焙） |
| 其余单色 `*.svg`（无 `-color` 后缀） | 13 | 黑色 glyph，仅亮色模式正常；暗色模式下消费端需自行反色（CSS `filter: invert(1)`）或内联渲染时改用 `currentColor` |

两个已知例外/说明：

- `kimi-color.svg`：白色 K + 透明底，**亮色模式**下白色部分会消失，消费端需垫深色底
- 单色版仅在该品牌无彩色版时收录（LobeHub 无对应 `-color` 变体）

以上兼容性结论沿用 skill-one 对同批素材的双背景渲染核验。

## 添加新 Agent

1. `agents.jsonl` 末尾追加一行（`website`/`icon`/`repo`/`stars` 可先 `null`）：

```jsonl
{"name":"my-agent","display":"My Agent","website":null,"icon":null,"repo":null,"stars":null,"skills_dir":{"home":".my-agent/skills"},"detect":[{"home":".my-agent"}]}
```

2. （可选）补充官网、开源仓库、图标 `icons/<file>`
3. 提交 PR

收录标准：**真实存在 + 有官方来源 + 有真实用户迹象**（如开源仓库 star ≥ 100、正式官网、产品化运营）。

发布新版本：打 tag 并创建 Release（附件含 `agents.jsonl`）。

## 相关文档

- [DESIGN.md](DESIGN.md) — 仓库结构设计
- [AUDIT.md](AUDIT.md) — 数据核查记录（逐条来源核验、删除记录、star 扫描）
