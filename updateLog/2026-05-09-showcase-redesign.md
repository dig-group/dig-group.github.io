# 2026-05-09 DIG 官网 Showcase 重构与性能优化

## 修改时间

2026-05-09

## 修改目的

原官网主要内容集中在 `index.html` 单文件中，展示方式较传统，后续维护和扩展不够清晰。本次更新目标是：

- 新建一个更现代、更具视觉交互感的 DIG 展示页
- 保留旧版 `index.html`，避免直接破坏原站点
- 提升图片加载速度
- 规范后续内容维护流程
- 为后续维护人员提供项目文档、内容更新规范和变更记录入口

## 修改内容

### 1. 新增 Showcase 页面

新增以下文件：

- `showcase.html`
- `showcase-style.css`
- `showcase-app.js`
- `showcase-data.js`

新版页面包含以下模块：

- Hero 首屏
- Lab Snapshot 实验室概览
- Research Universe 研究方向
- People 团队成员
- Publications 论文成果
- Activities 组内活动
- Contact 联系信息

页面采用静态 HTML + CSS + 原生 JavaScript 实现，不引入新的构建系统。

### 2. 抽取并整理页面数据

将展示页数据集中维护在 `showcase-data.js` 中，包括：

- `members`
- `publications`
- `activities`
- `researchAreas`

后续内容更新优先维护 `showcase-data.js`，避免继续把数据散落在 HTML 中。

### 3. 优化视觉与交互

新增或优化的交互包括：

- Hero canvas 粒子背景
- 滚动进入动画
- Lab Snapshot 数字计数动画
- Research 卡片 hover 动效
- Research 图片点击放大
- People 搜索与筛选
- Publications 年份筛选
- Activities 年份筛选
- Activities 展开全文
- Activities 图片画廊
- 团队合照点击放大查看原图
- modal 支持左右切换和 Esc 关闭

### 4. 修复用户反馈问题

根据反馈进行了针对性修复：

- Hero 首屏内容溢出并被切割
- Research Universe 图片无法点击放大
- Lab Life 活动文字无法展开全文
- 章节标题视觉中心偏左
- Activities 活动描述段落被压成一段

### 5. 图片 WebP 优化

新增脚本：

- `convert-images-to-webp.py`

对 `image/` 下所有 jpg/png/gif 源图生成同名 `.webp` 预览图。

页面加载策略调整为：

- 普通展示优先加载 `.webp` 预览图
- 点击放大时加载原始 jpg/png/gif 文件
- 原图保留不删除

代表性压缩结果：

- `image/members_2025.jpg`：约 6817 KB → `image/members_2025.webp` 约 192 KB
- `image/research/1-3.gif`：约 7378 KB → `image/research/1-3.webp` 约 61 KB
- `image/activities/2025/huaweiCup_1.jpg`：约 2846 KB → `image/activities/2025/huaweiCup_1.webp` 约 144 KB

### 6. 新增项目文档

新增并更新：

- `README.md`

内容包括：

- 项目目标
- 目录结构
- 页面说明
- 内容更新规范入口
- 本地预览方式
- 图片策略
- 基础检查方式
- 后续迁移建议

### 7. 新增内容维护 Skill

新增：

- `.claude/skills/dig-content-update/SKILL.md`

该 Skill 文档规范了后续维护流程：

- 更新成员 People
- 更新论文 Publications
- 更新研究方向 Research
- 更新活动 Activities
- 新增或替换图片
- 生成 WebP 预览图
- 上线前检查
- 汇报模板

### 8. 新增更新日志目录

新增：

- `updateLog/README.md`
- `updateLog/2026-05-09-showcase-redesign.md`

用于记录后续每次更新的时间、目的、内容和结果。

## 修改结果

本次更新完成后：

- 新版展示页可通过 `showcase.html` 独立访问
- 旧版 `index.html` 保留，便于对照和回退
- 页面整体视觉表现更现代，交互更丰富
- 图片展示改为 WebP 预览，大幅降低常规浏览加载体积
- 点击放大仍使用原图，保留高清查看能力
- 团队合照、研究图片、活动图片均支持放大查看
- 活动文字支持展开全文，并保留原有段落结构
- 后续维护有 README、Skill 文档和更新日志作为规范依据

## 相关文件

核心新增或修改文件：

- `showcase.html`
- `showcase-style.css`
- `showcase-app.js`
- `showcase-data.js`
- `convert-images-to-webp.py`
- `README.md`
- `.claude/skills/dig-content-update/SKILL.md`
- `updateLog/README.md`
- `updateLog/2026-05-09-showcase-redesign.md`

图片相关：

- `image/**/*.webp`

## 验证方式

已执行或建议执行的检查：

```bash
node --check showcase-app.js
node --check showcase-data.js
```

检查所有源图片是否有对应 WebP：

```bash
node - <<'NODE'
const fs = require('fs');
const files = [];
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = d + '/' + f;
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(jpg|jpeg|png|gif)$/i.test(p)) files.push(p);
  }
}
walk('image');
const missing = files.filter(f => !fs.existsSync(f.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp')));
console.log('missing webp:', missing.length);
missing.forEach(f => console.log(f));
NODE
```

本地预览：

```bash
python -m http.server 8000
```

访问：

```text
http://localhost:8000/showcase.html
```

浏览器重点检查：

- 首屏无溢出
- Research 图片可放大
- Team 合照可放大
- Activities 文字可展开且保留分段
- Activities 图片画廊可左右切换
- People 搜索和筛选正常
- Publications 年份筛选正常
- 控制台无 JavaScript 错误
- Network 面板中预览图片优先加载 `.webp`

## 后续维护要求

之后如果有其他更新，应同步在 `updateLog/` 下新增日志文件，记录：

- 修改时间
- 修改目的
- 修改内容
- 修改结果
- 相关文件
- 验证方式
