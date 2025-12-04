'use client';

import React from 'react';
import Image from 'next/image';
import { IMedia, IFile } from '@/types/types';
import { FileUploadComponent } from '@/components/ui/FileUploadComponent';
import { ImageIcon, VideoIcon, X, ArrowLeft, ArrowRight, GripVertical } from 'lucide-react';
import { fixR2Url } from '@/lib/image.utils';

interface MediaUploadManagerProps {
  media: IMedia[];
  setMedia: (media: IMedia[]) => void;
}

const MediaPreviewCard: React.FC<{
  item: IMedia;
  onDelete: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  isFirst: boolean;
  isLast: boolean;
}> = ({ item, onDelete, onMoveLeft, onMoveRight, isFirst, isLast }) => {
  return (
    <div className="relative group w-32 h-32 rounded-lg border border-gray-700 overflow-hidden">
      {item.type === 'image' ? (
        <Image
          src={item.isNew ? item.url : fixR2Url(item.url)}
          alt="Product media preview"
          layout="fill"
          objectFit="cover"
        />
      ) : (
        <video
          controls
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={item.isNew ? item.url : fixR2Url(item.url)} type="video/mp4" />
        </video>
      )}

      {/* Overlay for actions */}
      <div className="absolute inset-0 bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
        <div className="flex justify-between">
          {/* Top-left: Type Icon */}
          <div className="p-1 bg-black/50 rounded-full">
            {item.type === 'image' ? (
              <ImageIcon size={14} className="text-white" />
            ) : (
              <VideoIcon size={14} className="text-white" />
            )}
          </div>
          {/* Top-right: Delete */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1 bg-black/50 rounded-full text-red-500 hover:bg-red-500 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>

        {/* Bottom-center: Move Controls */}
        <div className="flex justify-center items-center gap-1">
          <button
            type="button"
            onClick={onMoveLeft}
            disabled={isFirst}
            className="p-1 bg-black/50 rounded-full text-white disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-white/30"
          >
            <ArrowLeft size={14} />
          </button>
          <GripVertical size={14} className="text-white cursor-grab" />
          <button
            type="button"
            onClick={onMoveRight}
            disabled={isLast}
            className="p-1 bg-black/50 rounded-full text-white disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-white/30"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const MediaUploadManager: React.FC<MediaUploadManagerProps> = ({
  media,
  setMedia,
}) => {
  const handleFileUpload = (fileInfo: IFile | null) => {
    if (!fileInfo) return;

    // Determine type based on file name extension
    const fileExtension = fileInfo.name.split('.').pop()?.toLowerCase();
    let type: 'image' | 'video' = 'image'; // Default to image

    if (['mp4', 'webm', 'mov', 'avi'].includes(fileExtension || '')) {
      type = 'video';
    }

    // Fix for R2 URL having incorrect prefix for new uploads
    // Fix for R2 URL having incorrect prefix for new uploads
    const cleanUrl = fixR2Url(fileInfo.url);

    setMedia([...media, { type, url: cleanUrl, isNew: true }]);
  };

  const handleDelete = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= media.length) return;

    const newMedia = [...media];
    const item = newMedia.splice(index, 1)[0];
    newMedia.splice(newIndex, 0, item);
    setMedia(newMedia);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        {media.map((item, index) => (
          <MediaPreviewCard
            key={index}
            item={item}
            onDelete={() => handleDelete(index)}
            onMoveLeft={() => moveItem(index, 'left')}
            onMoveRight={() => moveItem(index, 'right')}
            isFirst={index === 0}
            isLast={index === media.length - 1}
          />
        ))}
      </div>

      <FileUploadComponent
        title="Add Image or Video"
        description="Upload product media (Max 50MB)"
        icon={ImageIcon}
        uploadFieldName="productMedia"
        onFileUpload={handleFileUpload}
        accept="image/*,video/*" // Accept both
      />
    </div>
  );
};