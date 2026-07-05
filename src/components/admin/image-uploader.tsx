"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { X, Upload, Loader2 } from "lucide-react";

interface Props {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUploader({ urls, onChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const { startUpload, isUploading } = useUploadThing("productImage", {
    onClientUploadComplete: (res) => {
      const newUrls = res.map((r) => r.ufsUrl);
      onChange([...urls, ...newUrls]);
    },
    onUploadError: (err) => {
      alert(`Upload failed: ${err.message}`);
    },
  });

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) return;
      startUpload(imageFiles);
    },
    [startUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const removeUrl = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Previews */}
      {urls.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {urls.map((url, i) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute right-1 top-1 hidden rounded-full bg-ink-900/80 p-0.5 text-white group-hover:flex"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          isDragging
            ? "border-brand-500 bg-brand-500/5"
            : "border-border hover:border-brand-400 hover:bg-brand-500/5"
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            <p className="text-sm text-muted-foreground">Uploading…</p>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium text-ink-700">
              Drop images here or <span className="text-brand-600">browse</span>
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WebP — up to 8MB each, max 8 files</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={isUploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}
