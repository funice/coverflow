import React, { useState, useEffect } from 'react';
import { STORAGE_KEY_API } from './constants';
import { GeneratorState, Platform } from './types';
import { generateCover, editCover } from './services/geminiService';
import ApiKeyModal from './components/ApiKeyModal';
import ImageUpload from './components/ImageUpload';
import PlatformSelector from './components/PlatformSelector';
import TagSelector from './components/TagSelector';
import { Sparkles, Download, ArrowLeft, Send, Loader2, Edit3, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  // Global State
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [view, setView] = useState<'setup' | 'result'>('setup');
  
  // Generator State
  const [genState, setGenState] = useState<GeneratorState>({
    mainTitle: '',
    subTitle: '',
    platform: Platform.DOUYIN,
    subjectImage: null,
    styleImage: null,
    customPrompt: '',
    selectedTags: [],
  });

  // Result & Processing State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [editInstruction, setEditInstruction] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Initialize Key
  useEffect(() => {
    const storedKey = localStorage.getItem(STORAGE_KEY_API);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY_API, key);
    setApiKey(key);
  };

  const handleGenerate = async () => {
    if (!apiKey) return;
    if (!genState.mainTitle) {
      setError('请输入主标题');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateCover(apiKey, genState);
      setResultImage(result);
      setView('result');
    } catch (err: any) {
      setError(err.message);
      // Reset API key if invalid (simple heuristic)
      if (err.message.includes('403') || err.message.includes('key')) {
         localStorage.removeItem(STORAGE_KEY_API);
         setApiKey(null);
         setError("API Key 无效或已过期，请重新输入。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!apiKey || !resultImage || !editInstruction) return;

    setIsEditing(true);
    setError(null);
    try {
      const result = await editCover(apiKey, resultImage.base64, editInstruction);
      setResultImage(result);
      setEditInstruction('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsEditing(false);
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = `data:${resultImage.mimeType};base64,${resultImage.base64}`;
    link.download = `cover-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!apiKey) {
    return <ApiKeyModal onSave={handleSaveKey} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
               <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              Gemini 封面工坊
            </h1>
          </div>
          <button 
            onClick={() => { localStorage.removeItem(STORAGE_KEY_API); setApiKey(null); }}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            切换 Key
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-[shake_0.5s_ease-in-out]">
            <span className="font-bold">出错啦:</span> {error}
          </div>
        )}

        {view === 'setup' && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Configuration */}
              <div className="md:col-span-7 space-y-8">
                
                {/* Section 1: Content */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs">1</span>
                    内容设定
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">主标题 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="例如：3天赚够100万"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none font-bold text-lg"
                        value={genState.mainTitle}
                        onChange={e => setGenState({...genState, mainTitle: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">副标题</label>
                      <input
                        type="text"
                        placeholder="例如：保姆级实操教程"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none"
                        value={genState.subTitle}
                        onChange={e => setGenState({...genState, subTitle: e.target.value})}
                      />
                    </div>
                  </div>
                </section>

                {/* Section 2: Platform */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs">2</span>
                    发布平台
                  </h2>
                  <PlatformSelector 
                    selected={genState.platform} 
                    onChange={p => setGenState({...genState, platform: p})} 
                  />
                </section>

                {/* Section 3: Fine-tuning */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs">3</span>
                    细节调整
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">风格标签</label>
                      <TagSelector 
                        selectedTags={genState.selectedTags} 
                        onChange={tags => setGenState({...genState, selectedTags: tags})} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">AI 指令 (可选)</label>
                      <textarea
                        placeholder="例如：背景要是红色的，文字要发光，整体感觉要非常夸张..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none resize-none h-24 text-sm"
                        value={genState.customPrompt}
                        onChange={e => setGenState({...genState, customPrompt: e.target.value})}
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Visuals & Action */}
              <div className="md:col-span-5 flex flex-col gap-6">
                 {/* Visual Assets */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs">4</span>
                    视觉素材
                  </h2>
                  <div className="space-y-6">
                    <ImageUpload 
                      label="主体图 (可选)" 
                      helperText="如：人物自拍、产品图"
                      image={genState.subjectImage}
                      onImageChange={img => setGenState({...genState, subjectImage: img})}
                    />
                    <ImageUpload 
                      label="风格参考图 (可选)" 
                      helperText="如：想模仿的爆款封面"
                      image={genState.styleImage}
                      onImageChange={img => setGenState({...genState, styleImage: img})}
                    />
                  </div>
                </section>

                {/* Submit Action */}
                <div className="sticky bottom-6 mt-auto">
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-500/30 transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        AI 正在生成...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        立即生成封面
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'result' && resultImage && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <button 
              onClick={() => setView('setup')}
              className="mb-4 flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4" /> 返回修改参数
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Image Display */}
              <div className="lg:col-span-7">
                <div className="bg-white p-2 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden relative group">
                  <div className="relative rounded-2xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-100">
                     <img 
                      src={`data:${resultImage.mimeType};base64,${resultImage.base64}`} 
                      alt="Generated Cover" 
                      className="w-full h-auto object-contain max-h-[70vh] mx-auto"
                    />
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={downloadImage}
                      className="bg-white/90 backdrop-blur text-slate-800 px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-primary-50 hover:text-primary-600 flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" /> 下载原图
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar: Edit & Download */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Download Card (Mobile Friendly duplicate) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center lg:text-left">
                  <h3 className="font-bold text-lg mb-2 text-slate-800">满意这个结果吗？</h3>
                  <p className="text-slate-500 text-sm mb-4">图片已生成为 8K 高清画质，适合直接发布。</p>
                  <button 
                    onClick={downloadImage}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" /> 保存到相册
                  </button>
                </div>

                {/* AI Editor */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-4 text-primary-600">
                    <Edit3 className="w-5 h-5" />
                    <h3 className="font-bold text-lg text-slate-800">AI 智能修图</h3>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={editInstruction}
                      onChange={(e) => setEditInstruction(e.target.value)}
                      placeholder="觉得哪里不对？直接告诉我。例如：&#10;“把标题颜色改成黄色”&#10;“背景换成城市夜景”&#10;“人物再放大一点”"
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none resize-none h-32 text-sm"
                    />
                    <button 
                      onClick={handleEdit}
                      disabled={!editInstruction || isEditing}
                      className="absolute bottom-3 right-3 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEditing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 text-center">
                    提示：AI 会基于当前图片进行微调，请描述具体修改需求。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                   <div className="bg-white p-1.5 rounded-lg text-blue-500 shadow-sm mt-0.5">
                     <ImageIcon className="w-4 h-4" />
                   </div>
                   <div>
                     <h4 className="font-bold text-sm text-blue-900">创作灵感</h4>
                     <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                       如果标题文字不够突出，试着让 AI “把标题加粗，增加发光效果”。如果背景太杂，试着说 “虚化背景”。
                     </p>
                   </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;