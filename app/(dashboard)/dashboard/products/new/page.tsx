'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  IndianRupee,
  UploadCloud,
  Loader2,
  X,
  FileCheck,
  Trash2,
  AlertCircle,
  Wand2,
} from 'lucide-react';
import { DashboardCard } from '@/components/ui/cards/dashboard/DashboardCard';
import {
  FormLabel,
  FormInput,
  FormTextarea,
} from '@/components/ui/FormControls';
import { createProduct } from '@/services/product.service';
import slugify from 'slugify';
import toast from 'react-hot-toast';
import { IFile, ProductCreationData, IMedia } from '../../../../../types/product.interface';
import { FileUploadComponent } from '@/components/ui/FileUploadComponent';
import { MediaUploadManager } from '@/components/product/MediaUploadManager';

import { useAI } from '@/hooks/useAI';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { htmlToMarkdown } from '@/lib/htmlToMarkdown';
import { detectGenericAIContent, getGenericContentMessage } from '@/lib/aiContentFilter';
import { getErrorMessage } from '@/lib/error-utils';



const TagInput = ({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex min-h-[46px] w-full flex-wrap items-center gap-2 rounded-lg border border-gray-700 bg-[#262626] p-2 transition-all duration-200 focus-within:border-[#643446] focus-within:ring-1 focus-within:ring-[#643446]">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-600 px-2.5 py-1 text-xs font-medium text-white"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="text-gray-400 hover:text-white"
          >
            <X size={14} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tags..."
        className="flex-1 bg-transparent p-1 text-sm text-white placeholder-gray-500 outline-none"
      />
    </div>
  );
};

export default function NewProductPage() {
  const [title, setTitle] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [allowPayWhatYouWant] = useState(false); // setAllowPayWhatYouWant removed
  const [suggestedPrice] = useState<number | ''>(''); // setSuggestedPrice removed
  const [minPrice] = useState<number | ''>(''); // setMinPrice removed
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [maxSales] = useState<number | ''>(''); // setMaxSales removed
  const [callToAction] = useState(''); // setCallToAction removed
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([]);
  const [isListed, setIsListed] = useState(true);
  const [isArchived, setIsArchived] = useState(false);

  const [media, setMedia] = useState<IMedia[]>([]);

  const {
    triggerAutofill,
    isLoading: isAiLoading,
    showUpgradeModal,
    setShowUpgradeModal
  } = useAI();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const generateSlugPreview = () => {
    const slug = customSlug || title;
    return (
      slugify(slug, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }) ||
      'product-link'
    );
  };


  const handleAiAutofill = async () => {
    if (!title.trim()) {
      setError('Please enter a Product Name first to generate content.');
      return;
    }

    const result = await triggerAutofill(title, category);

    if (result) {
      // Convert HTML to Markdown before setting the description
      if (result.description) {
        const markdownDescription = htmlToMarkdown(result.description);

        // Validate that the content is not generic AI marketing fluff
        const filterResult = detectGenericAIContent(markdownDescription, title);

        if (filterResult.isGeneric) {
          const errorMsg = getGenericContentMessage(filterResult);
          setError(errorMsg);
          toast.error('AI generated generic content. Please provide more specific product details.');
          return;
        }

        setDescription(markdownDescription);
      }
      if (result.suggestedPrice) setPrice(result.suggestedPrice);
      if (result.seoTags && Array.isArray(result.seoTags)) {
        setTags((prev) => Array.from(new Set([...prev, ...result.seoTags])));
      }
    }
  };


  const handleProductFileUpload = (fileInfo: IFile | null) => {
    if (fileInfo) {
      setUploadedFiles((prevFiles) => {
        if (!prevFiles.some((f) => f.url === fileInfo.url)) {
          return [...prevFiles, fileInfo];
        }
        return prevFiles;
      });
    }
  };

  const removeProductFile = (urlToRemove: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.url !== urlToRemove));
  };

  const handleSubmit = async (publish: boolean = true) => {
    setIsLoading(true);
    setError(null);

    if (!title.trim()) {
      const errorMsg = 'Product name is required.';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }
    if (price === '' || Number(price) < 0) {
      const errorMsg = 'A valid price (0 or greater) is required.';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }
    if (uploadedFiles.length === 0) {
      const errorMsg = 'At least one product file must be uploaded.';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }
    if (media.length === 0) {
      const errorMsg = 'At least one cover image or video is required.';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }

    try {
      const productData: ProductCreationData = {
        title: title.trim(),
        customSlug: customSlug.trim() || undefined,
        summary: summary.trim() || undefined,
        description: description.trim() || undefined,
        price: Number(price),
        allowPayWhatYouWant: allowPayWhatYouWant || undefined,
        suggestedPrice:
          suggestedPrice !== '' ? Number(suggestedPrice) : undefined,
        minPrice: minPrice !== '' ? Number(minPrice) : undefined,
        files: uploadedFiles,

        media: media,

        category: category.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        status: publish ? 'Active' : 'Draft',
        isListed: isListed,
        isArchived: isArchived,
        maxSales: maxSales !== '' ? Number(maxSales) : undefined,
        callToAction: callToAction.trim() || undefined,
      };

      await createProduct(productData);
      toast.success(`Product ${publish ? 'published' : 'saved as draft'} successfully!`);

      router.push('/dashboard/products');
    } catch (err) {
      console.error('Failed to create product:', err);
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#262626] text-gray-400 transition-all hover:bg-gray-700 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-3xl font-light text-white">Add New Product</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* ... (Product Details card is unchanged) ... */}
          <DashboardCard title="Product Details">
            <div className="flex flex-col gap-6">
              <div>
                <FormLabel htmlFor="title">Product Name *</FormLabel>
                <FormInput
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Ultimate Web Design Course"
                  required
                />
              </div>
              <div>
                <FormLabel htmlFor="slug">Custom Link (Optional)</FormLabel>
                <div className="flex rounded-lg shadow-sm">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-700 bg-gray-800 px-3 text-sm text-gray-400">
                    yourstore.com/p/
                  </span>
                  <FormInput
                    id="slug"
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="rounded-l-none"
                    placeholder="your-custom-link"
                  />
                </div>
                {(title || customSlug) && (
                  <p className="mt-2 text-xs text-gray-500">
                    Preview: yourstore.com/p/{generateSlugPreview()}
                  </p>
                )}
              </div>
              <div>
                <FormLabel htmlFor="summary">Summary (Optional)</FormLabel>
                <FormInput
                  id="summary"
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short description for previews (max 160 chars)"
                  maxLength={160}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Used on storefront previews and social media shares.
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel htmlFor="description" className="mb-0!">
                    Description (Optional)
                  </FormLabel>
                  <button
                    type="button"
                    onClick={handleAiAutofill}
                    disabled={isAiLoading || !title}
                    className="group flex items-center gap-1.5 text-xs font-medium text-purple-400 transition-colors hover:text-purple-300 disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Wand2 size={14} className="transition-transform group-hover:rotate-12" />
                    )}
                    {isAiLoading ? 'Generating...' : 'Auto-fill with AI'}
                  </button>
                </div>
                <FormTextarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product in detail..."
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <FormLabel htmlFor="category">Category (Optional)</FormLabel>
                  <FormInput
                    id="category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., eBook, Template, Course"
                  />
                </div>
                <div>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <TagInput tags={tags} setTags={setTags} />
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Pricing">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <FormLabel htmlFor="price">Price *</FormLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <IndianRupee size={16} />
                    </span>
                    <FormInput
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) =>
                        setPrice(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      placeholder="0"
                      className="pl-10"
                      min="0"
                      required
                    />
                  </div>
                </div>
                {/* <div>
                  <FormLabel htmlFor="suggestedPrice">
                    Suggested Price (Optional)
                  </FormLabel>
                  <div className="relative">
                    <span
                      className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 ${allowPayWhatYouWant ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    >
                      <IndianRupee size={16} />
                    </span>
                    <FormInput
                      id="suggestedPrice"
                      type="number"
                      value={suggestedPrice}
                      onChange={(e) =>
                        setSuggestedPrice(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      placeholder="e.g., 699"
                      className="pl-10"
                      min="0"
                      disabled={!allowPayWhatYouWant}
                    />
                  </div>
                </div> */}
              </div>
              {/* <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-[#262626] p-4">
                <input
                  id="pwyw"
                  type="checkbox"
                  checked={allowPayWhatYouWant}
                  onChange={(e) => setAllowPayWhatYouWant(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[#643446] focus:ring-[#643446]"
                />
                <label htmlFor="pwyw" className="text-sm text-gray-300">
                  Allow customers to pay what they want
                </label>
              </div>
              {allowPayWhatYouWant && (
                <div>
                  <FormLabel htmlFor="minPrice">Minimum Price *</FormLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <IndianRupee size={16} />
                    </span>
                    <FormInput
                      id="minPrice"
                      type="number"
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      placeholder="0"
                      className="pl-10"
                      min="0"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    The minimum amount customers must pay.
                  </p>
                </div>
              )} */}
            </div>
          </DashboardCard>

          <DashboardCard title="Content & Settings">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <FormLabel>Product Media (Cover, Images & Video) *</FormLabel>
                  <MediaUploadManager media={media} setMedia={setMedia} />
                </div>
                <div>
                  <FormLabel>Product File(s) *</FormLabel>
                  {uploadedFiles.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {uploadedFiles.map(
                        (file, index) =>
                          file && (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-2 rounded-lg bg-[#262626] p-2.5 text-sm"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <FileCheck
                                  size={16}
                                  className="shrink-0 text-green-700"
                                />
                                <span
                                  className="truncate text-white"
                                  title={file.name}
                                >
                                  {file.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeProductFile(file.url)}
                                className="p-1 text-red-500 hover:text-red-400"
                                title="Remove File"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )
                      )}
                    </div>
                  )}
                  <FileUploadComponent
                    title="Add Product File"
                    description="Upload your digital product files (.zip, .pdf, etc.)"
                    icon={UploadCloud}
                    uploadFieldName="productFile"
                    onFileUpload={handleProductFileUpload}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* <div>
                  <FormLabel htmlFor="maxSales">Limit Sales (Optional)</FormLabel>
                  <FormInput
                    id="maxSales"
                    type="number"
                    value={maxSales}
                    onChange={(e) =>
                      setMaxSales(
                        e.target.value === '' ? '' : Number(e.target.value)
                      )
                    }
                    placeholder="e.g., 100"
                    min="1"
                    step="1"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Leave blank for unlimited sales.
                  </p>
                </div> */}
                {/* <div>
                  <FormLabel htmlFor="cta">Button Text (Optional)</FormLabel>
                  <FormInput
                    id="cta"
                    type="text"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    placeholder="Default: Buy Now"
                  />
                </div> */}
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-[#262626] p-4">
                <input
                  id="isListed"
                  type="checkbox"
                  checked={isListed}
                  onChange={(e) => setIsListed(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[#643446] focus:ring-[#643446]"
                />
                <div className="flex-1">
                  <label htmlFor="isListed" className="text-sm font-medium text-gray-300">
                    List on marketplace
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Make this product discoverable in the public marketplace
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-[#262626] p-4">
                <input
                  id="isArchived"
                  type="checkbox"
                  checked={isArchived}
                  onChange={(e) => setIsArchived(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[#643446] focus:ring-[#643446]"
                />
                <div className="flex-1">
                  <label htmlFor="isArchived" className="text-sm font-medium text-gray-300">
                    Archive product
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Archived products are hidden from your store and marketplace
                  </p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="sticky top-6 flex flex-col gap-6">
            <DashboardCard title="Actions">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-400">
                  Choose to publish the product immediately or save it as a
                  draft to work on later.
                </p>
                <div className="flex flex-col gap-3 border-t border-gray-700/50 pt-4">
                  <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-gray-200 disabled:opacity-50"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isLoading ? 'Publishing...' : 'Publish Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#262626] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-700 disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                </div>
                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                    <AlertCircle size={16} className="shrink-0" />
                    <p className="whitespace-pre-wrap">{error}</p>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}