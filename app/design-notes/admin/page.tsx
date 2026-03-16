"use client";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type DesignNote = { id: number; title: string; content: string; };
type WorksData = Record<string, unknown> & { designNotes: DesignNote[] };

// ─────────────────────────────────────────────
// LoginScreen
// ─────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { sessionStorage.setItem("admin_password", password); onLogin(password); }
      else setError("パスワードが正しくありません。");
    } catch { setError("エラーが発生しました。"); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-xs">
        <h1 className="font-['Bahnschrift'] text-xl tracking-[0.3em] text-center mb-8 text-[#333333] uppercase">
          Design Notes Admin
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
function AdminDashboard({ password }: { password: string }) {
  const authHeader = { Authorization: `Bearer ${password}` };

  const [worksData, setWorksData] = useState<WorksData | null>(null);
  const [notes, setNotes] = useState<DesignNote[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);
  const [isCommitPending, setIsCommitPending] = useState(false);

  // Load data
  useEffect(() => {
    fetch("/api/admin/data", { headers: authHeader, cache: "no-store" })
      .then((r) => r.json())
      .then(({ data }) => {
        setWorksData(data);
        setNotes(data.designNotes ?? []);
      })
      .catch(() => setStatusMsg("データの読み込みに失敗しました。"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startEdit(note: DesignNote) {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsNew(false);
  }

  function startNew() {
    const newId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
    setEditingId(newId);
    setEditTitle("");
    setEditContent("");
    setIsNew(true);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setIsNew(false);
  }

  function handleSave() {
    if (!worksData) return;
    const note: DesignNote = { id: editingId!, title: editTitle, content: editContent };
    let updated: DesignNote[];
    if (isNew) {
      updated = [...notes, note];
    } else {
      updated = notes.map((n) => (n.id === editingId ? note : n));
    }
    setNotes(updated);
    setWorksData({ ...worksData, designNotes: updated });
    setIsCommitPending(true);
    cancelEdit();
  }

  function handleDelete(id: number) {
    if (!worksData) return;
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    setWorksData({ ...worksData, designNotes: updated });
    setIsCommitPending(true);
  }

  async function handleCommit() {
    if (!worksData) return;
    setIsCommitting(true);
    setStatusMsg("コミット中...");
    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ data: worksData }),
    });
    if (res.ok) {
      setIsCommitPending(false);
      setStatusMsg("コミット完了！サイトに反映されるまで1〜2分かかります。");
    } else {
      setStatusMsg("コミットに失敗しました。");
    }
    setIsCommitting(false);
  }

  if (!worksData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="font-['Bahnschrift'] text-sm tracking-[0.3em] opacity-40">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#333333]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#333333]/10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-['Bahnschrift'] text-[9pt] tracking-[0.3em] uppercase opacity-70">
            Design Notes Admin
          </h1>
          <div className="flex items-center gap-4">
            {statusMsg && (
              <span className="font-['Mobo'] text-[8pt] opacity-50 max-w-[200px] truncate">
                {statusMsg}
              </span>
            )}
            {isCommitPending && (
              <button
                onClick={handleCommit}
                disabled={isCommitting}
                className="font-['Bahnschrift'] text-[7.5pt] tracking-[0.2em] uppercase bg-[#333333] text-white px-4 py-2 hover:bg-[#555555] transition-colors disabled:opacity-50"
              >
                {isCommitting ? "..." : "COMMIT"}
              </button>
            )}
            <a
              href="/design-notes"
              className="font-['Bahnschrift'] text-[7.5pt] tracking-[0.2em] uppercase opacity-40 hover:opacity-80 transition-opacity no-underline"
            >
              ← BACK TO DESIGN NOTES
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <p className="font-['Bahnschrift'] text-[7.5pt] tracking-[0.3em] opacity-40 uppercase">
            NOTES ({notes.length})
          </p>
          <button
            onClick={startNew}
            className="font-['Bahnschrift'] text-[7.5pt] tracking-[0.2em] uppercase border border-[#333333]/30 px-4 py-2 hover:border-[#333333] transition-colors"
          >
            + ADD NOTE
          </button>
        </div>

        {/* Edit / New form */}
        {editingId !== null && (
          <div className="border border-[#333333]/20 p-6 mb-6 bg-gray-50 rounded-sm">
            <p className="font-['Bahnschrift'] text-[7pt] tracking-[0.3em] opacity-40 uppercase mb-4">
              {isNew ? "新規追加" : "編集中"}
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-['Bahnschrift'] text-[7pt] tracking-[0.25em] opacity-50 uppercase">
                  TITLE
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="タイトル"
                  className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 font-['Mobo']"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-['Bahnschrift'] text-[7pt] tracking-[0.25em] opacity-50 uppercase">
                  CONTENT
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="内容..."
                  rows={5}
                  className="border border-gray-200 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-gray-400 font-['Mobo'] leading-[1.9]"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelEdit}
                  className="font-['Bahnschrift'] text-[7.5pt] tracking-[0.2em] uppercase opacity-40 hover:opacity-80 transition-opacity px-4 py-2"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  disabled={!editTitle.trim()}
                  className="font-['Bahnschrift'] text-[7.5pt] tracking-[0.2em] uppercase bg-[#333333] text-white px-5 py-2 hover:bg-[#555555] transition-colors disabled:opacity-40"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes list */}
        <div className="flex flex-col gap-4">
          {notes.length === 0 && (
            <p className="font-['Mobo'] text-[9pt] opacity-40 text-center py-8">
              ノートがありません。「+ ADD NOTE」から追加してください。
            </p>
          )}
          {notes.map((note) => (
            <div
              key={note.id}
              className="border border-[#333333]/10 rounded-sm p-5 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-['Mobo-bold'] text-[10.5pt] tracking-wider leading-snug flex-1">
                  {note.title}
                </h3>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => startEdit(note)}
                    className="font-['Bahnschrift'] text-[7pt] tracking-[0.2em] uppercase opacity-40 hover:opacity-80 transition-opacity"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="font-['Bahnschrift'] text-[7pt] tracking-[0.2em] uppercase text-red-400 hover:text-red-600 transition-colors opacity-60 hover:opacity-100"
                  >
                    DELETE
                  </button>
                </div>
              </div>
              <p className="font-['Mobo'] text-[9pt] leading-[1.9] opacity-60">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page entry point
// ─────────────────────────────────────────────
export default function DesignNotesAdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setPassword("dev");
      setChecked(true);
      return;
    }
    const saved = sessionStorage.getItem("admin_password");
    if (saved) setPassword(saved);
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!password) return <LoginScreen onLogin={(pw) => setPassword(pw)} />;
  return <AdminDashboard password={password} />;
}
