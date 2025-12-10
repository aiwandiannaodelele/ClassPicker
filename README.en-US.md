# ClassPicker

<p align="center">
  <strong>A clean, modern, and powerful random name picker tool.</strong>
  <br />
  Powered by Next.js, shadcn/ui, and Tailwind CSS.
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

## ✨ Core Features

- **Modern Tech Stack**: Built with **Next.js** (App Router), **React**, and **TypeScript**, ensuring project mastertainability and scalability.
- **Elegant UI**: Carefully crafted with **shadcn/ui** and **Tailwind CSS** to deliver a beautiful, consistent, and responsive user interface.
- **Powerful Functionality**:
    - **Dual Mode Selection**: Supports both **student ID range** and **TXT file roster import** modes.
    - **Advanced Options**: Provides advanced features like "Instant Mode" and "No Repeats".
    - **Multi-language Support**: Built-in **Simplified Chinese** and **English** switching, with easy extensibility for more languages.
- **Smooth Animations**: Integrates subtle and elegant loading animations and hover effects to enhance the overall user experience.
- **Static Export**: Supports full static export, making it easy to deploy to any static website hosting platform (e.g., Vercel, GitHub Pages, Netlify, etc.).

## 🚀 Quick Start

### 1. Requirements

- [Node.js](https://nodejs.org/en) (v18.17 or higher)
- [pnpm](https://pnpm.io/installation) (recommended), `npm`, or `yarn`

### 2. Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/aiwandiannaodelele/ClassPicker.git
    cd ClassPicker
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```
    Now, open `http://localhost:3000` in your browser to see the running application.

### 3. Build and Deploy

1.  **Build static files**
    ```bash
    npm run build
    ```
    This command will generate an `out` folder containing all HTML, CSS, and JavaScript files that can be deployed independently.

2.  **Local Preview**
    You can use any static file server to preview the build result. For example, using `http-server`:
    ```bash
    npx http-server out
    ```

3.  **Deploy**
    Upload all contents of the `out` folder to your chosen static hosting service.

## 🐳 Docker

If you have Docker installed, you can easily build and run the application using Docker Compose.

1.  **Build and start the container**
    ```bash
    docker-compose up --build
    ```

2.  **Access the application**
    Open `http://localhost:3000` in your browser.

3.  **Stop the container**
    ```bash
    docker-compose down
    ```

## 🛠️ Project Structure

```
.
├── app/                  # Next.js App Router core directory
│   ├── page.tsx          # master page component
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   ├── favicon.ico       # Website favicon
│   └── manifest.ts       # PWA manifest configuration
├── components/           # React Components
│   ├── ui/               # shadcn/ui components directory (e.g., button, dialog, input, etc.)
│   └── ...               # Other custom components (e.g., AppInitializer, TitleBar, etc.)
├── contexts/             # React Contexts
│   └── LanguageContext.tsx # Language context
├── hooks/                # Custom React Hooks
│   └── useLocalStorage.ts  # Hook for local storage
├── lib/                  # Utility functions and configuration files
│   ├── fonts.ts          # Font configuration
│   ├── i18n.ts           # Internationalization translation texts and configuration
│   ├── tauri.d.ts        # Tauri type definitions
│   └── utils.ts          # General utility functions (e.g., cn)
├── public/               # Static assets directory
│   ├── manifest.json     # PWA manifest file
│   ├── sw.js             # Service Worker file
│   ├── sounds/           # Sound effect files
│   └── ...               # Other static images, icons, etc.
├── 教程/                 # Project related tutorials and documentation (Chinese for "Tutorials")
├── next.config.ts        # Next.js configuration file
├── tailwind.config.ts    # Tailwind CSS configuration file
├── tsconfig.json         # TypeScript configuration file
├── package.json          # Package management configuration file
└── ...                   # Other configuration files (e.g., .eslintrc.js, postcss.config.mjs, etc.)
```

## 📄 License

This project is licensed under the [MIT License](./LICENSE). Contributions and suggestions are welcome!

---

✨ With ClassPicker, random selection has never been easier and more enjoyable!
