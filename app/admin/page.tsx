"use client";
import { useState, useEffect, useRef } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaSoundcloud, FaYoutube } from "react-icons/fa6";
import { SiNiconico, SiSpotify, SiApplemusic, SiAmazonmusic } from "react-icons/si";
import { FiTrash2, FiUpload } from "react-icons/fi";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Work = {
  id: number; slug: string; filename: string; title: string;
  description?: string; tools?: string;
  soundcloud?: string; youtube?: string; niconico?: string;
  spotify?: string; appleMusic?: string; amazonMusic?: string;
};
type News = { date: string; content: string; link?: string; };
type WorksData = { musicWorks: Work[]; designWorks: Work[]; newsData: News[]; };
type ActiveTab = "music" | "design" | "news";
type PendingUpload = { filename: string; base64: string; localUrl: string; type: "music" | "design"; };
type PendingDeletion = { filename: string; type: "music" | "design"; };

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

async function fileToBase64(file: File): Promise<string> {
  if (file.size > 2 * 1024 * 1024) {
    // Resize large images
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const maxWidth = 1200;
        let { width, height } = img;
        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85).split(",")[1]);
      };
      img.onerror = reject;
      img.src = url;
    });
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const SNS_ICONS = [
  { key: "soundcloud", Icon: FaSoundcloud, hoverColor: "hover:text-[#ff3300]", label: "SoundCloud" },
  { key: "youtube",    Icon: FaYoutube,    hoverColor: "hover:text-[#ff0000]", label: "YouTube" },
  { key: "niconico",   Icon: SiNiconico,   hoverColor: "hover:text-[#82c8ef]", label: "Niconico" },
  { key: "spotify",    Icon: SiSpotify,    hoverColor: "hover:text-[#1db954]",  label: "Spotify" },
  { key: "appleMusic", Icon: SiApplemusic, hoverColor: "hover:text-[#fc3c44]", label: "Apple Music" },
  { key: "amazonMusic",Icon: SiAmazonmusic,hoverColor: "hover:text-[#00a8e1]", label: "Amazon Music" },
];

// ─────────────────────────────────────────────
// Shared form fields
// ─────────────────────────────────────────────
function TextField({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-gray-400" />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="border border-gray-200 rounded px-2 py-1.5 text-xs resize-none focus:outline-none focus:border-gray-400" />
    </div>
  );
}

// ─────────────────────────────────────────────
// ImageUploadSection
// ─────────────────────────────────────────────
type ImageUploadProps = {
  filename: string;
  pendingUpload: { base64: string; localUrl: string; filename: string } | null;
  isMarkedForDelete: boolean;
  onSelectFile: (file: File) => void;
  onRenameFile: (newName: string) => void;
  onClearPending: () => void;
  onMarkDelete: () => void;
  onUnmarkDelete: () => void;
};

function ImageUploadSection({
  filename, pendingUpload, isMarkedForDelete,
  onSelectFile, onRenameFile, onClearPending, onMarkDelete, onUnmarkDelete,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasExisting = !!filename && !isMarkedForDelete;
  const buttonLabel = pendingUpload || filename ? "画像を変更する" : "画像をアップロードする";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">画像</label>

      {/* Hidden native input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) { onSelectFile(e.target.files[0]); e.target.value = ""; } }} />

      {/* Styled upload button */}
      <button type="button" onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors text-xs text-gray-500 hover:text-gray-700 font-['Bahnschrift'] tracking-widest w-full cursor-pointer">
        <FiUpload className="text-sm" />
        {buttonLabel}
      </button>

      {/* Pending upload row (editable filename + trash) */}
      {pendingUpload && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded px-3 py-2">
          <span className="text-xs text-blue-400 shrink-0">↑ 新規:</span>
          <input
            type="text"
            value={pendingUpload.filename}
            onChange={(e) => onRenameFile(e.target.value)}
            title="ファイル名を変更できます"
            className="flex-1 text-xs bg-transparent border-b border-blue-200 focus:outline-none focus:border-blue-400 min-w-0 font-['Bahnschrift'] tracking-wide"
          />
          <button type="button" onClick={onClearPending} title="アップロードをキャンセル"
            className="text-red-400 hover:text-red-600 transition-colors shrink-0">
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      )}

      {/* Existing file row (shown when no pending & file exists) */}
      {!pendingUpload && filename && (
        <div className={`flex items-center gap-2 rounded px-3 py-2 ${isMarkedForDelete ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-100"}`}>
          <span className={`flex-1 text-xs truncate font-['Bahnschrift'] tracking-wide ${isMarkedForDelete ? "line-through opacity-40" : "opacity-60"}`}>
            {filename}
          </span>
          {isMarkedForDelete ? (
            <button type="button" onClick={onUnmarkDelete}
              className="text-xs text-gray-400 hover:text-gray-600 font-['Bahnschrift'] tracking-widest shrink-0 whitespace-nowrap">
              元に戻す
            </button>
          ) : (
            <button type="button" onClick={onMarkDelete} title="コミット時に削除"
              className="text-red-400 hover:text-red-600 transition-colors shrink-0">
              <FiTrash2 className="text-sm" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Edit Forms
// ─────────────────────────────────────────────
function MusicForm({ item, onChange, imageProps }: {
  item: Work; onChange: (v: Work) => void; imageProps: ImageUploadProps;
}) {
  return (
    <div className="flex flex-col gap-3">
      <TextField label="タイトル" value={item.title} onChange={(v) => onChange({ ...item, title: v })} placeholder="ALBUM TITLE" />
      <ImageUploadSection {...imageProps} />
      <TextareaField label="説明" value={item.description || ""} onChange={(v) => onChange({ ...item, description: v })} placeholder="作品のコンセプトなど" />
      <TextField label="使用ツール" value={item.tools || ""} onChange={(v) => onChange({ ...item, tools: v })} placeholder="DTM, Photoshop, ..." />
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase mb-2">SNS リンク</p>
        <div className="flex flex-col gap-2">
          {SNS_ICONS.map(({ key, Icon, label }) => (
            <div key={key} className="flex items-center gap-2">
              <Icon className="text-base shrink-0 opacity-60" />
              <input type="url" value={(item[key as keyof Work] as string) || ""}
                onChange={(e) => onChange({ ...item, [key]: e.target.value })}
                placeholder={`${label} URL`}
                className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesignForm({ item, onChange, imageProps }: {
  item: Work; onChange: (v: Work) => void; imageProps: ImageUploadProps;
}) {
  return (
    <div className="flex flex-col gap-3">
      <TextField label="タイトル" value={item.title} onChange={(v) => onChange({ ...item, title: v })} placeholder="作品タイトル" />
      <ImageUploadSection {...imageProps} />
      <TextareaField label="説明" value={item.description || ""} onChange={(v) => onChange({ ...item, description: v })} placeholder="作品の説明" />
      <TextField label="使用ツール" value={item.tools || ""} onChange={(v) => onChange({ ...item, tools: v })} placeholder="Photoshop, Illustrator, ..." />
    </div>
  );
}

function NewsForm({ item, onChange }: { item: News; onChange: (v: News) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <TextField label="日付" value={item.date} onChange={(v) => onChange({ ...item, date: v })} placeholder="2026.01.01" />
      <TextareaField label="内容" value={item.content} onChange={(v) => onChange({ ...item, content: v })} placeholder="ニュース内容" />
      <TextField label="リンク (任意)" value={item.link || ""} onChange={(v) => onChange({ ...item, link: v })} placeholder="https://..." />
    </div>
  );
}

// ─────────────────────────────────────────────
// Preview Cards（本番UIに合わせたレイアウト）
// ─────────────────────────────────────────────

// スマホプレビュー用コンテンツ（phone frame内・1カラム）
function MobileWorkPreview({ work, imageUrl, isMusic }: {
  work: Work; imageUrl: string | null; isMusic: boolean;
}) {
  const imgSrc = imageUrl || (work.filename ? `/images/${isMusic ? "MUSIC" : "DESIGN"} WORKS/${work.filename}` : null);
  const category = isMusic ? "MUSIC / ALBUM DESIGN" : "DESIGN";
  return (
    <div className="flex flex-col gap-4 text-[#333333] pb-4 pt-4 px-3">
      {imgSrc && (
        <div className="w-full bg-white overflow-hidden shadow-2xl border border-[#333333]/5">
          <img src={imgSrc} alt={work.title} className="w-full h-auto object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h1 className="text-[14pt] font-['Mobo-bold'] leading-tight tracking-wider">
          {work.title || "（タイトル未入力）"}
        </h1>
        <div className="font-['Bahnschrift'] text-[7pt] opacity-60 tracking-widest uppercase border-b border-gray-200 pb-1 w-fit">
          {category}
        </div>
        {work.description && (
          <p className="font-['Mobo'] text-[8pt] leading-relaxed opacity-80 tracking-wider">{work.description}</p>
        )}
        {work.tools && (
          <div className="py-2 border-t border-b border-gray-100">
            <p className="font-['Bahnschrift'] text-[6pt] opacity-40 tracking-widest uppercase mb-1">Tools Used</p>
            <p className="font-['Mobo'] text-[7.5pt] opacity-70 tracking-wider leading-relaxed">{work.tools}</p>
          </div>
        )}
        {isMusic && (
          <div className="flex items-center gap-4 text-[16pt]">
            {SNS_ICONS.map(({ key, Icon }) =>
              work[key as keyof Work] ? <span key={key} className="opacity-70"><Icon /></span> : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// PCプレビュー用コンテンツ（本番と同寸法で描画 → CSS scale で縮小）
// 本番 work-slug ページ: 2カラムグリッド、text-[28pt]タイトルなど
function PCWorkPreview({ work, imageUrl, isMusic }: {
  work: Work; imageUrl: string | null; isMusic: boolean;
}) {
  const imgSrc = imageUrl || (work.filename ? `/images/${isMusic ? "MUSIC" : "DESIGN"} WORKS/${work.filename}` : null);
  const category = isMusic ? "MUSIC / ALBUM DESIGN" : "DESIGN";
  // 本番ページのレイアウト幅に合わせて描画し、scale(0.42) で縮小表示
  // outer div で高さを固定してクリップ
  const RENDER_WIDTH = 640;
  const SCALE = 0.42;
  return (
    <div style={{ height: "340px", overflow: "hidden", position: "relative" }}>
      <div style={{
        width: `${RENDER_WIDTH}px`,
        transform: `scale(${SCALE})`,
        transformOrigin: "top left",
        pointerEvents: "none",
      }}>
        <div className="grid grid-cols-2 gap-16 items-start text-[#333333]">
          {/* 左: 画像 */}
          <div className="w-full shadow-2xl bg-white border border-[#333333]/5 overflow-hidden">
            {imgSrc ? (
              <img src={imgSrc} alt={work.title} className="w-full h-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div className="w-full h-40 bg-gray-50 flex items-center justify-center">
                <span className="text-sm opacity-30 font-['Bahnschrift']">NO IMAGE</span>
              </div>
            )}
          </div>
          {/* 右: テキスト */}
          <div className="flex flex-col">
            <h1 className="text-[28pt] font-['Mobo-bold'] leading-tight tracking-wider mb-4">
              {work.title || "（タイトル未入力）"}
            </h1>
            <div className="font-['Bahnschrift'] text-[11pt] opacity-60 tracking-widest uppercase mb-10 border-b border-[#333333]/10 pb-2 w-fit">
              {category}
            </div>
            {work.description && (
              <div className="font-['Mobo'] text-[11.5pt] leading-relaxed opacity-80 tracking-wider mb-8">
                {work.description}
              </div>
            )}
            {work.tools && (
              <div className="mb-10 py-6 border-t border-b border-[#333333]/5">
                <p className="font-['Bahnschrift'] text-[9pt] opacity-40 tracking-[0.2em] mb-3 uppercase">Tools Used</p>
                <p className="font-['Mobo'] text-[10.5pt] opacity-70 tracking-wider leading-relaxed">{work.tools}</p>
              </div>
            )}
            {isMusic && (
              <div className="flex items-center gap-8 mt-4 text-[28pt]">
                {SNS_ICONS.map(({ key, Icon }) =>
                  work[key as keyof Work] ? <span key={key} className="opacity-70"><Icon /></span> : null
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsPreviewCard({ item }: { item: News }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left">
      <div className="flex flex-col gap-2">
        <span className="font-['Bahnschrift'] opacity-70 text-xs tracking-widest">{item.date || "（日付未入力）"}</span>
        <span className="text-xs leading-relaxed tracking-wide">{item.content || "（内容未入力）"}</span>
        {item.link && <span className="text-xs font-['Bahnschrift'] tracking-widest opacity-50 underline">Visit Link →</span>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SortableItem
// ─────────────────────────────────────────────
function SortableItem({ id, index, title, onEdit, onDelete }: {
  id: string; index: number; title: string; onEdit: () => void; onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2">
      <button {...attributes} {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 touch-none" title="ドラッグで並び替え">
        ⠿
      </button>
      <span className="text-xs font-['Bahnschrift'] text-gray-400 w-5 text-right shrink-0">{index + 1}</span>
      <span className="flex-1 truncate font-['Bahnschrift'] tracking-wide text-xs">{title}</span>
      <button onClick={onEdit} className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors">編集</button>
      <button onClick={onDelete} className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors">削除</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// LoginScreen
// ─────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { sessionStorage.setItem("admin_password", password); onLogin(password); }
      else setError("パスワードが正しくありません。");
    } catch { setError("エラーが発生しました。"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-10 w-full max-w-sm">
        <h1 className="font-['Bahnschrift'] text-xl tracking-[0.3em] text-center mb-8 text-[#333333]">INAGA ADMIN</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400 font-['Bahnschrift'] tracking-widest" autoFocus />
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button type="submit" disabled={loading || !password}
            className="bg-[#333333] text-white font-['Bahnschrift'] tracking-widest text-sm py-3 rounded-lg hover:bg-[#555555] transition-colors disabled:opacity-50">
            {loading ? "..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AdminDashboard
// ─────────────────────────────────────────────
function AdminDashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [worksData, setWorksData] = useState<WorksData | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("music");

  // Edit state
  const [editingItem, setEditingItem] = useState<Work | News | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [originalFilename, setOriginalFilename] = useState("");

  // Image edit state
  const [editImagePending, setEditImagePending] = useState<{ base64: string; localUrl: string; filename: string } | null>(null);
  const [editImageDeleteExisting, setEditImageDeleteExisting] = useState(false);

  // Commit queue
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [pendingDeletions, setPendingDeletions] = useState<PendingDeletion[]>([]);
  const [isCommitPending, setIsCommitPending] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [previewMode, setPreviewMode] = useState<"pc" | "mobile">("pc");

  const authHeader = { Authorization: `Bearer ${password}` };

  useEffect(() => {
    fetch("/api/admin/data", { headers: authHeader, cache: "no-store" })
      .then((r) => r.json())
      .then(({ data }) => setWorksData(data))
      .catch(() => setStatusMsg("データの取得に失敗しました。"));
  }, []);

  const currentList = (): (Work | News)[] => {
    if (!worksData) return [];
    if (activeTab === "music") return worksData.musicWorks;
    if (activeTab === "design") return worksData.designWorks;
    return worksData.newsData;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── Drag & Drop ──
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !worksData) return;
    const list = currentList();
    const oldIdx = list.findIndex((_, i) => String(i) === active.id);
    const newIdx = list.findIndex((_, i) => String(i) === over.id);
    const newList = arrayMove([...list], oldIdx, newIdx);
    const updated = { ...worksData };
    if (activeTab === "music") updated.musicWorks = newList as Work[];
    else if (activeTab === "design") updated.designWorks = newList as Work[];
    else updated.newsData = newList as News[];
    setWorksData(updated);
    setIsCommitPending(true);
  }

  // ── Edit controls ──
  function startEdit(index: number) {
    const item = currentList()[index];
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setEditingIndex(index);
    setIsNewItem(false);
    setOriginalFilename(activeTab !== "news" ? (item as Work).filename : "");
    setEditImagePending(null);
    setEditImageDeleteExisting(false);
  }

  function startNew() {
    if (activeTab === "music") {
      const list = worksData?.musicWorks ?? [];
      const newId = list.length > 0 ? Math.max(...list.map((w) => w.id)) + 1 : 1;
      setEditingItem({ id: newId, slug: "", filename: "", title: "", description: "", tools: "", soundcloud: "", youtube: "", niconico: "", spotify: "", appleMusic: "", amazonMusic: "" });
    } else if (activeTab === "design") {
      const list = worksData?.designWorks ?? [];
      const newId = list.length > 0 ? Math.max(...list.map((w) => w.id)) + 1 : 1;
      setEditingItem({ id: newId, slug: "", filename: "", title: "", description: "", tools: "" });
    } else {
      setEditingItem({ date: "", content: "", link: "" });
    }
    setEditingIndex(null);
    setIsNewItem(true);
    setOriginalFilename("");
    setEditImagePending(null);
    setEditImageDeleteExisting(false);
  }

  function cancelEdit() {
    if (editImagePending?.localUrl) URL.revokeObjectURL(editImagePending.localUrl);
    setEditingItem(null);
    setEditingIndex(null);
    setIsNewItem(false);
    setOriginalFilename("");
    setEditImagePending(null);
    setEditImageDeleteExisting(false);
  }

  // ── Image handlers ──
  async function handleSelectImage(file: File) {
    const localUrl = URL.createObjectURL(file);
    const base64 = await fileToBase64(file);
    const pending = { base64, localUrl, filename: file.name };
    setEditImagePending(pending);
    if (editingItem && activeTab !== "news") {
      setEditingItem({ ...(editingItem as Work), filename: file.name });
    }
  }

  function handleRenameFile(newName: string) {
    if (!editImagePending) return;
    setEditImagePending({ ...editImagePending, filename: newName });
    if (editingItem && activeTab !== "news") {
      setEditingItem({ ...(editingItem as Work), filename: newName });
    }
  }

  function handleClearPending() {
    if (editImagePending?.localUrl) URL.revokeObjectURL(editImagePending.localUrl);
    setEditImagePending(null);
    if (editingItem && activeTab !== "news") {
      setEditingItem({ ...(editingItem as Work), filename: originalFilename });
    }
  }

  function handleMarkDelete() {
    setEditImageDeleteExisting(true);
    if (editingItem && activeTab !== "news") {
      setEditingItem({ ...(editingItem as Work), filename: "" });
    }
  }

  function handleUnmarkDelete() {
    setEditImageDeleteExisting(false);
    if (editingItem && activeTab !== "news") {
      setEditingItem({ ...(editingItem as Work), filename: originalFilename });
    }
  }

  // ── 一時保存 ──
  function handleTempSave() {
    if (!worksData || !editingItem) return;

    // Queue image upload
    if (editImagePending && activeTab !== "news") {
      const type = activeTab as "music" | "design";
      setPendingUploads((prev) => [
        ...prev.filter((p) => !(p.type === type && p.filename === editImagePending.filename)),
        { filename: editImagePending.filename, base64: editImagePending.base64, localUrl: editImagePending.localUrl, type },
      ]);
    }

    // Queue image deletion
    if (editImageDeleteExisting && originalFilename && activeTab !== "news") {
      const type = activeTab as "music" | "design";
      setPendingDeletions((prev) => [
        ...prev.filter((p) => !(p.type === type && p.filename === originalFilename)),
        { filename: originalFilename, type },
      ]);
    }

    // Auto-generate slug
    let finalItem = { ...editingItem };
    if (activeTab !== "news") {
      const work = finalItem as Work;
      if (!work.slug || isNewItem) work.slug = generateSlug(work.title);
      finalItem = work;
    }

    // Update local worksData
    const updated = { ...worksData };
    if (activeTab === "music") {
      const list = [...worksData.musicWorks];
      if (editingIndex !== null) list[editingIndex] = finalItem as Work; else list.push(finalItem as Work);
      updated.musicWorks = list;
    } else if (activeTab === "design") {
      const list = [...worksData.designWorks];
      if (editingIndex !== null) list[editingIndex] = finalItem as Work; else list.push(finalItem as Work);
      updated.designWorks = list;
    } else {
      const list = [...worksData.newsData];
      if (editingIndex !== null) list[editingIndex] = finalItem as News; else list.push(finalItem as News);
      updated.newsData = list;
    }
    setWorksData(updated);
    setIsCommitPending(true);
    setStatusMsg("一時保存しました。「全てコミット」でGitHubに反映されます。");
    cancelEdit();
  }

  // ── 全てコミット ──
  async function handleCommitAll() {
    if (!worksData) return;
    setIsCommitting(true);
    setStatusMsg("コミット中...");

    for (const upload of pendingUploads) {
      const res = await fetch("/api/admin/image", {
        method: "POST",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ base64: upload.base64, filename: upload.filename, type: upload.type }),
      });
      if (!res.ok) {
        setStatusMsg(`画像「${upload.filename}」のアップロードに失敗しました。`);
        setIsCommitting(false);
        return;
      }
    }

    for (const del of pendingDeletions) {
      await fetch("/api/admin/image", {
        method: "DELETE",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ filename: del.filename, type: del.type }),
      }).catch(() => {});
    }

    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ data: worksData }),
    });

    if (res.ok) {
      setPendingUploads([]);
      setPendingDeletions([]);
      setIsCommitPending(false);
      setStatusMsg("コミット完了！サイトに反映されるまで1〜2分かかります。");
    } else {
      setStatusMsg("コミットに失敗しました。");
    }
    setIsCommitting(false);
  }

  // ── 削除 ──
  async function handleDelete(index: number) {
    if (!worksData || !confirm("削除しますか？")) return;
    const item = currentList()[index];

    if (activeTab !== "news") {
      const work = item as Work;
      if (work.filename) {
        const type = activeTab as "music" | "design";
        setPendingDeletions((prev) => [...prev, { filename: work.filename, type }]);
      }
    }

    const updated = { ...worksData };
    if (activeTab === "music") updated.musicWorks = worksData.musicWorks.filter((_, i) => i !== index);
    else if (activeTab === "design") updated.designWorks = worksData.designWorks.filter((_, i) => i !== index);
    else updated.newsData = worksData.newsData.filter((_, i) => i !== index);
    setWorksData(updated);
    setIsCommitPending(true);
    setStatusMsg("削除しました。「全てコミット」でGitHubに反映されます。");
  }

  const list = currentList();
  const previewImageUrl = editImagePending?.localUrl ?? null;
  const previewWork = editingItem && activeTab !== "news" ? (editingItem as Work) : null;
  const previewNews = editingItem && activeTab === "news" ? (editingItem as News) : null;
  const isMobilePreview = previewMode === "mobile";

  const imageProps: ImageUploadProps = {
    filename: editingItem && activeTab !== "news" ? (editingItem as Work).filename : "",
    pendingUpload: editImagePending,
    isMarkedForDelete: editImageDeleteExisting,
    onSelectFile: handleSelectImage,
    onRenameFile: handleRenameFile,
    onClearPending: handleClearPending,
    onMarkDelete: handleMarkDelete,
    onUnmarkDelete: handleUnmarkDelete,
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#333333]">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="font-['Bahnschrift'] text-base tracking-[0.3em]">INAGA ADMIN</h1>
          <nav className="flex gap-1">
            {(["music", "design", "news"] as ActiveTab[]).map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); cancelEdit(); }}
                className={`px-3 py-1.5 text-xs font-['Bahnschrift'] tracking-widest rounded transition-colors ${activeTab === tab ? "bg-[#333333] text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                {tab.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isCommitPending && (
            <button onClick={handleCommitAll} disabled={isCommitting}
              className="px-4 py-2 text-xs font-['Bahnschrift'] tracking-widest bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm">
              {isCommitting ? "コミット中..." : "全てコミット ↑"}
            </button>
          )}
          <button onClick={onLogout}
            className="text-xs font-['Bahnschrift'] tracking-widest text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded hover:border-gray-400 transition-colors">
            LOGOUT
          </button>
        </div>
      </header>

      {/* Banners */}
      {isCommitPending && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 md:px-8 py-2 text-xs text-amber-700 font-['Bahnschrift'] tracking-wide">
          ⚠ 未コミットの変更があります。右上の「全てコミット」でGitHubに反映されます。
        </div>
      )}
      {statusMsg && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 md:px-8 py-2 text-xs text-blue-700 font-['Bahnschrift'] tracking-wide flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg("")} className="ml-2 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col md:flex-row gap-0 md:gap-6 p-4 md:p-8 max-w-6xl mx-auto">

        {/* Left: Preview */}
        <div className="md:w-[300px] shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:sticky md:top-6">
            {/* PC / スマホ 切り替えタブ */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-['Bahnschrift'] tracking-widest opacity-50 uppercase">Preview</p>
              <div className="flex gap-1">
                <button onClick={() => setPreviewMode("pc")}
                  className={`px-2 py-1 text-xs font-['Bahnschrift'] tracking-widest rounded transition-colors ${previewMode === "pc" ? "bg-[#333333] text-white" : "text-gray-400 hover:bg-gray-100"}`}>
                  PC
                </button>
                <button onClick={() => setPreviewMode("mobile")}
                  className={`px-2 py-1 text-xs font-['Bahnschrift'] tracking-widest rounded transition-colors ${previewMode === "mobile" ? "bg-[#333333] text-white" : "text-gray-400 hover:bg-gray-100"}`}>
                  スマホ
                </button>
              </div>
            </div>

            {!editingItem && (
              <p className="text-xs opacity-30 font-['Bahnschrift'] tracking-widest text-center py-8">
                編集ボタンを押すと<br />プレビューが表示されます
              </p>
            )}

            {/* スマホモード: phone frame（固定サイズ・内部スクロール） */}
            {editingItem && isMobilePreview && (
              <div className="mx-auto border-4 border-gray-800 rounded-[28px] overflow-hidden shadow-xl bg-white"
                style={{ width: "212px", height: "440px", display: "flex", flexDirection: "column" }}>
                {/* ノッチ */}
                <div className="bg-gray-800 shrink-0" style={{ height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div className="bg-gray-600 rounded-full" style={{ width: "48px", height: "4px" }} />
                </div>
                {/* コンテンツ（スクロール可能・高さ固定） */}
                <div className="overflow-y-auto bg-white flex-1">
                  {previewWork && (
                    <MobileWorkPreview work={previewWork} imageUrl={previewImageUrl}
                      isMusic={activeTab === "music"} />
                  )}
                  {previewNews && <div className="p-3"><NewsPreviewCard item={previewNews} /></div>}
                </div>
              </div>
            )}

            {/* PCモード: 本番と同寸法で描画→scale縮小 */}
            {editingItem && !isMobilePreview && (
              <div className="bg-white border border-gray-100 rounded-lg p-3 overflow-hidden">
                {previewWork && (
                  <PCWorkPreview work={previewWork} imageUrl={previewImageUrl}
                    isMusic={activeTab === "music"} />
                )}
                {previewNews && <NewsPreviewCard item={previewNews} />}
              </div>
            )}
          </div>
        </div>

        {/* Right: Control */}
        <div className="flex-1 min-w-0">
          {!worksData ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-xs opacity-40 font-['Bahnschrift'] tracking-widest">読み込み中...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-['Bahnschrift'] tracking-widest opacity-50 uppercase">{list.length} 件</p>
                <button onClick={startNew}
                  className="text-xs font-['Bahnschrift'] tracking-widest bg-[#333333] text-white px-3 py-1.5 rounded hover:bg-[#555555] transition-colors">
                  + 新規追加
                </button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={list.map((_, i) => String(i))} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-2">
                    {list.map((item, index) => (
                      <SortableItem key={index} id={String(index)} index={index}
                        title={activeTab === "news"
                          ? `${(item as News).date}  ${(item as News).content.slice(0, 20)}`
                          : (item as Work).title}
                        onEdit={() => startEdit(index)}
                        onDelete={() => handleDelete(index)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {editingItem && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 mt-2">
                  <p className="text-xs font-['Bahnschrift'] tracking-widest opacity-50 uppercase mb-4">
                    {isNewItem ? "新規追加" : "編集"}
                  </p>
                  {activeTab === "music" && (
                    <MusicForm item={editingItem as Work} onChange={(v) => setEditingItem(v)} imageProps={imageProps} />
                  )}
                  {activeTab === "design" && (
                    <DesignForm item={editingItem as Work} onChange={(v) => setEditingItem(v)} imageProps={imageProps} />
                  )}
                  {activeTab === "news" && (
                    <NewsForm item={editingItem as News} onChange={(v) => setEditingItem(v)} />
                  )}
                  <div className="flex gap-2 mt-4">
                    <button onClick={handleTempSave}
                      className="flex-1 py-2 text-xs font-['Bahnschrift'] tracking-widest bg-[#333333] text-white rounded hover:bg-[#555555] transition-colors">
                      一時保存
                    </button>
                    <button onClick={cancelEdit}
                      className="px-4 py-2 text-xs font-['Bahnschrift'] tracking-widest border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_password");
    if (saved) setPassword(saved);
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!password) return <LoginScreen onLogin={(pw) => { setPassword(pw); }} />;
  return <AdminDashboard password={password} onLogout={() => { sessionStorage.removeItem("admin_password"); setPassword(null); }} />;
}
