import React, { useState } from 'react';
import { Key, ArrowRight, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!inputKey.trim().startsWith('AIza')) {
      setError('请输入有效的 Google Gemini API Key (以 AIza 开头)');
      return;
    }
    onSave(inputKey.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-lg">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">欢迎使用封面工坊</h2>
          <p className="text-primary-100 text-sm">Gemini 3.0 驱动的爆款生成器</p>
        </div>
        
        <div className="p-8">
          <p className="text-slate-600 mb-6 text-center text-sm">
            为了开始生成，请提供您的 Google Gemini API Key。您的密钥仅保存在本地浏览器中，绝不会上传至任何第三方服务器。
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setError('');
                }}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            <button
              onClick={handleSave}
              disabled={!inputKey}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              开始创作 <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            <span>安全存储在 LocalStorage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;