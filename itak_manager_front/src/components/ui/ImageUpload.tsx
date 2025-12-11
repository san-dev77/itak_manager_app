import { useState, useRef } from "react";
import { Camera, Upload, X, User } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (file: File | null, preview: string | null) => void;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
  label?: string;
  disabled?: boolean;
}

const ImageUpload = ({
  currentImage,
  onImageChange,
  size = "md",
  shape = "circle",
  label = "Photo",
  disabled = false,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const compressImage = (
    file: File,
    maxWidth = 400,
    quality = 0.7
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve(compressed);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (file: File | null) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5 Mo");
        return;
      }

      // Compress image to reduce payload size
      const compressed = await compressImage(file);
      setPreview(compressed);
      onImageChange(file, compressed);
    } else {
      setPreview(null);
      onImageChange(null, null);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    await handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(null);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-semibold text-slate-700">{label}</p>

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative ${sizeClasses[size]} ${
          shape === "circle" ? "rounded-full" : "rounded-xl"
        }
          border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden shadow-sm
          ${
            dragActive
              ? "border-blue-500 bg-blue-100 shadow-blue-200"
              : "border-slate-400 bg-slate-100 hover:border-blue-500 hover:bg-blue-50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${preview ? "border-solid border-slate-300 bg-white shadow-md" : ""}
        `}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                {/* Remove button */}
                <button
                  onClick={handleRemove}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
            <User className={iconSizes[size]} />
            {size !== "sm" && (
              <span className="text-xs mt-1 text-center px-2 font-medium">
                Ajouter photo
              </span>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
        disabled={disabled}
      />

      {!preview && !disabled && (
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Parcourir
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
