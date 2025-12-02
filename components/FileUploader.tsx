import React, { useRef, useState } from 'react';
import { UploadedFile, DocumentCategory, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface FileUploaderProps {
  id: string;
  label: string;
  description: string;
  category: DocumentCategory;
  files: UploadedFile[];
  onFilesAdded: (newFiles: UploadedFile[]) => void;
  onFileRemove: (fileId: string) => void;
  multiple?: boolean;
  optional?: boolean;
  lang: Language;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  id,
  label,
  description,
  category,
  files,
  onFilesAdded,
  onFileRemove,
  multiple = false,
  optional = false,
  lang,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const associatedFiles = files.filter(f => f.category === category && f.id.startsWith(id));
  const t = TRANSLATIONS[lang];
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const processFiles = (fileList: File[]) => {
      const newFiles: UploadedFile[] = fileList.map((file: File) => ({
        id: `${id}-${Date.now()}-${Math.random()}`,
        file,
        category,
        mimeType: file.type,
        previewUrl: URL.createObjectURL(file),
      }));
      onFilesAdded(newFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <>
    <div className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                {category === 'IDENTITY' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                {category === 'BANKING' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>}
                {['INCOME', 'BUSINESS', 'TAX', 'CONTRACT', 'ASSET', 'LAND', 'AGRICULTURE', 'INVESTMENT', 'ADDITIONAL', 'SPOUSE', 'PROFESSIONAL'].includes(category) && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-800 leading-tight">
                    {label}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{description}</p>
            </div>
        </div>
        {optional && <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-medium text-slate-500">{t.optional}</span>}
      </div>
      
      <div 
        className={`relative transition-all duration-300 cursor-pointer border-2 border-dashed ${isDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30'} rounded-xl p-4`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
             {associatedFiles.length === 0 ? (
                 <div className="py-3">
                    <div className="text-indigo-500 font-medium text-sm mb-1 flex items-center gap-2 justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        {multiple ? t.addFile : t.upload}
                    </div>
                    <p className="text-[10px] text-slate-400">Support JPG, PNG, PDF</p>
                 </div>
             ) : (
                 <div className="w-full space-y-2">
                    {associatedFiles.map((file) => (
                        <div 
                            key={file.id} 
                            onClick={(e) => {
                                e.stopPropagation();
                                if(file.previewUrl) setPreviewImage(file.previewUrl);
                            }} 
                            className="flex items-center justify-between bg-white px-3 py-2.5 rounded-lg shadow-sm border border-slate-100 group/file hover:border-indigo-200"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 relative">
                                    {file.previewUrl ? (
                                        <img src={file.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover/file:bg-black/10 transition-colors flex items-center justify-center">
                                        <svg className="opacity-0 group-hover/file:opacity-100 text-white drop-shadow-md" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-700 truncate">{file.file.name}</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFileRemove(file.id);
                                }}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    ))}
                    {multiple && (
                         <div className="text-xs text-indigo-600 font-medium py-2 hover:underline">
                             + {t.addFile}
                         </div>
                    )}
                 </div>
             )}
        </div>
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple={multiple}
          onChange={handleFileChange}
        />
      </div>
    </div>

    {/* Image Preview Modal */}
    {previewImage && (
        <div 
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setPreviewImage(null)}
        >
            <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
                <img src={previewImage} alt="Full preview" className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain bg-white" />
                <button 
                    className="absolute -top-12 right-0 md:top-4 md:right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                    onClick={() => setPreviewImage(null)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white text-xs rounded-full backdrop-blur">
                    Click anywhere to close
                </div>
            </div>
        </div>
    )}
    </>
  );
};