#!/usr/bin/env node
// 从 agents.jsonl 生成用户向 README.md（总览表 + 目录结构 + 数据结构）
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const agents = readFileSync(root + "agents.jsonl", "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l))
  .sort((a, b) => a.display.toLowerCase().localeCompare(b.display.toLowerCase()));

const cell = (a) => {
  const icon = a.icon ? `<img src="${a.icon}" width="18" valign="middle" /> ` : "";
  const name = a.website ? `[${a.display}](${a.website})` : a.display;
  return icon + name;
};

const cols = 4;
const rows = Math.ceil(agents.length / cols);
let table = `| ${Array(cols).fill("").join(" | ")} |
|${Array(cols).fill(" --- ").join("|")}|`;
for (let i = 0; i < rows; i++) {
  const cells = Array.from(
    { length: cols },
    (_, j) => (agents[i * cols + j] ? cell(agents[i * cols + j]) : ""),
  );
  table += `\n| ${cells.join(" | ")} |`;
}

const iconCount = readdirSync(root + "icons").filter((f) => f !== ".gitkeep").length;
const openCount = agents.filter((a) => a.repo).length;

const example = JSON.stringify(
  agents.find((a) => a.name === "codex"),
);

const md = `# agents-info

AI Coding Agents 元信息集合：${agents.length} 个 agent（Codex、Claude Code、WorkBuddy、Cursor…）的 skills 目录、官网、图标、开源仓库。拉取本仓库直接使用。

## Agent 总览

${table}

## 目录结构

\`\`\`
agents-info/
├── agents.jsonl   # 数据：每行一个 agent
├── icons/         # 图标 ${iconCount} 个：路径见各条目的 icon 字段
├── scripts/       # gen-readme.mjs：重新生成本 README
└── docs/          # SCHEMA.md 数据结构详解 · DESIGN.md 设计说明 · AUDIT.md 数据核查记录
\`\`\`

## agents.jsonl 数据结构

每行一个 JSON 对象：

\`\`\`jsonl
${example}
\`\`\`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| \`name\` | string | 唯一标识符 |
| \`display\` | string | 展示名 |
| \`website\` | string \\| null | 官网 |
| \`icon\` | string \\| null | 图标路径（仓库相对路径或 https URL） |
| \`repo\` | string \\| null | 开源仓库地址（仅产品源码开源时填写；共 ${openCount} 个） |
| \`stars\` | number \\| null | 仓库 star 数快照（千位为约数） |
| \`skills_dir\` | object | 全局 skills 目录定位规则（home / config / env_home / env_var 四种写法） |
| \`detect\` | array | 安装检测条件，满足任一即视为已安装 |

字段语义、\`skills_dir\` 定位与 \`detect\` 检测键的完整说明见 [docs/SCHEMA.md](docs/SCHEMA.md)。

## License

MIT
`;

writeFileSync(root + "README.md", md);
console.log(`README written: ${agents.length} agents`);
