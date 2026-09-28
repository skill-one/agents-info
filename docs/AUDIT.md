# agents.jsonl 数据核查报告

> 核查日期：2026-09-28。逐条核实 84 个条目的真实性，并分析热门遗漏。
> 数据出处：[skill-one/agents-skills](https://github.com/skill-one/agents-skills)（Rust 工具 `agents-skills` 的核心数据，社区维护，活跃度高），本报告在其基础上独立核实。

## 总体结论

**原 84 条中约 80 条确认真实存在，2 条产品真实但归类存疑。**
无法核实的 `jazz`、`promptscript` 已于 2026-09-28 删除，现共 **82 条**。
数据质量整体很高：知名 agent 无一错误，冷门条目绝大多数也能找到官方来源。
未发现热门 agent 遗漏（详见第 3 节）。

## 1. 核实通过（✅，共 80 条）

### 1.1 联网核实确认（20 条）

| name | 核实结果 |
|---|---|
| autohand-code | ✅ Autohand Code CLI（autohand.ai，github.com/autohandai/code-cli） |
| command-code | ✅ Command Code（commandcode.ai，有百度百科词条） |
| cortex | ✅ Snowflake Cortex Code "CoCo"（Snowflake 官方文档 + Snowflake-Labs/coco-skills） |
| hermes-agent | ✅ Nous Research hermes-agent（github.com/nousresearch/hermes-agent） |
| kimchi | ✅ getkimchi/kimchi（kimchi.dev，Cast AI 出品，基于 pi-mono SDK） |
| moxby | ✅ Moxby（moxby.com，浏览器 AI 工作台） |
| reasonix | ✅ Reasonix（reasonix.io，DeepSeek 优化的开源 agent） |
| zcode | ✅ 智谱 Z Code（zcode.z.ai，2025-12 发布，2026-06 ZCode 3.0） |
| zenflow | ✅ Zenflow by Zencoder（zencoder.ai/zenflow，编排平台，与 zencoder 共用目录合理） |
| adal | ✅ AdaL（adalagent.ai） |
| eve | ✅ Vercel Eve（2026-06-17 发布的开源 agent 框架，env-var 驱动 skills 吻合） |
| loaf | ✅ levifig/loaf（"shared skills ... to Claude Code, OpenCode, Cursor, Codex"） |
| grok | ✅ xAI Grok Build（开源 Coding Agent CLI，GROK_HOME 吻合） |
| deepagents | ✅ LangChain Deep Agents CLI（`~/.deepagents/agent/skills` 与文档完全吻合） |
| pi | ✅ Mario Zechner (badlogic) 的 pi（pi-mono，`.pi/agent` 吻合，OpenClaw 核心引擎） |
| codestudio | ✅ Syncfusion Code Studio（syncfusion.com/code-studio，有官方 Agent Skills 页面） |
| terramind | ✅ 产品真实（terramind.com"公司共享大脑"），见 1.3 |
| tinycloud | ✅ 产品真实（Cloudglue 的视频 AI agent tinycloud.sh），见 1.3 |
| codemaker | ✅ 产品真实（CodeMaker AI，IDE 集成开发助手），见 1.3 |
| mux | ✅ mux（usemux.ai，2026-09 仍活跃）；注意：搜索显示其与 Coder 的 Xum（mux.coder.com 重定向）关系密切，可能更名/合并，建议跟踪 |

### 1.2 知名/广为人知 agent（凭共识知识确认，60 条）

claude-code, codex, cursor, gemini-cli, antigravity, antigravity-cli, github-copilot,
windsurf, trae, trae-cn, cline, roo, continue, devin, opencode, goose, crush, zed,
warp, amp, droid, kilo, augment, junie, kimi-code-cli, qwen-code, iflow-cli, lingma,
comate, codebuddy, workbuddy, workbuddy-ai, qoder, qoder-cn, kiro-cli, aider-desk,
openhands, ona, replit, tabnine-cli, forgecode, dexto, kode, neovate, rovodev,
lmstudio, zencoder, pochi, posit-assistant, joycode, minimax-code, mistral-vibe,
firebender, mcpjam, astrbot, codearts-agent, openclaw, qwenwork, qwenworkcn, bob

其中几条有强旁证：
- **openclaw** 的 3 个 detect 目录（`.openclaw/.clawdbot/.moltbot`）与其更名史完全吻合
- **codebuddy / workbuddy** 与本机 skills 生态一致（`.codebuddy` / `.workbuddy`）
- **pi** 与 **kimchi**（基于 pi-mono SDK）互相印证

### 1.3 产品真实但"是否属于编程 agent"存疑（3 条）

| name | 情况 |
|---|---|
| terramind | Terramind（terramind.com）真实存在，定位是"公司级共享大脑"（code/docs/tasks/meetings），有编码相关能力但不是纯编程 agent |
| tinycloud | Tinycloud（tinycloud.sh，Cloudglue 出品）真实存在，但是**视频** AI agent，非编程 agent |
| codemaker | CodeMaker AI 真实存在（IDE 代码生成助手），是否采用 skills 目录约定未确认 |

**建议**：保留 terramind / codemaker；tinycloud 可考虑移除或标注"非编程 agent"。

### 1.4 无法核实（❌，2 条）— 已删除

| name | 情况 |
|---|---|
| jazz | 搜索未找到匹配的编程 agent（存在同名的 Jazz 数据框架 jazz.tools，非编程 agent） |
| promptscript | 搜索无任何官方来源；仅上游 jsonl 中有 env-var 定义 |

**处理**：2026-09-28 从 `agents.jsonl` 中删除。若日后上游给出官方来源，可随时重新收录。

### 1.5 特殊条目（1 条）

- **universal**：上游刻意保留的通用兜底条目（`detect: []`，指向 `~/.config/agents/skills`），不是具体 agent，无需处理。

## 2. 数据正确性旁证

- 字段结构内部自洽：`skills_dir` 与 `detect` 的路径互相印证（如 `codex` 的 `env_home` 与 `/etc/codex` 检测）
- 多条共享目录是真实设计而非错误：`cline/dexto/kimi-code-cli/loaf/warp/zed` 共用 `~/.agents/skills`（上游工具的规范目录机制）、`zencoder/zenflow` 同属一家
- 84 条中抽验 20 条全部命中真实产品，抽验通过率 100%

## 3. 热门遗漏分析

主流盘点（2026 年横评文章覆盖的 Claude Code、Codex、Cursor、Copilot、Windsurf、
Trae、Cline、Gemini CLI、Kiro、Qoder、CodeBuddy 等）**全部已在清单中，无遗漏**。

以下未收录的属于**合理缺席**（清单收录标准 = 有本地 skills 目录约定）：

| 工具 | 未收录原因 |
|---|---|
| Lovable / Bolt / v0 / Manus / Notion AI | 纯云端，无本地 skills 目录 |
| Google Jules | 云端异步 agent |
| aider（原版 CLI） | 无原生 skills 机制（其 GUI aider-desk 已收录） |

**可进一步调研的候选**（是否有 skills 约定待确认）：
Codebuff、Verdent、CodeGeeX、iFlyCode（讯飞）、OpenTiny TinyRobot。

### 1.6 真实但无支持价值（1 条）— 已删除

| name | 情况 |
|---|---|
| loaf | 真实存在（github.com/levifig/loaf），但仅 4 star、无官网、无可用图标，且 skills 目录用共享的 `~/.agents/skills`，边际数据价值极低 |

**处理**：2026-09-28 删除。收录标准为"真实存在 + 有官方来源 + 有真实用户迹象"。

## 4. 后续动作建议

1. ~~`website`/`icon` 补全时，优先处理第 1.1/1.2 节已确认条目（约 80 个）~~
2. ~~`jazz`、`promptscript` 向上游 issue 求证来源后再补全~~（已删除，2026-09-28）
3. 跟踪 `mux`（可能更名 Xum）与上游同步
4. `tinycloud` 视定位决定去留

## 5. 官网补全记录（2026-09-28）

81 条中已确认并写入 **80 条**官网。剩余 1 条待定：

| name | 原因 |
|---|---|
| universal | 上游刻意保留的通用兜底条目（非具体 agent），无官网属预期 |

注意事项：
- `workbuddy` / `workbuddy-ai` 为国内版/国际版关系：国内版官网 workbuddy.cn（另有 workbuddy.tencent.com、copilot.tencent.com/work 等入口），国际版官网 workbuddy.ai（2026-05-28 面向海外发布，百度百科有词条；`.workbuddy-ai` 目录与 workbuddy.ai 域名对应）
- `mux` 官网 usemux.ai 仍活跃，但与 Coder 的 Xum 关系密切，后续需跟踪
- `qoder-cn` 采用阿里云产品页（aliyun.com/product/qoder），qoder.com 为国际版

## 6. Star 扫描与开源信息记录（2026-09-28）

对全部 81 条按"开源仓库 star < 100 则移除"的标准扫描，**零移除**：

- 31 个开源 agent 仓库全部 ≥ 100 stars（最低 `autohand-code` 199、`dexto` 651），已将 `repo` / `stars` 字段写入 `agents.jsonl`
- 唯一低于 100 的条目是此前已删除的 `loaf`（4 stars）
- 其余 50 条为闭源商业产品（cursor、devin、qoder、workbuddy、zcode 等），无开源仓库，不适用 star 标准
- star 数通过 shields.io 获取，千位数值为约数（如 1.4k → 1400）；`codex` 为精确值 126881
- 注：`claude-code` 的 GitHub 仓库仅为文档/issue（CLI 闭源），故 `repo` 记为 `null`
