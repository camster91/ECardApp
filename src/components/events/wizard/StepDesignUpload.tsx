'use client';

import { useState, useCallback } from 'react';
import type { WizardFormData } from './WizardContainer';

interface StepDesignUploadProps {
  designUrl: string;
  designType: string;
  onUpdate: (field: keyof WizardFormData, value: unknown) => void;
}

export default function StepDesignUpload({
  designUrl,
  designType,
  onUpdate,
}: StepDesignUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Upload failed');
        }

        const data = await res.json();
        onUpdate('design_url', data.url);
        onUpdate('design_type', 'upload');
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [onUpdate]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeDesign = () => {
    onUpdate('design_url', '');
    onUpdate('design_type', 'upload');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Upload Your Design</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload an image or design for your event card. Supported formats: JPEG, PNG, GIF, WebP, SVG.
        </p>
      </div>

      {/* Design type selector */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onUpdate('design_type', 'upload')}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            designType === 'upload'
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Upload Image
        </button>
        <button
          type="button"
          onClick={() => onUpdate('design_type', 'url')}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            designType === 'url'
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Image URL
        </button>
      </div>

      {designType === 'upload' ? (
        <>
          {/* Upload zone */}
          {!designUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={isUploading}
              />

              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                  <p className="text-sm font-medium text-gray-600">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 p-6 text-center">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Drop your design here, or click to browse
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Max file size: 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Preview uploaded image */
            <div className="relative overflow-hidden rounded-xl border border-gray-200">
              <img
                src={designUrl}
                alt="Event design preview"
                className="h-auto max-h-[400px] w-full object-contain"
              />
              <button
                type="button"
                onClick={removeDesign}
                className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        /* URL input */
        <div className="space-y-3">
          <label htmlFor="design-url" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            id="design-url"
            type="url"
            value={designUrl}
            onChange={(e) => onUpdate('design_url', e.target.value)}
            placeholder="https://example.com/your-design.png"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          {designUrl && (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <img
                src={designUrl}
                alt="Event design preview"
                className="h-auto max-h-[400px] w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Error display */}
      {uploadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {uploadError}
        </div>
      )}

      {/* Optional skip note */}
      <p className="text-center text-xs text-gray-400">
        You can skip this step and add a design later.
      </p>
    </div>
  );
}
