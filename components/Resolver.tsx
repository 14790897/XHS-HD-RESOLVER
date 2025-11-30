import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Download,
  Image as ImageIcon,
  Link as LinkIcon,
  Copy,
  CheckCircle2,
  AlertCircle,
  Zap,
  History,
  Trash2
} from 'lucide-react';
import { Button, Input, Switch, Card } from './ui';
import { resolveXhsUrl, triggerDownload } from '../utils/xhsLogic';
import { ResolutionResult, TEST_CASE_URL } from '../types';
import { getBooleanCookie, setBooleanCookie } from '../utils/cookies';

const AUTO_DOWNLOAD_COOKIE = 'xhs_auto_download';

export const Resolver: React.FC = () => {
  const { t } = useTranslation();
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<ResolutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoDownload, setAutoDownload] = useState(() => getBooleanCookie(AUTO_DOWNLOAD_COOKIE, true));
  const [history, setHistory] = useState<ResolutionResult[]>([]);
  const [copied, setCopied] = useState(false);

  // Persist autoDownload state to cookie
  useEffect(() => {
    setBooleanCookie(AUTO_DOWNLOAD_COOKIE, autoDownload);
  }, [autoDownload]);

  const handleResolve = useCallback(() => {
    setError(null);
    setCopied(false);
    
    if (!inputUrl.trim()) {
      setError(t('input.error.empty'));
      return;
    }

    const resolved = resolveXhsUrl(inputUrl);

    if (!resolved) {
      setError(t('input.error.invalid'));
      setResult(null);
      return;
    }

    const newResult: ResolutionResult = {
      originalInput: inputUrl,
      traceId: resolved.traceId,
      hdUrl: resolved.url,
      timestamp: Date.now(),
    };

    setResult(newResult);
    
    // Add to history (prevent duplicates at the top)
    setHistory(prev => {
      const filtered = prev.filter(h => h.traceId !== newResult.traceId);
      return [newResult, ...filtered].slice(0, 10); // Keep last 10
    });

  }, [inputUrl, t]);

  // Auto download effect
  useEffect(() => {
    if (autoDownload && result) {
      // Small timeout to allow UI to update first
      const timer = setTimeout(() => {
        triggerDownload(result.hdUrl, `xhs_${result.traceId}`);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [result, autoDownload]);

  const copyToClipboard = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result.hdUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const handleClear = () => {
    setInputUrl('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 md:p-6 lg:p-8">
      
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-xhs-brand to-red-600 shadow-lg shadow-red-200">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {t('app.title')}
        </h1>
        <p className="mx-auto max-w-lg text-slate-500">
          {t('app.subtitle')}
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-6 md:p-8 border-t-4 border-t-xhs-brand">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">{t('input.label')}</label>
              <button 
                onClick={() => setInputUrl(TEST_CASE_URL)}
                className="text-xs font-medium text-xhs-brand hover:underline"
              >
                {t('input.fillTestCase')}
              </button>
            </div>
            <Input 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder={t('input.placeholder')}
              className="font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleResolve()}
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Switch 
              checked={autoDownload} 
              onCheckedChange={setAutoDownload} 
              label={t('input.autoDownload')}
            />
            <div className="flex gap-3 w-full sm:w-auto">
              {inputUrl && (
                <Button variant="ghost" onClick={handleClear} className="flex-1 sm:flex-none">
                  {t('input.clear')}
                </Button>
              )}
              <Button onClick={handleResolve} icon={ArrowRight} className="flex-1 sm:flex-none w-full sm:w-32 shadow-md shadow-red-100">
                {t('input.resolve')}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Result Section */}
      {result && (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
          <Card className="overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-slate-700">{t('result.success')}</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left: Preview */}
              <div className="space-y-4">
                <div className="aspect-square relative rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center group">
                  {/* Checkerboard pattern for transparency */}
                  <div className="absolute inset-0 opacity-20" 
                       style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
                  </div>
                  
                  <img 
                    src={result.hdUrl} 
                    alt="Resolved Content" 
                    className="relative z-10 max-h-full max-w-full object-contain shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  <a 
                    href={result.hdUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 z-20 bg-black/70 hover:bg-black/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {t('result.viewOriginal')}
                  </a>
                </div>
              </div>

              {/* Right: Actions & Info */}
              <div className="space-y-6 flex flex-col justify-center">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('result.traceId')}</label>
                  <div className="font-mono text-xs bg-slate-100 p-2 rounded border border-slate-200 text-slate-600 break-all">
                    {result.traceId}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('result.hdUrl')}</label>
                  <div className="relative">
                    <div className="font-mono text-xs bg-slate-50 p-3 pr-10 rounded-lg border border-slate-200 text-slate-700 break-all max-h-24 overflow-y-auto custom-scrollbar">
                      {result.hdUrl}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-slate-300" 
                    onClick={copyToClipboard}
                    icon={copied ? CheckCircle2 : Copy}
                  >
                    {copied ? t('result.copied') : t('result.copyLink')}
                  </Button>
                  <Button 
                    className="flex-1 shadow-md shadow-red-100"
                    onClick={() => triggerDownload(result.hdUrl, `xhs_${result.traceId}`)}
                    icon={Download}
                  >
                    {t('result.download')}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <History className="h-5 w-5 text-slate-400" />
              {t('history.title')}
            </h2>
            <button 
               onClick={() => setHistory([])}
               className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" /> {t('history.clear')}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {history.map((item) => (
              <div 
                key={item.traceId} 
                className={`bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-4 transition-colors hover:border-red-200 cursor-pointer ${result?.traceId === item.traceId ? 'ring-2 ring-red-100 border-red-200' : ''}`}
                onClick={() => {
                  setResult(item);
                  setInputUrl(item.originalInput);
                  setError(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="h-12 w-12 shrink-0 rounded bg-slate-100 border border-slate-200 overflow-hidden">
                   <img src={item.hdUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{item.traceId}</p>
                  <p className="text-xs text-slate-500 truncate">{new Date(item.timestamp).toLocaleTimeString()}</p>
                </div>
                <LinkIcon className="h-4 w-4 text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="text-center text-slate-400 text-xs py-8">
        <p>{t('app.disclaimer')}</p>
        <p className="mt-1">{t('app.compatibility')}</p>
      </div>

    </div>
  );
};
