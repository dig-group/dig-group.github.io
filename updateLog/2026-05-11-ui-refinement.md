# 2026-05-11 UI 细节优化与研究方向图片更新

## 修改时间

2026-05-11

## 修改目的

根据实际浏览反馈，对 Team 模块头像布局进行优化；同步更新研究方向配图，提升 Research 卡片视觉表现；同步修正数据中的成员分类和展示文案。

## 修改内容

### 1. Team 模块头像布局优化

**文件：** `showcase-style.css`、`showcase-app.js`

- 头像从矩形撑满改为固定 `120×120px`，居中显示
- 形状从矩形改为圆形 `border-radius: 50%`
- 头像 hover 时轻微放大 `scale(1.06)`
- 姓名、描述、标签字号同步收紧，适配更紧凑的卡片布局
- 保持四列排布不变

### 2. 团队合照悬停动效

**文件：** `showcase-style.css`

- 鼠标悬停在团队合照上时，图片轻微放大 `scale(1.04)`
- 过渡时间 `0.4s`，顺滑不突兀
- 利用已有 `overflow: hidden` 裁切，不额外增加结构

### 3. 成员分类名称修正

**文件：** `showcase-app.js`、`showcase-data.js`

- 将 `faculty` 分类名改为 `Supervisor`
- `renderStats` 统计标签从 "Faculty" 改为 "Supervisor"
- `initMemberControls` 筛选按钮从 "Faculty" 改为 "Supervisor"
- `showcase-data.js` 中姜桂圆、贺佩兰的 `category` 均更新为 `Supervisor`

### 4. 导航与文案修正

**文件：** `showcase.html`

- 导航栏 People → Team
- Team 模块标题从 "Researchers..." 改为 "Team members..."
- Publications 模块标题改为简洁 "Publications"
- Activities 模块标题改为 "山海之间的共同成长"
- Contact 地址补充具体位置 "信息南楼b512"
- HTML 注释中添加实验室提示信息

### 5. 研究方向图片更新

**文件：** `showcase-data.js`

更新了三个研究方向的配图：

| 方向                       | 原图                                | 新图                                                         |
| -------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| 公共交通智能优化与拥堵治理 | `image/research/1-3.gif` (7.4 MB) | `image/research/transportation.png` (362 KB → 29 KB WebP) |
| 软件代码智能分析与优化     | `image/research/cfg.svg`          | `image/research/3pld.png`                                  |
| 人工智能安全与应用         | `image/research/graph_attack.png` | `image/research/security.png`                              |

### 6. 新增辅助脚本与研究图片资源

**新增文件：**

- `conver-img2webp-single.py`：单图转 WebP 辅助脚本
- `image/research/security.png` + `image/research/security.webp`
- `image/research/transportation.png` + `image/research/transportation.webp`

## 修改结果

- Team 模块头像更小巧精致，圆形头像符合社交展示习惯
- 团队合照有轻微悬停动效，增强交互感知
- 成员分类名称更准确（Supervisor）
- 导航文案与页面标题统一为 Team
- 研究方向配图更清晰，加载更快（7.4MB GIF → 29KB WebP）
- Contact 地址信息更完整

## 相关文件

| 文件                                   | 改动类型 |
| -------------------------------------- | -------- |
| `showcase-style.css`                 | 修改     |
| `showcase-app.js`                    | 修改     |
| `showcase-data.js`                   | 修改     |
| `showcase.html`                      | 修改     |
| `conver-img2webp-single.py`          | 新增     |
| `image/research/security.png`        | 新增     |
| `image/research/security.webp`       | 新增     |
| `image/research/transportation.png`  | 新增     |
| `image/research/transportation.webp` | 新增     |

## 验证方式

```bash
node --check showcase-app.js
node --check showcase-data.js
```

本地预览 `http://localhost:8000/showcase.html`，检查：

- Team 模块头像是否为圆形、居中、四列排布
- 团队合照 hover 是否轻微放大
- 筛选按钮是否显示 Supervisor 而非 Faculty
- 三个 Research 卡片图片是否正常加载
- 导航栏和页面标题是否已统一为 Team
