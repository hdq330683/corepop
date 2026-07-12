# CorePop

> core（核心/硬核） + pop（流行/出圈） — 硬核内容，自由表达。

基于 VitePress 构建的个人知识分享站点，支持 Markdown 文件拖拽上传，自动部署到腾讯云 COS。

## 项目结构

```
corepop/
├── .vitepress/
│   ├── config.mts          # VitePress 主配置（主题/导航/侧边栏/OG标签）
│   └── theme/index.ts      # 主题扩展
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions 自动部署到腾讯云 COS
├── public/
│   ├── admin/index.html    # 文件上传管理后台
│   └── images/             # 图片资源（logo、分享封面图）
├── works/                  # 板块1：工作复盘
├── guides/                 # 板块2：资料整理
├── articles/               # 板块3：深度思考
├── ai-experience/          # 板块4：工具实践
├── index.md                # 首页
└── about.md                # 关于页面
```

## 本地开发

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (http://localhost:5173)
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
```

## 上线前待完成的配置

### 1. 创建 GitHub 仓库
- 在 GitHub 创建公开仓库，名称：`corepop`
- 推送代码：`git remote add origin <仓库地址> && git push -u origin main`

### 2. 创建 GitHub OAuth App（上传后台认证）
- GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
- Homepage URL: `https://corepop.cn`
- Callback URL: `https://corepop.cn/admin/`
- 记录 **Client ID**，替换 `public/admin/index.html` 中的 `GITHUB_CLIENT_ID`

### 3. 配置 GitHub Secrets（自动部署）
在仓库 Settings → Secrets → Actions 添加：
- `TENCENT_SECRET_ID`：腾讯云 API 密钥 ID
- `TENCENT_SECRET_KEY`：腾讯云 API 密钥
- `COS_BUCKET`：COS 存储桶名称（如 `corepop-1300533487`）
- `COS_REGION`：存储桶地域（如 `ap-shanghai`）

### 4. 腾讯云 COS 配置
- 创建 COS 存储桶（公有读私有写）
- 开启静态网站托管（索引文档: `index.html`）
- 绑定 CDN 加速域名 + SSL 证书（免费）

### 5. 域名 ICP 备案
- 登录腾讯云 → 网站备案 → 个人备案
- 网站名称：CorePop
- 备案通过后（7-20工作日）绑定自定义域名

### 6. 替换占位符
在以下文件中搜索并替换占位符：
- `.vitepress/config.mts`：域名已替换为 `corepop.cn`
- `public/admin/index.html`：GitHub OAuth Client ID 待替换

## 内容发布流程

```
WorkBuddy/本地写 .md → 打开 corepop.cn/admin → 拖拽上传 → 填写板块/排序 → 点发布 → 2-3分钟后上线
```

## 技术栈

- **VitePress**：Vue 驱动的静态站点生成器
- **GitHub Actions**：自动构建部署
- **腾讯云 COS**：静态网站托管 + CDN 加速
- **GitHub OAuth**：后台认证
