# ClassPicker

<p align="center">
  <strong>一款简洁、现代且功能强大的随机点名工具。</strong>
  <br />
  由 Next.js, shadcn/ui, 和 Tailwind CSS 驱动。
</p>

<!-- Language Links -->
<p align="center">
  语言 / Languages:
  <a href="./README.md">简体中文</a> |
  <a href="./README.en-US.md">English</a>
</p>

<p align="center">
  <a href="https://github.com/aiwandiannaodelele/ClassPicker/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/aiwandiannaodelele/ClassPicker" alt="License">
  </a>
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white" alt="Next.js">
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" alt="React">
  </a>
  <a href="https://ui.shadcn.com/">
    <img src="https://img.shields.io/badge/shadcn/ui-black?logo=shadcnui&logoColor=white" alt="shadcn/ui">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  </a>
</p>

## ✨ 核心特性

- **现代技术栈**: 基于 **Next.js** (App Router), **React**, 和 **TypeScript** 构建，保证了项目的可维护性和扩展性。
- **优雅的 UI**: 使用 **shadcn/ui** 和 **Tailwind CSS** 精心构建，提供美观、一致且响应式的用户界面。
- **强大的功能**:
    - **双模式选择**: 支持 **学号范围** 和 **TXT 文件名单导入** 两种模式。
    - **高级选项**: 提供“瞬间模式”和“不允许重复”等高级功能。
    - **多语言支持**: 内置**简体中文**和**英文**切换，轻松扩展更多语言。
- **流畅的动画**: 集成了微妙且优雅的加载动画和悬停效果，提升了整体用户体验。
- **静态导出**: 支持完全静态导出，可以轻松部署到任何静态网站托管平台（如 Vercel, GitHub Pages, Netlify 等）。

## 🚀 快速开始

### 1. 环境要求

- [Node.js](https://nodejs.org/en) (v18.17 或更高版本)
- [pnpm](https://pnpm.io/installation) (推荐), `npm`, 或 `yarn`

### 2. 本地开发

1.  **克隆仓库**
    ```bash
    git clone https://github.com/aiwandiannaodelele/ClassPicker.git
    cd ClassPicker
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **启动开发服务器**
    ```bash
    npm run dev
    ```
    现在，在浏览器中打开 `http://localhost:3000` 即可看到正在运行的应用。

### 3. 构建与部署

1.  **构建静态文件**
    ```bash
    npm run build
    ```
    这个命令会生成一个 `out` 文件夹，其中包含了所有可以独立部署的 HTML, CSS, 和 JavaScript 文件。

2.  **本地预览**
    您可以使用任何静态文件服务器来预览构建结果。例如，使用 `http-server`:
    ```bash
    npx http-server out
    ```

3.  **部署**
    将 `out` 文件夹中的所有内容上传到您选择的任何静态托管服务即可。

## 🛠️ 项目结构

```
.
├── app/                  # Next.js App Router 核心目录
│   ├── page.tsx          # 主页面组件
│   ├── layout.tsx        # 根布局
│   ├── globals.css       # 全局样式
│   ├── favicon.ico       # 网站图标
│   └── manifest.ts       # PWA manifest 配置
├── components/           # React 组件
│   ├── ui/               # shadcn/ui 组件目录 (如 button, dialog, input 等)
│   └── ...               # 其他自定义组件 (如 AppInitializer, TitleBar 等)
├── contexts/             # React Contexts
│   └── LanguageContext.tsx # 语言上下文
├── hooks/                # 自定义 React Hooks
│   └── useLocalStorage.ts  # 用于本地存储的 Hook
├── lib/                  # 工具函数和配置文件
│   ├── fonts.ts          # 字体配置
│   ├── i18n.ts           # 国际化翻译文本与配置
│   ├── tauri.d.ts        # Tauri 类型定义
│   └── utils.ts          # 通用工具函数 (如 cn)
├── public/               # 静态资源目录
│   ├── manifest.json     # PWA manifest 文件
│   ├── sw.js             # Service Worker 文件
│   ├── sounds/           # 音效文件
│   └── ...               # 其他静态图片、图标等资源
├── 教程/                 # 项目相关教程和文档
├── next.config.ts        # Next.js 配置文件
├── tailwind.config.ts    # Tailwind CSS 配置文件
├── tsconfig.json         # TypeScript 配置文件
├── package.json          # 包管理配置文件
└── ...                   # 其他配置文件 (如 .eslintrc.js, postcss.config.mjs 等)
```

## 📄 开源协议

本项目采用 [MIT License](./LICENSE)。欢迎任何形式的贡献和建议！

---

✨ 使用 ClassPicker，让随机选择变得前所未有的简单和愉悦！
