import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bookmark, Check, Clock3, Headphones, Play, Trash2 } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

const artwork = {
  hero: `${import.meta.env.BASE_URL}bangladarshan-hero.svg`,
  library: `${import.meta.env.BASE_URL}bangladarshan-library.svg`,
};

const catalog = {
  "Philosophy 101": { subtitle: "A gentle beginning", description: "A slow walk through wonder, attention, and the courage to ask a better question.", image: artwork.hero, topic: "Philosophy", language: "বাংলা", duration: "1h 21m" },
  "Letters from a River": { subtitle: "On memory & place", description: "Selected essays about the places that hold us, and the rivers that carry memory forward.", image: artwork.library, topic: "Memoir", language: "English", duration: "42 min" },
  "The Art of Attention": { subtitle: "Practices for presence", description: "Short reflections for returning to the texture of the present moment.", image: artwork.hero, topic: "Practice", language: "Deutsch", duration: "12 min" },
};

const chapters = [
  { id: 1, title: "The beginning of wonder", subtitle: "A first encounter with curiosity", duration: "18:42" },
  { id: 2, title: "Learning to notice", subtitle: "Attention as a daily practice", duration: "24:08" },
  { id: 3, title: "A life examined", subtitle: "Questions that make a life", duration: "21:36" },
  { id: 4, title: "The shape of a question", subtitle: "Staying with uncertainty", duration: "16:54" },
];

export default function BookDetail() {
  const [, params] = useRoute("/book/:bookId");
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const title = decodeURIComponent(params?.bookId || "Philosophy 101");
  const book = catalog[title as keyof typeof catalog] || catalog["Philosophy 101"];
  const bookmarksQuery = trpc.library.bookmarks.useQuery({ bookId: title }, { enabled: isAuthenticated });
  const addBookmarkMutation = trpc.library.addBookmark.useMutation({ onSuccess: () => { bookmarksQuery.refetch(); toast.success("Bookmark saved"); }, onError: () => toast.error("Could not save bookmark") });
  const deleteBookmarkMutation = trpc.library.deleteBookmark.useMutation({ onSuccess: () => { bookmarksQuery.refetch(); toast.success("Bookmark removed"); }, onError: () => toast.error("Could not remove bookmark") });
  const [localBookmarks, setLocalBookmarks] = useState<Array<{ id: number; chapterId: number; positionSeconds: number; note: string | null }>>(() => JSON.parse(localStorage.getItem(`bd-bookmarks-${title}`) || "[]"));
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [note, setNote] = useState("");
  const bookmarks = isAuthenticated ? (bookmarksQuery.data || []) : localBookmarks;
  const currentChapter = useMemo(() => chapters.find((item) => item.id === selectedChapter) || chapters[0], [selectedChapter]);

  useEffect(() => {
    localStorage.setItem(`bd-bookmarks-${title}`, JSON.stringify(localBookmarks));
  }, [localBookmarks, title]);

  const addBookmark = () => {
    if (!isAuthenticated) {
      if (!note.trim()) return;
      setLocalBookmarks((items) => [{ id: Date.now(), chapterId: selectedChapter, positionSeconds: 0, note: note.trim() }, ...items]);
      setNote("");
      return;
    }
    addBookmarkMutation.mutate({ bookId: title, chapterId: selectedChapter, positionSeconds: 0, note: note.trim() || undefined });
    setNote("");
  };

  const removeBookmark = (id: number) => {
    if (!isAuthenticated) setLocalBookmarks((items) => items.filter((item) => item.id !== id));
    else deleteBookmarkMutation.mutate({ bookmarkId: id });
  };

  return <main className="detail-page"><header className="detail-topbar"><button className="back-button" onClick={() => setLocation("/")}><ArrowLeft size={16} /> Back to library</button><span className="detail-mark">বাংলা দর্শন</span></header><div className="detail-wrap"><section className="detail-hero"><div className="detail-art"><img src={book.image} alt={`${title} cover`} /><span>THE LISTENING EDITION</span></div><div className="detail-copy"><p className="eyebrow">{book.topic} <span className="bengali-seal">শ্রবণ</span></p><h1>{title}</h1><p className="detail-subtitle">{book.subtitle}</p><p className="detail-description">{book.description}</p><div className="detail-meta"><span><Clock3 size={15} /> {book.duration}</span><span><Headphones size={15} /> {book.language}</span></div><button className="primary-button" onClick={() => setLocation(`/?play=${encodeURIComponent(title)}&chapter=${selectedChapter}`)}><Play size={16} fill="currentColor" /> Listen now <span className="button-arrow"><ArrowLeft size={15} /></span></button></div></section><section className="detail-grid"><div><div className="detail-section-heading"><div><p className="eyebrow">A considered path</p><h2>Chapters</h2></div><span>{chapters.length} chapters</span></div><div className="detail-chapters">{chapters.map((chapter) => <button key={chapter.id} className={selectedChapter === chapter.id ? "detail-chapter active" : "detail-chapter"} onClick={() => setSelectedChapter(chapter.id)}><strong>{String(chapter.id).padStart(2, "0")}</strong><span><b>{chapter.title}</b><small>{chapter.subtitle}</small></span><time>{chapter.duration}</time><Play size={14} /></button>)}</div></div><aside className="bookmark-panel"><div className="detail-section-heading"><div><p className="eyebrow">Private notes</p><h2>Bookmarks</h2></div><Bookmark size={17} /></div><p className="bookmark-context">Chapter {String(currentChapter.id).padStart(2, "0")} · {currentChapter.title}</p><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="What do you want to remember?" aria-label="Bookmark note" /><button className="bookmark-add" onClick={isAuthenticated || note.trim() ? addBookmark : startLogin}><Bookmark size={14} /> {isAuthenticated ? "Save bookmark" : "Sign in to sync"}</button><div className="bookmark-list">{bookmarks.length ? bookmarks.map((item) => <div className="bookmark-item" key={item.id}><div><span>Chapter {String(item.chapterId).padStart(2, "0")}</span><strong>{item.note || "Saved listening point"}</strong></div><button onClick={() => removeBookmark(item.id)} aria-label="Delete bookmark"><Trash2 size={14} /></button></div>) : <div className="bookmark-empty"><Check size={16} /> Your saved listening points will appear here.</div>}</div></aside></section></div></main>;
}
