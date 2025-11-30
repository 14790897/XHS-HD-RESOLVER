import React from 'react';
import { useTranslation } from 'react-i18next';
import { Resolver } from './components/Resolver';
import { Button } from './components/ui';
import { Languages } from 'lucide-react';

function App() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-red-100 selection:text-red-900">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-xhs-brand"></div>
            <span className="font-bold text-slate-900">{t('app.title')}</span>
          </div>
          <nav className="flex gap-4 items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLanguage}
              className="text-slate-500 hover:text-slate-900"
            >
              <Languages className="h-4 w-4 mr-1" />
              {i18n.language === 'en' ? '中文' : 'English'}
            </Button>
            <a 
              href="https://github.com/14790897/XHS-HD-RESOLVER" 
              target="_blank" 
              rel="noreferrer" 
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {t('app.github')}
            </a>
          </nav>
        </div>
      </header>

      <main>
        <Resolver />
      </main>
    </div>
  );
}

export default App;
