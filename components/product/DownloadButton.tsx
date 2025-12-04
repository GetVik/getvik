'use client';

import { IFile } from '@/types/types';
import { Download, File as FileIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { toast } from 'react-hot-toast';

interface DownloadButtonProps {
  files: IFile[];
  productId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DownloadButton({ files, productId: _productId }: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDownload = async (e: React.MouseEvent, fileUrl: string, _fileName: string) => {
    e.preventDefault();
    if (downloadingUrl) return;

    try {
      setDownloadingUrl(fileUrl);

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Download started (Mock)');


    } catch (error: unknown) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    } finally {
      setDownloadingUrl(null);
    }
  };

  if (!files || files.length === 0) {
    return (
      <button
        disabled
        className="flex w-full items-center justify-center rounded-xl bg-[#1A1A1A] border border-[#262626] px-6 py-4 text-base font-medium text-gray-500 cursor-not-allowed"
      >
        No files available
      </button>
    );
  }

  if (files.length === 1) {
    return (
      <button
        onClick={(e) => handleDownload(e, files[0].url, files[0].name)}
        disabled={!!downloadingUrl}
        className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-base font-semibold text-black transition-all hover:bg-gray-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {downloadingUrl === files[0].url ? (
          <Loader2 className="h-5 w-5 animate-spin text-black" />
        ) : (
          <Download className="h-5 w-5 text-black transition-transform group-hover:-translate-y-0.5" />
        )}
        <span>Download Content</span>
      </button>
    );
  }

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-base font-semibold text-black transition-all hover:bg-gray-200 active:scale-[0.98] ${isOpen ? 'ring-2 ring-white/20' : ''}`}
      >
        <Download className="h-5 w-5 text-black transition-transform group-hover:-translate-y-0.5" />
        <span>Download Files ({files.length})</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-20 overflow-hidden rounded-xl border border-[#262626] bg-[#101010]/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {files.map((file, index) => (
              <button
                key={index}
                onClick={(e) => handleDownload(e, file.url, file.name)}
                disabled={!!downloadingUrl}
                className="flex w-full items-center gap-3 border-b border-[#262626] px-5 py-4 text-left text-gray-200 transition-colors hover:bg-white/5 last:border-0 disabled:opacity-50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1A1A1A] border border-[#262626]">
                  <FileIcon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-200">{file.name}</p>
                  <p className="text-xs text-gray-500">Digital file</p>
                </div>
                {downloadingUrl === file.url ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Download className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
