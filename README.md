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
