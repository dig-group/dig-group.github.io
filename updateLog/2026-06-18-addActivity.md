# 2026-06-18 毕业季活动更新

## 修改时间

2026-06-18

## 修改目的

研三毕业，毕业合照，以及新增graduated分类

## 修改内容

新增图片：image/activities/2026/BYJ01-07.jpg/webp

新增推文：showcase-data.js->activities-id:act-2026-002

新增分类：showcase-app.js->['graduated','Graduated']

不过感觉这里应该要扩充一下，现在是一一对应关系，往后应该是graduated_2023/graduated_2024 都归类到graduated里

发现雨行头像显示有误，已经修复。原因是图片命名liyuxing而图片url是liyuhang。

把之前的跳转逻辑删掉了，由于历史遗留原因，老师主页网址访问的是about.html页面,之前一版用html跳转到index了，现在直接把改版后的直接命名为about，就不用跳转了
