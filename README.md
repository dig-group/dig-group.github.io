# DIG Group Showcase

DIG（Data Intelligence Group）官网展示页项目，部署在 GitHub Pages 的纯静态站点。

当前仓库保留了旧版主页 `index.html`，并新增了更偏视觉化、交互化的新展示页 `showcase.html` 供后续迭代与迁移使用。

## 项目目标

- 面向高校数据智能研究组的展示与介绍
- 保持内容清晰、可信、易维护
- 用静态方式实现较强的视觉表现和交互体验
- 避免引入不必要的构建系统，方便 GitHub Pages 直接部署

## 目录结构

```text
index.html                                  旧版主页，仍保留
showcase.html                               新版展示页入口
showcase-style.css                          新版页面样式
showcase-app.js                             新版页面交互逻辑
showcase-data.js                            新版页面数据
convert-images-to-webp.py                   图片批量转 WebP 的辅助脚本
.claude/skills/dig-content-update/SKILL.md  内容更新维护 Skill
image/                                      所有站点图片资源
```

### 主要资源目录

- `image/people/`：成员头像
- `image/research/`：研究方向配图
- `image/activities/`：活动照片
- `image/ouc-dig.png`：站点 Logo / favicon

## 页面说明

### `index.html`

- 旧版单页主页
- 仍可作为备用入口保留
- 主要内容包括：
  - Hero
  - Team
  - Research
  - Publications
  - Activities
  - Contact

### `showcase.html`

- 新版视觉展示页
- 采用静态 HTML + CSS + 原生 JavaScript
- 主要特性：
  - 更强调视觉层次和动效
  - Research 图片可点击放大
  - Activities 支持展开全文和图片画廊
  - 团队合照支持点击放大
  - 默认使用 WebP 预览图，点击放大时加载原图

## 内容更新规范

后续维护内容时，优先使用本仓库内的 Skill 文档：

- `.claude/skills/dig-content-update/SKILL.md`

该文档详细规范了以下流程：

- 更新成员 People
- 更新论文 Publications
- 更新研究方向 Research
- 更新活动 Activities
- 新增或替换图片
- 生成 WebP 预览图
- 上线前检查

维护原则：

- 数据优先维护 `showcase-data.js`
- 样式优先维护 `showcase-style.css`
- 交互优先维护 `showcase-app.js`
- 不要把内容继续写死到 `showcase.html`
- 新增图片后运行 `convert-images-to-webp.py`
- 原图保留，WebP 只作为预览图

## 本地预览

本项目没有构建步骤，直接用静态服务器即可。

### Python

```bash
python -m http.server 8000
```

然后访问：

- `http://localhost:8000/showcase.html`
- `http://localhost:8000/index.html`

## 图片策略

页面采用“双图策略”：

- 页面展示默认加载 `.webp` 预览图
- 点击放大时再加载原始图片文件
- 原图保留，不删除

批量生成 WebP：

```bash
python convert-images-to-webp.py
```

## 基础检查

每次修改后至少运行：

```bash
node --check showcase-app.js
node --check showcase-data.js
```

如果修改了图片，确认源图都有 WebP 版本。

## 建议的后续迁移

如果新版本确认稳定，可考虑：

- 将 `showcase.html` 作为主入口
- 或让 `index.html` 跳转到 `showcase.html`
- 或继续保留双入口，便于维护与回滚

## 许可证

如需正式对外发布，请在此补充项目许可证信息。