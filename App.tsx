import React from 'react';
import { Resolver } from './components/Resolver';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-red-100 selection:text-red-900">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-xhs-brand"></div>
            <span className="font-bold text-slate-900">XHS Resolver</span>
          </div>
          <nav className="flex gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              GitHub
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
