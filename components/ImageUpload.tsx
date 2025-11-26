import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageData } from '../types';

interface ImageUploadProps {
  label: string;
  image: ImageData | null;
  onImageChange: (data: ImageData | null) => void;
  helperText?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, image, onImageChange, helperText }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for Gemini API (keep pure base64)
        const base64Data = base64String.split(',')[1];
        onImageChange({
          base64: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      
      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative h-32 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
            ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}
          `}
        >
          <div className="p-3 bg-white rounded-full shadow-sm mb-2">
            <Upload className={`w-5 h-5 ${isDragging ? 'text-primary-500' : 'text-slate-400'}`} />
          </div>
          <p className="text-xs text-slate-500 font-medium">点击或拖拽上传</p>
          {helperText && <p className="text-[10px] text-slate-400 mt-1">{helperText}</p>}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="relative h-32 w-full rounded-xl overflow-hidden group shadow-sm border border-slate-200">
          <img 
            src={`data:${image.mimeType};base64,${image.base64}`} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => onImageChange(null)}
              className="p-2 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white flex items-center gap-1">
             <ImageIcon className="w-3 h-3" /> 已上传
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;