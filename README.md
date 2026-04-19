# 胡亥模拟器

代码驱动的文字/视觉小说原型。前端使用 Vite + React + TypeScript，剧情使用 Ink，临时立绘素材由 `image_temp/` 中的照片抠图生成。

## 前端命令

安装依赖：

```bash
npm --cache ./.npm-cache install
```

编译 Ink 剧情：

```bash
npm --cache ./.npm-cache run story:build
```

启动开发预览：

```bash
npm --cache ./.npm-cache run dev -- --host 127.0.0.1
```

构建生产产物：

```bash
npm --cache ./.npm-cache run build
```

预览生产产物：

```bash
npm --cache ./.npm-cache run preview -- --host 127.0.0.1
```

## CloudBase 自动部署

项目现使用 **GitHub Actions + CloudBase CLI** 自动部署到 CloudBase 静态网站托管，不再依赖控制台里的 Git 自动触发。

工作流文件：

```text
.github/workflows/deploy-cloudbase-hosting.yml
```

触发方式：

- push 到 `master`
- GitHub Actions 手动执行 `workflow_dispatch`

需要在 GitHub 仓库 `Settings -> Secrets and variables -> Actions` 中配置以下 Secrets：

```text
TCB_SECRET_ID
TCB_SECRET_KEY
TCB_ENV_ID
```

说明：

- `TCB_SECRET_ID` / `TCB_SECRET_KEY`：腾讯云 API 密钥的 `SecretId` / `SecretKey`
- `TCB_ENV_ID`：CloudBase 环境 ID，例如 `test-d7gmoq0dn303446ba`
- 工作流会在构建时自动注入：
  - `VITE_CLOUDBASE_ENV_ID = TCB_ENV_ID`
  - `VITE_APP_ENV = production`

部署流程：

1. `npm ci`
2. `npm run build`
3. `tcb login --apiKeyId ... --apiKey ...`
4. `tcb hosting deploy ./dist -e $TCB_ENV_ID`

注意：

- CloudBase 静态托管默认域名仍需加入 CloudBase 控制台的跨域设置。
- 如果后续切换分支策略，需要同步修改工作流里的 `push.branches`。

## 抠图环境

抠图工具使用项目内 `.venv`，缓存和模型也都放在本目录内，不写入全局 Python 环境。

创建虚拟环境：

```bash
UV_CACHE_DIR=.uv-cache uv venv .venv
```

安装抠图依赖：

```bash
UV_CACHE_DIR=.uv-cache uv pip install "rembg[cpu]" pillow
```

生成临时立绘：

```bash
UV_CACHE_DIR=.uv-cache U2NET_HOME=.u2net uv run --python .venv/bin/python python scripts/cutout_portraits.py
```

输入图片：

```text
image_temp/胡亥.jpg
image_temp/赵高.jpg
image_temp/李斯.jpg
```

输出素材：

```text
public/images/portraits/huhai/photo_cutout.png
public/images/portraits/zhao_gao/photo_cutout.png
public/images/portraits/li_si/photo_cutout.png
```

说明：

- `UV_CACHE_DIR=.uv-cache`：把 uv 缓存限制在当前项目。
- `U2NET_HOME=.u2net`：把 rembg 模型文件限制在当前项目。
- `.venv`、`.uv-cache`、`.u2net` 已加入 `.gitignore`。
- 当前照片只作为临时素材使用，抠图效果取决于原图清晰度、水印和背景复杂度。
