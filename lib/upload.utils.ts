export interface UploadResult {
  url: string;
  name: string;
  size: number;
  key: string;
}

export const uploadFileWithPresignedUrl = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {

  const total = file.size;
  let loaded = 0;
  const step = total / 10;

  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    loaded += step;
    if (onProgress) {
      onProgress(Math.round((loaded * 100) / total));
    }
  }

  return {
    url: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    key: `mock-key-${file.name}`,
  };
};
