import React, { useState, useRef, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { IFile } from '../../types/product.interface';
import { uploadFileWithPresignedUrl } from '@/lib/upload.utils';

interface FileUploadComponentProps {
  title: string;
  description: string;
  icon: React.ElementType;
  uploadFieldName: string;
  onFileUpload: (fileInfo: IFile | null) => void;
  accept?: string;
  // folder?: string; // Removed
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  title,
  description,
  icon: Icon,
  // uploadFieldName,
  onFileUpload,
  accept,
  // folder, // Removed
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<IFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (uploadedFileInfo) {
      const timer = setTimeout(() => {
        setUploadedFileInfo(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [uploadedFileInfo]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadError(null);
      setUploadedFileInfo(null);
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const result = await uploadFileWithPresignedUrl(
        file,
        (progress) => setUploadProgress(progress)
      );

      const fileInfo: IFile = {
        url: result.url,
        name: result.name,
        size: result.size,
      };
      setUploadedFileInfo(fileInfo);
      onFileUpload(fileInfo);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Upload failed:', error);
      const message = error.message || 'File upload failed.';
      setUploadError(message);
      onFileUpload(null); // Report failure to parent
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
        disabled={uploading}
      />
      <div
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 bg-[#1A1A1A] p-6 text-center transition-colors duration-200 min-h-[200px] overflow-hidden ${uploading ? 'cursor-not-allowed opacity-70' : ''
          } ${uploadError
            ? 'border-red-500/50'
            : 'border-dashed border-gray-700 hover:border-gray-600 hover:bg-[#262626]'
          }`}
      >
        {uploading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1A1A1A]/90 rounded-lg">
            <Loader2 className="h-10 w-10 animate-spin text-[#643446] mb-3" />
            <p className="text-sm font-medium text-white">Uploading...</p>
            <div className="w-3/4 mt-2 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#643446]"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{uploadProgress}%</p>
          </div>
        )}


        {!uploading && uploadedFileInfo && !uploadError && (
          <>
            <CheckCircle className="h-10 w-10 text-green-500 mb-3" />
            <h3
              className="font-medium text-white text-sm truncate max-w-full px-2"
              title={uploadedFileInfo.name}
            >
              {uploadedFileInfo.name}
            </h3>
            <p className="text-xs text-gray-400">
              (
              {uploadedFileInfo.size
                ? (uploadedFileInfo.size / (1024 * 1024)).toFixed(2) + ' MB'
                : 'Size unknown'}
              )
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Added! Ready for next file.
            </p>
          </>
        )}

        {!uploading && !uploadedFileInfo && (
          <>
            {uploadError ? (
              <AlertCircle className="mb-3 h-10 w-10 text-red-500" />
            ) : (
              <Icon className="mb-3 h-10 w-10 text-gray-500" />
            )}
            <h3
              className={`font-medium ${uploadError ? 'text-red-400' : 'text-white'
                }`}
            >
              {uploadError ? 'Upload Failed' : title}
            </h3>
            <p className="text-sm text-gray-400">{uploadError || description}</p>
            <button
              type="button"
              onClick={triggerFileInput}
              className={`mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white ${uploadError
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-600 hover:bg-gray-700'
                }`}
            >
              {uploadError ? 'Try Again' : 'Choose File'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};