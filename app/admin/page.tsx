"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaSoundcloud, FaYoutube } from "react-icons/fa6";
import { SiNiconico, SiSpotify, SiApplemusic, SiAmazonmusic } from "react-icons/si";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Work = {
  id: number;
  slug: string;
  filename: string;
  title: string;
  description?: string;
  tools?: string;
  soundcloud?: string;
  youtube?: string;
  niconico?: string;
  spotify?: string;
  appleMusic?: string;
  amazonMusic?: string;
};

type News = {
  date: string;
  content: string;
  link?: string;
};

type WorksData = {
  musicWorks: Work[];
  designWorks: Work[];
  newsData: News[];
};

type ActiveTab = "music" | "design" | "news";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function resizeImage(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(dataUrl.split(",")[1]);
    };
    img.onerror = reject;
    img.src = url;
  });
}

// ─────────────────────────────────────────────
// SNS icon config
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
// SortableItem
// ─────────────────────────────────────────────
function SortableItem({
  id,
  title,
  onEdit,
  onDelete,
}: {
  id: string;
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 text-sm"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 touch-none"
        title="Drag to reorder"
      >
        ⠿
      </button>
      <span className="flex-1 truncate font-['Bahnschrift'] tracking-wide text-xs">{title}</span>
      <button
        onClick={onEdit}
        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      >
        編集
      </button>
      <button
        onClick={onDelete}
        className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
      >
        削除
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Preview Cards
// ─────────────────────────────────────────────
function MusicPreviewCard({ work, imageUrl }: { work: Work; imageUrl: string | null }) {
  const imgSrc = imageUrl || `/images/MUSIC WORKS/${work.filename}`;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative shadow-2xl bg-white border border-gray-200 overflow-hidden h-[180px] w-auto">
        {work.filename && (
          <img
            src={imgSrc}
            alt={work.title}
            className="h-full w-auto object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>
      <div className="text-center px-2">
        <p className="font-['Mobo'] text-sm tracking-wider">{work.title || "（タイトル未入力）"}</p>
      </div>
      <div className="flex justify-center gap-4 text-lg opacity-70">
        {SNS_ICONS.map(({ key, Icon, hoverColor }) =>
          work[key as keyof Work] ? (
            <span key={key} className={`transition-colors ${hoverColor}`}>
              <Icon />
            </span>
          ) : null
        )}
      </div>
      {(work.description || work.tools) && (
        <div className="text-xs text-gray-500 text-center max-w-[200px] space-y-1">
          {work.description && <p className="leading-relaxed">{work.description}</p>}
          {work.tools && <p className="opacity-70">{work.tools}</p>}
        </div>
      )}
    </div>
  );
}

function DesignPreviewCard({ work, imageUrl }: { work: Work; imageUrl: string | null }) {
  const imgSrc = imageUrl || `/images/DESIGN WORKS/${work.filename}`;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative shadow-2xl bg-white border border-gray-200 overflow-hidden h-[180px] w-auto">
        {work.filename && (
          <img
            src={imgSrc}
            alt={work.title}
            className="h-full w-auto object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>
      <div className="text-center px-2">
        <p className="font-['Mobo'] text-sm tracking-wider">{work.title || "（タイトル未入力）"}</p>
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
        {item.link && (
          <span className="text-xs font-['Bahnschrift'] tracking-widest opacity-50 underline">Visit Link →</span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Edit Forms
// ─────────────────────────────────────────────
function MusicForm({
  item,
  onChange,
  onImageChange,
}: {
  item: Work;
  onChange: (updated: Work) => void;
  onImageChange: (file: File) => void;
}) {
  const field = (key: keyof Work, label: string, placeholder?: string) => (
    <div key={key} className="flex flex-col gap-1">
      <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">{label}</label>
      {key === "description" ? (
        <textarea
          value={(item[key] as string) || ""}
          onChange={(e) => onChange({ ...item, [key]: e.target.value })}
          placeholder={placeholder}
          rows={3}
          className="border border-gray-200 rounded px-2 py-1.5 text-xs resize-none focus:outline-none focus:border-gray-400"
        />
      ) : (
        <input
          type="text"
          value={(item[key] as string) || ""}
          onChange={(e) => onChange({ ...item, [key]: e.target.value })}
          placeholder={placeholder}
          className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-gray-400"
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {field("title", "タイトル", "ALBUM TITLE")}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">画像</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onImageChange(e.target.files[0])}
          className="text-xs"
        />
        {item.filename && <p className="text-xs opacity-50">現在: {item.filename}</p>}
      </div>
      {field("description", "説明", "作品のコンセプトなど")}
      {field("tools", "使用ツール", "DTM, Photoshop, ...")}
      <div className="border-t border-gray-100 pt-3 mt-1">
        <p className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase mb-2">SNS リンク</p>
        <div className="flex flex-col gap-2">
          {SNS_ICONS.map(({ key, Icon, label }) => (
            <div key={key} className="flex items-center gap-2">
              <Icon className="text-base shrink-0 opacity-60" />
              <input
                type="url"
                value={(item[key as keyof Work] as string) || ""}
                onChange={(e) => onChange({ ...item, [key]: e.target.value })}
                placeholder={`${label} URL`}
                className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-gray-400"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesignForm({
  item,
  onChange,
  onImageChange,
}: {
  item: Work;
  onChange: (updated: Work) => void;
  onImageChange: (file: File) => void;
}) {
  const field = (key: keyof Work, label: string, placeholder?: string) => (
    <div key={key} className="flex flex-col gap-1">
      <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">{label}</label>
      {key === "description" ? (
        <textarea
          value={(item[key] as string) || ""}
          onChange={(e) => onChange({ ...item, [key]: e.target.value })}
          placeholder={placeholder}
          rows={3}
          className="border border-gray-200 rounded px-2 py-1.5 text-xs resize-none focus:outline-none focus:border-gray-400"
        />
      ) : (
        <input
          type="text"
          value={(item[key] as string) || ""}
          onChange={(e) => onChange({ ...item, [key]: e.target.value })}
          placeholder={placeholder}
          className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-gray-400"
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {field("title", "タイトル", "作品タイトル")}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">画像</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onImageChange(e.target.files[0])}
          className="text-xs"
        />
        {item.filename && <p className="text-xs opacity-50">現在: {item.filename}</p>}
      </div>
      {field("description", "説明", "作品の説明")}
      {field("tools", "使用ツール", "Photoshop, Illustrator, ...")}
    </div>
  );
}

function NewsForm({
  item,
  onChange,
}: {
  item: News;
  onChange: (updated: News) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">日付</label>
        <input
          type="text"
          value={item.date}
          onChange={(e) => onChange({ ...item, date: e.target.value })}
          placeholder="2026.01.01"
          className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-gray-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">内容</label>
        <textarea
          value={item.content}
          onChange={(e) => onChange({ ...item, content: e.target.value })}
          placeholder="ニュース内容"
          rows={3}
          className="border border-gray-200 rounded px-2 py-1.5 text-xs resize-none focus:outline-none focus:border-gray-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-['Bahnschrift'] tracking-widest opacity-70 uppercase">リンク (任意)</label>
        <input
          type="url"
          value={item.link || ""}
          onChange={(e) => onChange({ ...item, link: e.target.value })}
          placeholder="https://..."
          className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-gray-400"
        />
      </div>
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
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_password", password);
        onLogin(password);
      } else {
        setError("パスワードが正しくありません。");
      }
    } catch {
      setError("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-10 w-full max-w-sm">
        <h1 className="font-['Bahnschrift'] text-xl tracking-[0.3em] text-center mb-8 text-[#333333]">
          INAGA ADMIN
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400 font-['Bahnschrift'] tracking-widest"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="bg-[#333333] text-white font-['Bahnschrift'] tracking-widest text-sm py-3 rounded-lg hover:bg-[#555555] transition-colors disabled:opacity-50"
          >
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
  const [editingItem, setEditingItem] = useState<Work | News | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const authHeader = { Authorization: `Bearer ${password}` };

  // Load data
  useEffect(() => {
    fetch("/api/admin/data", { headers: authHeader, cache: "no-store" })
      .then((r) => r.json())
      .then(({ data }) => setWorksData(data))
      .catch(() => setStatusMsg("データの取得に失敗しました。"));
  }, []);

  const currentList = useCallback((): (Work | News)[] => {
    if (!worksData) return [];
    if (activeTab === "music") return worksData.musicWorks;
    if (activeTab === "design") return worksData.designWorks;
    return worksData.newsData;
  }, [worksData, activeTab]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
    setIsDirty(true);
  }

  async function saveOrder() {
    if (!worksData) return;
    setIsSaving(true);
    setStatusMsg("保存中...");
    try {
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ data: worksData }),
      });
      if (res.ok) {
        setIsDirty(false);
        setStatusMsg("順番を保存しました。サイトに反映されるまで1〜2分かかります。");
      } else {
        setStatusMsg("保存に失敗しました。");
      }
    } catch {
      setStatusMsg("保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(index: number) {
    const list = currentList();
    setEditingItem(JSON.parse(JSON.stringify(list[index])));
    setEditingIndex(index);
    setIsNewItem(false);
    setPreviewImageUrl(null);
    setPendingImageFile(null);
  }

  function startNew() {
    if (activeTab === "music") {
      const list = (worksData?.musicWorks ?? []) as Work[];
      const newId = list.length > 0 ? Math.max(...list.map((w) => w.id)) + 1 : 1;
      setEditingItem({
        id: newId, slug: "", filename: "", title: "",
        description: "", tools: "",
        soundcloud: "", youtube: "", niconico: "", spotify: "", appleMusic: "", amazonMusic: "",
      } as Work);
    } else if (activeTab === "design") {
      const list = (worksData?.designWorks ?? []) as Work[];
      const newId = list.length > 0 ? Math.max(...list.map((w) => w.id)) + 1 : 1;
      setEditingItem({
        id: newId, slug: "", filename: "", title: "", description: "", tools: "",
      } as Work);
    } else {
      setEditingItem({ date: "", content: "", link: "" } as News);
    }
    setEditingIndex(null);
    setIsNewItem(true);
    setPreviewImageUrl(null);
    setPendingImageFile(null);
  }

  function cancelEdit() {
    setEditingItem(null);
    setEditingIndex(null);
    setIsNewItem(false);
    setPreviewImageUrl(null);
    setPendingImageFile(null);
  }

  function handleImageChange(file: File) {
    setPendingImageFile(file);
    setPreviewImageUrl(URL.createObjectURL(file));
    if (editingItem && activeTab !== "news") {
      setEditingItem({ ...(editingItem as Work), filename: file.name });
    }
  }

  async function handleDelete(index: number) {
    if (!worksData || !confirm("削除しますか？")) return;
    const list = currentList();
    const item = list[index];

    setIsSaving(true);
    setStatusMsg("削除中...");

    // Delete image if work type
    if (activeTab !== "news") {
      const work = item as Work;
      if (work.filename) {
        try {
          await fetch("/api/admin/image", {
            method: "DELETE",
            headers: { ...authHeader, "Content-Type": "application/json" },
            body: JSON.stringify({ filename: work.filename, type: activeTab }),
          });
        } catch {
          // Image may not exist, continue
        }
      }
    }

    const updated = { ...worksData };
    if (activeTab === "music") updated.musicWorks = [...worksData.musicWorks].filter((_, i) => i !== index);
    else if (activeTab === "design") updated.designWorks = [...worksData.designWorks].filter((_, i) => i !== index);
    else updated.newsData = [...worksData.newsData].filter((_, i) => i !== index);

    try {
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ data: updated }),
      });
      if (res.ok) {
        setWorksData(updated);
        setStatusMsg("削除しました。サイトに反映されるまで1〜2分かかります。");
      } else {
        setStatusMsg("削除に失敗しました。");
      }
    } catch {
      setStatusMsg("削除に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSave() {
    if (!worksData || !editingItem) return;
    setIsSaving(true);
    setStatusMsg("保存中...");

    // Upload image if there's a pending one
    if (pendingImageFile && activeTab !== "news") {
      try {
        const base64 = await resizeImage(
          pendingImageFile,
          pendingImageFile.size > 2 * 1024 * 1024 ? 1200 : undefined
        );
        const uploadRes = await fetch("/api/admin/image", {
          method: "POST",
          headers: { ...authHeader, "Content-Type": "application/json" },
          body: JSON.stringify({
            base64,
            filename: (editingItem as Work).filename,
            type: activeTab,
          }),
        });
        if (!uploadRes.ok) {
          setStatusMsg("画像のアップロードに失敗しました。");
          setIsSaving(false);
          return;
        }
      } catch {
        setStatusMsg("画像のアップロードに失敗しました。");
        setIsSaving(false);
        return;
      }
    }

    // Update slug if title changed (for works)
    let finalItem = { ...editingItem };
    if (activeTab !== "news") {
      const work = finalItem as Work;
      if (!work.slug || isNewItem) {
        work.slug = generateSlug(work.title);
      }
      finalItem = work;
    }

    const updated = { ...worksData };
    if (activeTab === "music") {
      const list = [...worksData.musicWorks];
      if (editingIndex !== null) list[editingIndex] = finalItem as Work;
      else list.push(finalItem as Work);
      updated.musicWorks = list;
    } else if (activeTab === "design") {
      const list = [...worksData.designWorks];
      if (editingIndex !== null) list[editingIndex] = finalItem as Work;
      else list.push(finalItem as Work);
      updated.designWorks = list;
    } else {
      const list = [...worksData.newsData];
      if (editingIndex !== null) list[editingIndex] = finalItem as News;
      else list.push(finalItem as News);
      updated.newsData = list;
    }

    try {
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ data: updated }),
      });
      if (res.ok) {
        setWorksData(updated);
        cancelEdit();
        setStatusMsg("保存しました。サイトに反映されるまで1〜2分かかります。");
      } else {
        setStatusMsg("保存に失敗しました。");
      }
    } catch {
      setStatusMsg("保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  }

  const list = currentList();

  // Preview item: editing item takes priority, otherwise null
  const previewWork = editingItem && activeTab !== "news" ? (editingItem as Work) : null;
  const previewNews = editingItem && activeTab === "news" ? (editingItem as News) : null;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#333333]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="font-['Bahnschrift'] text-base tracking-[0.3em] text-[#333333]">INAGA ADMIN</h1>
          <nav className="flex gap-1">
            {(["music", "design", "news"] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); cancelEdit(); setIsDirty(false); }}
                className={`px-3 py-1.5 text-xs font-['Bahnschrift'] tracking-widest rounded transition-colors ${
                  activeTab === tab
                    ? "bg-[#333333] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={onLogout}
          className="text-xs font-['Bahnschrift'] tracking-widest text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 px-3 py-1.5 rounded hover:border-gray-400"
        >
          LOGOUT
        </button>
      </header>

      {/* Status */}
      {statusMsg && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 md:px-8 py-2 text-xs text-blue-700 font-['Bahnschrift'] tracking-wide">
          {statusMsg}{" "}
          <button onClick={() => setStatusMsg("")} className="ml-2 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-col md:flex-row gap-0 md:gap-6 p-4 md:p-8 max-w-6xl mx-auto">

        {/* Left: Preview */}
        <div className="md:w-[280px] shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:sticky md:top-6">
            <p className="text-xs font-['Bahnschrift'] tracking-widest opacity-50 uppercase mb-4">Preview</p>
            <div className="h-64 md:h-auto flex items-start justify-center overflow-auto">
              {!editingItem && (
                <p className="text-xs opacity-30 font-['Bahnschrift'] tracking-widest pt-8">
                  編集ボタンを押すと<br />プレビューが表示されます
                </p>
              )}
              {previewWork && activeTab === "music" && (
                <MusicPreviewCard work={previewWork} imageUrl={previewImageUrl} />
              )}
              {previewWork && activeTab === "design" && (
                <DesignPreviewCard work={previewWork} imageUrl={previewImageUrl} />
              )}
              {previewNews && (
                <NewsPreviewCard item={previewNews} />
              )}
            </div>
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
              {/* List header */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-['Bahnschrift'] tracking-widest opacity-50 uppercase">
                  {list.length} 件
                </p>
                <button
                  onClick={startNew}
                  className="text-xs font-['Bahnschrift'] tracking-widest bg-[#333333] text-white px-3 py-1.5 rounded hover:bg-[#555555] transition-colors"
                >
                  + 新規追加
                </button>
              </div>

              {/* Sortable list */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={list.map((_, i) => String(i))}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2">
                    {list.map((item, index) => (
                      <SortableItem
                        key={index}
                        id={String(index)}
                        title={
                          activeTab === "news"
                            ? `${(item as News).date} ${(item as News).content.slice(0, 20)}`
                            : (item as Work).title
                        }
                        onEdit={() => startEdit(index)}
                        onDelete={() => handleDelete(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Save order button */}
              {isDirty && (
                <button
                  onClick={saveOrder}
                  disabled={isSaving}
                  className="w-full py-2 text-xs font-['Bahnschrift'] tracking-widest bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors disabled:opacity-50"
                >
                  {isSaving ? "保存中..." : "順番を保存"}
                </button>
              )}

              {/* Edit Form */}
              {editingItem && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 mt-2">
                  <p className="text-xs font-['Bahnschrift'] tracking-widest opacity-50 uppercase mb-4">
                    {isNewItem ? "新規追加" : "編集"}
                  </p>
                  {activeTab === "music" && (
                    <MusicForm
                      item={editingItem as Work}
                      onChange={setEditingItem}
                      onImageChange={handleImageChange}
                    />
                  )}
                  {activeTab === "design" && (
                    <DesignForm
                      item={editingItem as Work}
                      onChange={setEditingItem}
                      onImageChange={handleImageChange}
                    />
                  )}
                  {activeTab === "news" && (
                    <NewsForm
                      item={editingItem as News}
                      onChange={setEditingItem}
                    />
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 py-2 text-xs font-['Bahnschrift'] tracking-widest bg-[#333333] text-white rounded hover:bg-[#555555] transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "保存中..." : "保存"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={isSaving}
                      className="px-4 py-2 text-xs font-['Bahnschrift'] tracking-widest border border-gray-200 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
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

  function handleLogin(pw: string) {
    setPassword(pw);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_password");
    setPassword(null);
  }

  if (!checked) return null;
  if (!password) return <LoginScreen onLogin={handleLogin} />;
  return <AdminDashboard password={password} onLogout={handleLogout} />;
}
