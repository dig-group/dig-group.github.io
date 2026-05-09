---
name: dig-content-update
description: DIG 官网内容更新规范。用于维护 showcase-data.js、图片资源、WebP 预览图和上线前检查。
---

# DIG 官网内容更新规范

当用户要更新 DIG 官网内容时，按本 Skill 执行。目标是让成员、论文、研究方向、活动和图片更新流程稳定、可复查、不会破坏静态部署。

## 适用场景

使用本 Skill 处理以下任务：

- 新增、删除或修改成员信息
- 新增、删除或修改论文成果
- 新增、删除或修改研究方向
- 新增、删除或修改组内活动
- 新增图片、替换图片、压缩图片或生成 WebP
- 上线前检查 DIG 展示页

## 项目关键文件

- `showcase.html`：新版展示页入口
- `showcase-data.js`：新版页面数据源
- `showcase-app.js`：页面渲染和交互逻辑
- `showcase-style.css`：页面样式
- `convert-images-to-webp.py`：批量生成 WebP 预览图
- `image/people/`：成员头像
- `image/research/`：研究方向图片
- `image/activities/`：活动照片

默认优先维护 `showcase-data.js` 和 `image/`，不要把内容直接写死到 `showcase.html`。

## 总体流程

1. 先确认用户要更新的模块：成员、论文、研究方向、活动、图片或多个模块。
2. 阅读 `showcase-data.js` 中对应数据结构。
3. 修改数据或图片路径。
4. 如果新增或替换了 jpg/png/gif 图片，运行 WebP 生成脚本。
5. 检查页面使用 WebP 预览图，点击放大仍使用原图。
6. 运行基础语法检查。
7. 本地预览 `showcase.html`。
8. 汇报修改内容和验证结果。

## 更新成员 People

成员数据在 `showcase-data.js` 的 `members` 数组中。

### 字段规范

每个成员对象应包含：

```js
{
  name: "姓名",
  role: "Master Student (2025)",
  category: "master2025",
  img: "image/people/name.jpg",
  description: "研究方向：...",
  url: "#team"
}
```

### category 取值

- `faculty`
- `phd`
- `master2025`
- `master2024`
- `master2023`

如需新增年份，例如 `master2026`：

1. 在 `showcase-data.js` 中使用新 category。
2. 在 `showcase-app.js` 的成员筛选按钮列表中加入新类别。
3. 本地检查筛选按钮和成员卡片是否正常。

### 新增成员步骤

1. 将头像原图放入 `image/people/`。
2. 文件名使用小写英文、拼音或稳定 ID，避免空格和特殊符号。
3. 在 `showcase-data.js` 的 `members` 数组中新增对象。
4. 运行：

```bash
python convert-images-to-webp.py
```

5. 确认生成同名 `.webp`。
6. 打开 `showcase.html` 检查头像、筛选、搜索。

## 更新论文 Publications

论文数据在 `showcase-data.js` 的 `publications` 数组中。

### 字段规范

```js
{
  title: "论文标题",
  authors: [
    { name: "Guiyuan Jiang*", isGroupMember: true },
    { name: "External Author", isGroupMember: false }
  ],
  venue: "期刊/会议信息",
  year: 2026,
  links: [
    { type: "PDF", url: "https://..." }
  ]
}
```

### 更新步骤

1. 按年份倒序插入或保持数据可读顺序。
2. 组内成员 `isGroupMember` 设为 `true`，页面会高亮显示。
3. 链接类型建议使用：`PDF`、`DOI`、`Code`、`Project`。
4. 如果链接暂缺，不要编造 URL；可先留空数组 `links: []`。
5. 本地检查年份筛选、作者高亮和链接跳转。

## 更新研究方向 Research

研究方向数据在 `showcase-data.js` 的 `researchAreas` 数组中。

### 字段规范

```js
{
  id: "stable-id",
  title: "研究方向标题",
  eyebrow: "English / Short Label",
  description: "简短说明",
  image: "image/research/example.jpg",
  tags: ["Tag A", "Tag B"]
}
```

### 更新步骤

1. 将研究配图放到 `image/research/`。
2. 在 `researchAreas` 中新增或修改对象。
3. 运行 WebP 生成脚本。
4. 检查 Research 卡片预览图是否加载 `.webp`。
5. 点击图片，确认 modal 中加载的是原始图片路径。

## 更新活动 Activities

活动数据在 `showcase-data.js` 的 `activities` 数组中。

### 字段规范

```js
{
  id: "act-2026-001",
  year: 2026,
  title: "活动标题",
  date: "2026-05-09",
  description: `第一段文字。

第二段文字。

第三段文字。`,
  images: [
    "image/activities/2026/example_1.jpg",
    "image/activities/2026/example_2.jpg"
  ]
}
```

### 分段规范

- 活动描述用模板字符串反引号 `` `...` ``。
- 段落之间使用一个空行，也就是两个换行 `\n\n`。
- 不要把多段文字压成一行。
- 页面会自动把段落转换为 `<p>` 显示。

### 新增活动步骤

1. 在 `image/activities/<year>/` 下放入活动照片。
2. 图片命名建议使用活动英文简称或日期，例如 `seminar_2026_01.jpg`。
3. 在 `activities` 数组中新增活动对象。
4. `id` 使用稳定唯一值，例如 `act-2026-002`。
5. `images` 第一张图会作为活动卡片封面。
6. 运行 WebP 生成脚本。
7. 本地检查：
   - 年份筛选
   - 活动卡片封面
   - 展开全文
   - 段落显示
   - 点击图片进入画廊
   - 左右切换原图

## 图片更新规范

### 原图与 WebP

项目使用“双图策略”：

- 页面卡片和普通展示加载 `.webp` 预览图。
- 点击放大时加载原始 jpg/png/gif。
- 原图不要删除，因为 modal 依赖原图查看高清版本。

### 新增图片步骤

1. 放入合适目录：
   - 成员头像：`image/people/`
   - 研究图片：`image/research/`
   - 活动图片：`image/activities/<year>/`
2. 运行：

```bash
python convert-images-to-webp.py
```

3. 检查生成同名 `.webp`。
4. 在 `showcase-data.js` 中继续引用原图路径，不要手写 `.webp`。
5. `showcase-app.js` 会自动把预览路径转换为 `.webp`。

### 图片命名建议

- 使用英文、小写、数字、短横线或下划线。
- 避免中文、空格、括号和过长文件名。
- 示例：
  - `li-ming.jpg`
  - `traffic-forum-2026-01.jpg`
  - `graph-attack-demo.png`

## 上线前检查

每次内容更新后至少执行：

```bash
node --check showcase-app.js
node --check showcase-data.js
```

如果修改了图片，检查所有源图都有 WebP：

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

### 浏览器检查清单

- 首屏没有明显溢出或遮挡。
- 导航锚点跳转正确。
- Research 图片可放大。
- Team 合照可放大。
- People 搜索和筛选正常。
- Publications 年份筛选正常。
- Activities 年份筛选正常。
- Activities 文字展开后保留分段。
- Activities 图片画廊可打开、左右切换、Esc 关闭。
- 控制台没有 JavaScript 错误。
- Network 面板中卡片预览优先加载 `.webp`。

## 汇报模板

完成更新后，向用户汇报：

```text
已完成 <模块> 更新：
- 修改了 <文件/数据项>
- 新增/替换了 <图片数量> 张图片
- 已生成 WebP 预览图
- 已通过 JS 语法检查
- 已本地预览检查 <关键交互>
```

## 注意事项

- 不要删除原图。
- 不要把内容直接写死进 `showcase.html`。
- 不要为了小更新引入构建工具。
- 不要编造论文链接、人员主页或外部 URL。
- 修改 `index.html` 前必须确认用户是否要同步旧版页面。
