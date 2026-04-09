"use client";

import { useEffect, useState, useRef } from "react";
import { safeLocalStorage } from "@/lib/storage";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "other";
  size: string;
  uploadedAt: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedMedia = safeLocalStorage.getItem("bigbang_media");
    if (savedMedia) {
      setMedia(JSON.parse(savedMedia));
    } else {
      // Default images
      const defaultMedia: MediaItem[] = [
        { id: "1", name: "case-cvs.png", url: "/case-cvs.png", type: "image", size: "156 KB", uploadedAt: "2025-03-20" },
        { id: "2", name: "case-viutv.png", url: "/case-viutv.png", type: "image", size: "203 KB", uploadedAt: "2025-03-20" },
        { id: "3", name: "case-hsbc.png", url: "/case-hsbc.png", type: "image", size: "189 KB", uploadedAt: "2025-03-20" },
        { id: "4", name: "logo.png", url: "/logo.png", type: "image", size: "45 KB", uploadedAt: "2025-03-15" },
        { id: "5", name: "hero-background.jpg", url: "/hero-background.jpg", type: "image", size: "892 KB", uploadedAt: "2025-03-15" },
      ];
      setMedia(defaultMedia);
    }
  }, []);

  useEffect(() => {
    safeLocalStorage.setItem("bigbang_media", JSON.stringify(media));
  }, [media]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMedia: MediaItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: event.target?.result as string,
          type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "other",
          size: formatFileSize(file.size),
          uploadedAt: new Date().toISOString().split("T")[0],
        };
        setMedia((prev) => [...prev, newMedia]);
      };
      reader.readAsDataURL(file);
    });

    setTimeout(() => {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDelete = (id: string) => {
    if (confirm("確定要刪除這個文件嗎？")) {
      setMedia(media.filter((m) => m.id !== id));
      setSelectedFiles(selectedFiles.filter((fid) => fid !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === media.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(media.map((m) => m.id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`確定要刪除選中的 ${selectedFiles.length} 個文件嗎？`)) {
      setMedia(media.filter((m) => !selectedFiles.includes(m.id)));
      setSelectedFiles([]);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("鏈接已複製到剪貼板");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">媒體庫</h1>
          <p className="text-gray-500 mt-1">管理網站的圖片和媒體文件</p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*,video/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-bold transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>上傳中...</span>
              </>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt"></i>
                <span>上傳文件</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFiles.length === media.length && media.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-yellow-400 rounded focus:ring-yellow-400"
            />
            <span className="text-gray-700">全選</span>
          </label>
          {selectedFiles.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
            >
              <i className="fas fa-trash"></i>
              <span>刪除選中 ({selectedFiles.length})</span>
            </button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 text-sm">{media.length} 個文件</span>
          <div className="w-px h-6 bg-gray-300"></div>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>

      {/* Media Grid/List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {media.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-images text-5xl mb-4"></i>
            <p className="text-lg font-medium mb-2">媒體庫為空</p>
            <p className="text-sm">點擊上方「上傳文件」按鈕添加圖片</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                  selectedFiles.includes(item.id) ? "border-yellow-400 ring-2 ring-yellow-200" : "border-gray-200 hover:border-yellow-300"
                }`}
              >
                {/* Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles([...selectedFiles, item.id]);
                      } else {
                        setSelectedFiles(selectedFiles.filter((id) => id !== item.id));
                      }
                    }}
                    className="w-4 h-4 text-yellow-400 rounded focus:ring-yellow-400"
                  />
                </div>

                {/* Thumbnail */}
                <div className="aspect-square bg-gray-100">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : item.type === "video" ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <i className="fas fa-video text-3xl"></i>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <i className="fas fa-file text-3xl"></i>
                    </div>
                  )}
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100"
                    title="複製鏈接"
                  >
                    <i className="fas fa-link text-sm"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                    title="刪除"
                  >
                    <i className="fas fa-trash text-sm"></i>
                  </button>
                </div>

                {/* Info */}
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-900 truncate" title={item.name}>{item.name}</p>
                  <p className="text-xs text-gray-400">{item.size}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {media.map((item) => (
              <div
                key={item.id}
                className={`flex items-center p-3 rounded-xl border-2 transition-all ${
                  selectedFiles.includes(item.id) ? "border-yellow-400 bg-yellow-50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFiles([...selectedFiles, item.id]);
                    } else {
                      setSelectedFiles(selectedFiles.filter((fid) => fid !== item.id));
                    }
                  }}
                  className="w-4 h-4 text-yellow-400 rounded focus:ring-yellow-400 mr-4"
                />
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  {item.type === "image" ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <i className={`fas ${item.type === "video" ? "fa-video" : "fa-file"} text-gray-400`}></i>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.size} • {item.uploadedAt}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                    title="複製鏈接"
                  >
                    <i className="fas fa-link"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="刪除"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">使用提示</p>
            <ul className="list-disc list-inside space-y-1">
              <li>圖片文件建議大小不超過 2MB</li>
              <li>支持的格式：JPG, PNG, GIF, WebP</li>
              <li>點擊圖片可複製路徑，用於案例管理中</li>
              <li>數據暫時存儲在瀏覽器中，清除緩存會丟失</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
