'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function TitleBar() {
  const [isTauri, setIsTauri] = useState(false);
  const [title, setTitle] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const newTitle = t('title');
    setTitle(newTitle);

    const expectedUA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 ClassPicker/1.0.0 (client)";
    if (navigator.userAgent === expectedUA && window.__TAURI__?.window) {
      setIsTauri(true);
      const appWindow = window.__TAURI__.window.getCurrentWindow();
      appWindow.setTitle(newTitle);
    }
  }, [t]);

  const handleMinimize = () => {
    if (window.__TAURI__?.window) {
      window.__TAURI__.window.getCurrentWindow().minimize();
    }
  };

  const handleClose = () => {
    if (window.__TAURI__?.window) {
      window.__TAURI__.window.getCurrentWindow().destroy();
    }
  };

  if (!isTauri) {
    return null;
  }

  return (
    <div data-tauri-drag-region className="fixed top-0 left-0 right-0 h-9 bg-transparent flex justify-between items-center z-50 select-none">
      <div data-tauri-drag-region className="flex items-center pl-2">
        <Image src="/icon.png" alt="App Icon" width={20} height={20} className="mr-2" />
        <span className="text-sm font-sans">{title}</span>
      </div>
      <div className="flex">
        <button onClick={handleMinimize} className="p-2 hover:bg-gray-200 rounded-none cursor-pointer">
          <Minus size={16} />
        </button>
        <button onClick={handleClose} className="p-2 hover:bg-red-500 hover:text-white rounded-none cursor-pointer">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
