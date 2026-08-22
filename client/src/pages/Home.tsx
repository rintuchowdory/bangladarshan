/* Design philosophy: River of Thought — contemporary editorial modernism with deep indigo, warm paper, river-mist neutrals, river-line wayfinding, and restrained vermilion action cues. This page keeps audio at the center and uses asymmetric editorial spacing rather than a generic centered dashboard. */

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Headphones,
  Library,
  Download,
  Wifi,
  WifiOff,
  Menu,
  Moon,
  Pause,
  Play,
  Plus,
  RotateCcw,
  RotateCw,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Volume2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

const artwork = {
  hero: "/manus-storage/bangladarshan-hero_7eb066d8.png",
  library: "/manus-storage/bangladarshan-library_6ddc247e.png",
};

type Language = "bn" | "en" | "de";

type Copy = {
  navHome: string;
  navLibrary: string;
  navNotes: string;
  greeting: string;
  heroTitle: string;
  heroBody: string;
  listen: string;
  details: string;
  continueListening: string;
  inProgress: string;
  minutesLeft: string;
  libraryTitle: string;
  allBooks: string;
  bengali: string;
  english: string;
  german: string;
  chapters: string;
  chapter: string;
  nowPlaying: string;
  audioLanguage: string;
  speed: string;
  nextUp: string;
  browse: string;
  comingSoon: string;
  save: string;
  favorites: string;
  searchPlaceholder: string;
  noResults: string;
  listeningHistory: string;
  recentlyPlayed: string;
  resume: string;
  noHistory: string;
};

const copy: Record<Language, Copy> = {
  bn: {
    navHome: "হোম", navLibrary: "লাইব্রেরি", navNotes: "নোটস", greeting: "আজ একটু ভাবুন",
    heroTitle: "ভাবনার জন্য একটি শান্ত জায়গা।", heroBody: "দর্শন, সাহিত্য ও জীবনের বড় প্রশ্ন—শুনুন নিজের ভাষায়, নিজের গতিতে।",
    listen: "এখন শুনুন", details: "বইটি দেখুন", continueListening: "শোনা চালিয়ে যান", inProgress: "চলছে",
    minutesLeft: "মিনিট বাকি", libraryTitle: "আপনার লাইব্রেরি", allBooks: "সব বই", bengali: "বাংলা", english: "English", german: "Deutsch",
    chapters: "অধ্যায়", chapter: "অধ্যায়", nowPlaying: "এখন বাজছে", audioLanguage: "অডিও ভাষা", speed: "গতি", nextUp: "এরপর",
    browse: "লাইব্রেরি দেখুন", comingSoon: "শীঘ্রই আসছে", save: "সংরক্ষণ করুন", favorites: "পছন্দের", searchPlaceholder: "খুঁজুন…", noResults: "কোনও বই পাওয়া যায়নি", listeningHistory: "শোনার ইতিহাস", recentlyPlayed: "সম্প্রতি শোনা", resume: "আবার শুনুন", noHistory: "এখনও কোনও শোনার ইতিহাস নেই",
  },
  en: {
    navHome: "Home", navLibrary: "Library", navNotes: "Notes", greeting: "A little room to think",
    heroTitle: "A quiet place for big ideas.", heroBody: "Philosophy, literature, and the questions that stay with us — in your language, at your pace.",
    listen: "Listen now", details: "View book", continueListening: "Continue listening", inProgress: "In progress",
    minutesLeft: "min left", libraryTitle: "Your library", allBooks: "All books", bengali: "বাংলা", english: "English", german: "Deutsch",
    chapters: "chapters", chapter: "Chapter", nowPlaying: "Now listening", audioLanguage: "Audio language", speed: "Speed", nextUp: "Up next",
    browse: "Browse library", comingSoon: "Coming next", save: "Save for later", favorites: "Favorites", searchPlaceholder: "Search books…", noResults: "No books found", listeningHistory: "Listening history", recentlyPlayed: "Recently played", resume: "Resume", noHistory: "Your listening history will appear here.",
  },
  de: {
    navHome: "Startseite", navLibrary: "Bibliothek", navNotes: "Notizen", greeting: "Ein wenig Raum zum Denken",
    heroTitle: "Ein ruhiger Ort für große Gedanken.", heroBody: "Philosophie, Literatur und die Fragen, die bleiben — in deiner Sprache, in deinem Tempo.",
    listen: "Jetzt anhören", details: "Buch ansehen", continueListening: "Weiterhören", inProgress: "In Arbeit",
    minutesLeft: "Min. übrig", libraryTitle: "Deine Bibliothek", allBooks: "Alle Bücher", bengali: "বাংলা", english: "English", german: "Deutsch",
    chapters: "Kapitel", chapter: "Kapitel", nowPlaying: "Jetzt hörst du", audioLanguage: "Audiosprache", speed: "Geschwindigkeit", nextUp: "Als Nächstes",
    browse: "Bibliothek öffnen", comingSoon: "Demnächst", save: "Für später speichern", favorites: "Favoriten", searchPlaceholder: "Bücher suchen…", noResults: "Keine Bücher gefunden", listeningHistory: "Hörverlauf", recentlyPlayed: "Zuletzt gehört", resume: "Fortsetzen", noHistory: "Dein Hörverlauf erscheint hier.",
  },
};

const chapters = [
  { id: 1, title: "The beginning of wonder", bn: "বিস্ময়ের শুরু", duration: "18:42", progress: 0.18 },
  { id: 2, title: "Learning to notice", bn: "দেখতে শেখা", duration: "24:08", progress: 0 },
  { id: 3, title: "A life examined", bn: "পরীক্ষিত জীবন", duration: "21:36", progress: 0 },
  { id: 4, title: "The shape of a question", bn: "প্রশ্নের অবয়ব", duration: "16:54", progress: 0 },
];

const books = [
  { title: "Philosophy 101", subtitle: "A gentle beginning", author: "The listening edition", tag: "Featured", image: artwork.hero, progress: 0.18, topic: "philosophy", durationMinutes: 81, language: "bn", audioSource: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Spoken_Wikipedia_-_M-105.ogg", },
  { title: "Letters from a River", subtitle: "On memory & place", author: "Selected essays", tag: "New", image: artwork.library, progress: 0, topic: "memoir", durationMinutes: 42, language: "en", audioSource: "https://archive.org/download/philosophy_2501_librivox/philosophy_02_russell_64kb.mp3" },
  { title: "The Art of Attention", subtitle: "Practices for presence", author: "Short reflections", tag: "12 min", image: artwork.hero, progress: 0, topic: "practice", durationMinutes: 12, language: "de", audioSource: "https://archive.org/download/philosophy_2501_librivox/philosophy_03_russell_64kb.mp3" },
];

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? seconds : 0;
  return `${Math.floor(safe / 60).toString().padStart(2, "0")}:${Math.floor(safe % 60).toString().padStart(2, "0")}`;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("bd-language") as Language) || "en");
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [offlineReady, setOfflineReady] = useState(false);
  const [isCaching, setIsCaching] = useState(false);
  const [playbackUrl, setPlaybackUrl] = useState(books[0].audioSource);
  const [dark, setDark] = useState(() => localStorage.getItem("bd-theme") === "dark");
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [progress, setProgress] = useState(() => Number(localStorage.getItem("bd-progress")) || 0.18);
  const [duration, setDuration] = useState(3600);
  const [currentTime, setCurrentTime] = useState(648);
  const [speed, setSpeed] = useState(1);
  const [activeChapter, setActiveChapter] = useState(1);
  const [activeBookId, setActiveBookId] = useState("Philosophy 101");
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem("bd-favorites") || "[]"));
  const [history, setHistory] = useState<Array<{ title: string; chapter: number; progress: number; positionSeconds: number; updatedAt: number }>>(() => {
    const saved = JSON.parse(localStorage.getItem("bd-history") || "[]");
    return saved.length ? saved : [{ title: "Philosophy 101", chapter: 1, progress: 0.18, positionSeconds: 648, updatedAt: Number(localStorage.getItem("bd-last-listened")) || Date.now() }];
  });
  const [showLanguages, setShowLanguages] = useState(false);
  const [topicFilter, setTopicFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [location, setLocation] = useLocation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const t = copy[language];
  const { user, isAuthenticated } = useAuth();
  const activeBook = books.find((book) => book.title === activeBookId) || books[0];
  const favoritesQuery = trpc.library.favorites.useQuery(undefined, { enabled: isAuthenticated });
  const historyQuery = trpc.library.history.useQuery(undefined, { enabled: isAuthenticated });
  const favoriteMutation = trpc.library.toggleFavorite.useMutation();
  const historyMutation = trpc.library.saveHistory.useMutation();
  const filteredBooks = useMemo(() => books.filter((book) => {
    const matchesQuery = `${book.title} ${book.subtitle} ${book.author}`.toLowerCase().includes(query.toLowerCase());
    const matchesFavorites = !showFavorites || favorites.includes(book.title);
    const matchesTopic = topicFilter === "all" || book.topic === topicFilter;
    const matchesDuration = durationFilter === "all" || (durationFilter === "short" ? book.durationMinutes <= 20 : durationFilter === "medium" ? book.durationMinutes > 20 && book.durationMinutes <= 60 : book.durationMinutes > 60);
    const matchesLanguage = languageFilter === "all" || book.language === languageFilter;
    return matchesQuery && matchesFavorites && matchesTopic && matchesDuration && matchesLanguage;
  }), [durationFilter, favorites, languageFilter, query, showFavorites, topicFilter]);

  useEffect(() => {
    let objectUrl: string | undefined;
    setAudioError(false);
    setPlaybackUrl(activeBook.audioSource);
    caches.open("bangladarshan-v1").then((cache) => cache.match(activeBook.audioSource)).then((response) => response?.blob()).then((blob) => {
      if (blob) { objectUrl = URL.createObjectURL(blob); setPlaybackUrl(objectUrl); }
    }).catch(() => undefined);
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [activeBook.audioSource]);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("bd-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("bd-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    let cancelled = false;
    setOfflineReady(false);
    caches.open("bangladarshan-v1").then((cache) => cache.match(activeBook.audioSource)).then((response) => {
      if (!cancelled) setOfflineReady(Boolean(response));
    }).catch(() => {
      if (!cancelled) setOfflineReady(false);
    });
    return () => { cancelled = true; };
  }, [activeBook.audioSource]);

  useEffect(() => {
    localStorage.setItem("bd-progress", String(progress));
  }, [progress]);

  useEffect(() => {
    const entry = history.find((item) => item.title === activeBookId);
    if (!entry) return;
    const position = entry.positionSeconds ?? Math.round(entry.progress * duration);
    if (Math.abs(currentTime - position) > 1) {
      setActiveChapter(entry.chapter);
      setCurrentTime(position);
      setProgress(duration ? position / duration : entry.progress);
    }
  }, [activeBookId, currentTime, duration, history]);

  useEffect(() => {
    localStorage.setItem("bd-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("bd-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (favoritesQuery.data) setFavorites(favoritesQuery.data.map((item) => item.bookId));
  }, [favoritesQuery.data]);

  useEffect(() => {
    if (historyQuery.data?.length) setHistory(historyQuery.data.map((item) => ({ title: item.bookId, chapter: item.chapterId, progress: item.progress / 100, positionSeconds: item.positionSeconds, updatedAt: item.lastListenedAt.getTime() })));
  }, [historyQuery.data]);

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    const requestedBook = params.get("play");
    if (requestedBook && books.some((book) => book.title === requestedBook)) {
      const requestedEntry = history.find((entry) => entry.title === requestedBook);
      const requestedChapter = Number(params.get("chapter")) || requestedEntry?.chapter || 1;
      const requestedProgress = requestedEntry?.progress || books.find((book) => book.title === requestedBook)?.progress || 0;
      const requestedPosition = requestedEntry?.positionSeconds ?? Math.round(requestedProgress * duration);
      setActiveBookId(requestedBook);
      setActiveChapter(requestedChapter);
      setProgress(duration ? requestedPosition / duration : requestedProgress);
      setCurrentTime(requestedPosition);
      setPlaying(true);
      setLocation("/");
    }
  }, [duration, history, location, setLocation]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
  }, [playbackUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
    if (playing) {
      if (audio.readyState < 2) {
        audio.load();
        audio.addEventListener("canplay", () => audio.play().catch(() => setPlaying(false)), { once: true });
      } else {
        audio.play().catch(() => setPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [playing, speed]);

  const remaining = useMemo(() => Math.max(1, Math.round((duration * (1 - progress)) / 60)), [duration, progress]);
  const cacheAudioForOffline = async () => {
    if (offlineReady) return toast.success("Audio is already available offline");
    setIsCaching(true);
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 120000);
      const response = await fetch(activeBook.audioSource, { mode: "cors", signal: controller.signal });
      window.clearTimeout(timeout);
      if (!response.ok) throw new Error("Audio request failed");
      const cache = await caches.open("bangladarshan-v1");
      await cache.put(activeBook.audioSource, response.clone());
      setOfflineReady(true);
      localStorage.setItem(`bd-audio-cached:${activeBook.title}`, "true");
      toast.success("Audio saved for offline listening");
    } catch {
      toast.error("Could not save audio. Try again while online.");
    } finally {
      setIsCaching(false);
    }
  };

  const formatRelative = (timestamp: number) => {
    const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
    if (minutes < 1) return language === "de" ? "Gerade eben" : language === "bn" ? "এইমাত্র" : "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };
  const recordHistory = (chapter = activeChapter, bookId = activeBookId, progressOverride = progress, positionSecondsOverride = currentTime) => {
    const entry = { title: bookId, chapter, progress: progressOverride, positionSeconds: Math.max(0, Math.round(positionSecondsOverride)), updatedAt: Date.now() };
    setHistory((current) => [entry, ...current.filter((item) => item.title !== entry.title)].slice(0, 6));
    localStorage.setItem("bd-last-listened", String(entry.updatedAt));
    if (isAuthenticated) historyMutation.mutate({ bookId: entry.title, chapterId: entry.chapter, progress: Math.round(entry.progress * 100), positionSeconds: entry.positionSeconds }, { onSuccess: () => toast.success("Listening progress synced"), onError: () => toast.error("Could not sync listening progress") });
  };
  const resumeHistory = (entry: { title: string; chapter: number; progress: number; positionSeconds?: number }) => {
    const position = entry.positionSeconds ?? Math.round(entry.progress * duration);
    setActiveBookId(entry.title);
    setActiveChapter(entry.chapter);
    setProgress(duration ? position / duration : entry.progress);
    setCurrentTime(position);
    setPlaying(true);
    toast.success(`${t.resume}: ${entry.title}`);
  };
  const togglePlaying = () => {
    setPlaying((value) => {
      const next = !value;
      recordHistory();
      return next;
    });
  };
  useEffect(() => {
    const persistPosition = () => {
      const saved = JSON.parse(localStorage.getItem("bd-history") || "[]");
      const entry = { title: activeBookId, chapter: activeChapter, progress: duration ? currentTime / duration : progress, positionSeconds: Math.max(0, Math.round(currentTime)), updatedAt: Date.now() };
      localStorage.setItem("bd-history", JSON.stringify([entry, ...saved.filter((item: { title?: string }) => item.title !== activeBookId)].slice(0, 6)));
    };
    window.addEventListener("beforeunload", persistPosition);
    document.addEventListener("visibilitychange", persistPosition);
    return () => {
      window.removeEventListener("beforeunload", persistPosition);
      document.removeEventListener("visibilitychange", persistPosition);
    };
  }, [activeBookId, activeChapter, currentTime, duration, progress]);

  const seek = (amount: number) => {
    const next = Math.max(0, Math.min(duration, currentTime + amount));
    setCurrentTime(next);
    setProgress(duration ? next / duration : progress);
    if (audioRef.current) audioRef.current.currentTime = next;
    recordHistory(activeChapter, activeBookId, duration ? next / duration : progress, next);
  };
  const selectBook = (title: string) => {
    setActiveBookId(title);
    setOfflineReady(localStorage.getItem(`bd-audio-cached:${title}`) === "true");
    setActiveChapter(1);
    setPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    recordHistory(1, title, 0, 0);
  };
  const selectChapter = (id: number) => {
    setActiveChapter(id);
    setPlaying(true);
    recordHistory(id, activeBookId, progress, currentTime);
    toast.success(`${t.chapter} ${id} selected`);
  };
  const showComingSoon = () => toast(t.comingSoon, { description: "Preference controls will arrive in a future release." });
  const toggleFavorite = (title: string) => {
    const wasFavorite = favorites.includes(title);
    setFavorites((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
    if (isAuthenticated) favoriteMutation.mutate({ bookId: title }, { onSuccess: () => toast.success("Favorites synced"), onError: () => toast.error("Could not sync favorite") });
    toast(wasFavorite ? `${title} removed from ${t.favorites}` : `${title} saved to ${t.favorites}`);
  };

  return (
    <div className="app-shell">
      <audio ref={audioRef} src={playbackUrl} preload="metadata" onLoadedMetadata={(event) => { setAudioError(false); setDuration(event.currentTarget.duration); }} onError={() => { setPlaying(false); setAudioError(true); toast.error("This audio could not be loaded. Please try again online."); }} onTimeUpdate={(event) => { setCurrentTime(event.currentTarget.currentTime); setProgress(event.currentTarget.currentTime / (event.currentTarget.duration || duration)); }} onEnded={() => setPlaying(false)} />
      {audioError && <div className="audio-error" role="alert"><Volume2 size={15} /> Audio unavailable. Check your connection and try again.</div>}
      <aside className={`side-rail ${showMenu ? "side-rail-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><img src="/manus-storage/bangladarshan-logo_d145d3b4.png" alt="" /></div>
          <span>Bangla<span>Darshan</span></span><i className="brand-seal">শ্রবণ</i>
        </div>
        <nav className="primary-nav" aria-label="Primary navigation">
          <button className="nav-item active"><Library size={17} /> {t.navHome}</button>
          <button className="nav-item" onClick={() => { setShowFavorites(false); document.getElementById("library")?.scrollIntoView({ behavior: "smooth" }); }}><BookOpen size={17} /> {t.navLibrary}</button>
          <button className="nav-item" onClick={showComingSoon}><Sparkles size={17} /> {t.navNotes}<span className="nav-soon">0.2</span></button>
        </nav>
        <div className="rail-note"><span className="rail-note-line" /><p>“The unexamined life is not worth living.”</p><small>— Socrates</small></div>
        <div className="rail-bottom">
          <button className="nav-item" onClick={() => setDark((value) => !value)}>{dark ? <Sun size={17} /> : <Moon size={17} />}{dark ? "Light mode" : "Dark mode"}</button>
          <button className="profile-row" onClick={() => isAuthenticated ? toast("Your account keeps favorites and listening history in sync.") : startLogin()}><span className="avatar">{user?.name?.slice(0, 1) || "R"}</span><span><strong>{user?.name || "Reader"}</strong><small>{isAuthenticated ? (favoritesQuery.isLoading || historyQuery.isLoading ? "Syncing…" : favoritesQuery.isError || historyQuery.isError ? "Offline mode" : "Synced account") : "Sign in to sync"}</small></span><Settings2 size={16} /></button>
        </div>
      </aside>

      <main className="main-canvas">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setShowMenu((value) => !value)} aria-label="Open menu">{showMenu ? <X size={20} /> : <Menu size={20} />}</button>
          <div className="breadcrumb"><span>BanglaDarshan</span><span className="breadcrumb-slash">/</span><strong>{t.navHome}</strong></div>
          <div className="top-actions"><span className={`connectivity-status ${isOnline ? "online" : "offline"}`} title={isOnline ? "Online" : "Offline"}>{isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}<span>{isOnline ? "Online" : "Offline"}</span></span>
            <button className={`icon-button ${showSearch ? "icon-button-active" : ""}`} aria-label="Search" onClick={() => setShowSearch((value) => !value)}><Search size={18} /></button>
            <div className="language-menu">
              <button className="language-button" onClick={() => setShowLanguages((value) => !value)} aria-expanded={showLanguages}>{language === "bn" ? "বাংলা" : language === "de" ? "Deutsch" : "English"}<ChevronDown size={15} /></button>
              {showLanguages && <div className="language-popover">{(["en", "bn", "de"] as Language[]).map((item) => <button key={item} onClick={() => { setLanguage(item); setShowLanguages(false); }} className={item === language ? "selected" : ""}>{item === "bn" ? "বাংলা" : item === "de" ? "Deutsch" : "English"}{item === language && <Check size={14} />}</button>)}</div>}
            </div>
            <button className="avatar top-avatar" aria-label="Open profile">R</button>
          </div>
        </header>

        <div className="content-wrap">
          {showSearch && <div className="search-panel"><Search size={17} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} /><div className="search-filters"><select value={topicFilter} onChange={(event) => setTopicFilter(event.target.value)} aria-label="Topic"><option value="all">All topics</option><option value="philosophy">Philosophy</option><option value="memoir">Memoir</option><option value="practice">Practice</option></select><select value={durationFilter} onChange={(event) => setDurationFilter(event.target.value)} aria-label="Duration"><option value="all">Any duration</option><option value="short">Under 20 min</option><option value="medium">20–60 min</option><option value="long">Over 60 min</option></select><select value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)} aria-label="Content language"><option value="all">Any language</option><option value="bn">বাংলা</option><option value="en">English</option><option value="de">Deutsch</option></select></div><button onClick={() => { setQuery(""); setTopicFilter("all"); setDurationFilter("all"); setLanguageFilter("all"); setShowSearch(false); }} aria-label="Close search"><X size={16} /></button></div>}
          <section className="welcome-row"><div><p className="eyebrow">{t.greeting} <span className="eyebrow-dot" /></p><h1>{t.heroTitle}</h1><p className="lede">{t.heroBody}</p></div><button className="round-action" onClick={showComingSoon} aria-label="Adjust preferences"><SlidersHorizontal size={19} /></button></section>

          <section className="feature-layout">
            <div className="feature-art"><img src={artwork.hero} alt="Abstract indigo river-map artwork" /><span className="river-line river-line-art" aria-hidden="true"><i /></span><div className="art-caption"><span>01</span><span>THE LISTENING EDITION</span></div></div>
            <div className="feature-copy"><div className="tag-row"><span className="pill accent-pill">{t.inProgress}</span><span className="muted-label">{t.bengali} · 4 {t.chapters}</span></div><h2>{activeBook.title}</h2><p className="feature-subtitle">{language === "bn" ? "একটি কোমল শুরু" : language === "de" ? "Ein sanfter Anfang" : "A gentle beginning"}</p><p className="feature-description">A slow walk through the ideas that shape a life: wonder, attention, and the courage to ask a better question.</p><div className="feature-meta"><span><Clock3 size={15} /> 1h 21m</span><span><Headphones size={15} /> 4.8k listeners</span></div><div className="feature-cta"><button className="primary-button" onClick={togglePlaying}>{playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}{playing ? "Pause" : t.continueListening}<span className="button-arrow"><ArrowRight size={16} /></span></button><button className="text-button" onClick={cacheAudioForOffline} disabled={isCaching}><Download size={16} /> {isCaching ? "Saving…" : offlineReady ? "Saved offline" : "Save offline"}</button></div></div>
          </section>

          <section className="continue-section"><div className="section-heading"><div><p className="eyebrow">{t.inProgress} <span className="bengali-seal">শোনা · ০১</span></p><h2>{t.continueListening}</h2></div><button className="link-button" onClick={showComingSoon}>{t.browse} <ArrowRight size={15} /></button></div><div className="continue-card"><img src={activeBook.image} alt={`${activeBook.title} cover`} /><div className="continue-info"><div className="continue-info-top"><div><strong>{activeBook.title}</strong><span>{t.chapter} 01 · {language === "bn" ? "বিস্ময়ের শুরু" : "The beginning of wonder"}</span></div><span className="time-left">{remaining} {t.minutesLeft}</span></div><div className="progress-track"><span style={{ width: `${Math.max(3, progress * 100)}%` }} /><i className="river-line-dot" /></div><div className="continue-bottom"><span>{formatTime(currentTime)} / {formatTime(duration)}</span><button onClick={togglePlaying}>{playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />} {playing ? "Pause" : t.listen}</button></div></div><div className="continue-play"><button onClick={togglePlaying} aria-label={playing ? "Pause playback" : "Play playback"}>{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button></div></div></section>

          <section className="history-section"><div className="section-heading"><div><p className="eyebrow">{t.listeningHistory} <span className="bengali-seal">পথের চিহ্ন</span></p><h2>{t.recentlyPlayed}</h2></div><span className="history-note">{history.length} {history.length === 1 ? "title" : "titles"}</span></div>{history.length ? <div className="history-list">{history.map((entry) => <article className="history-card" key={`${entry.title}-${entry.updatedAt}`}><div className="history-art"><img src={entry.title === "Letters from a River" ? artwork.library : artwork.hero} alt="" /><span>{String(entry.chapter).padStart(2, "0")}</span></div><div className="history-copy"><strong>{entry.title}</strong><span>{t.chapter} {String(entry.chapter).padStart(2, "0")} · {formatRelative(entry.updatedAt)}</span><div className="history-progress"><i style={{ width: `${Math.max(4, entry.progress * 100)}%` }} /></div></div><button className="history-resume" onClick={() => resumeHistory(entry)} aria-label={`${t.resume} ${entry.title}`}><Play size={15} fill="currentColor" /></button></article>)}</div> : <div className="history-empty"><Clock3 size={18} /><span>{t.noHistory}</span></div>}</section>

          <section className="library-section" id="library"><div className="section-heading library-heading"><div><p className="eyebrow">{t.libraryTitle}</p><h2>{t.libraryTitle}</h2></div><div className="filter-tabs"><button className={!showFavorites ? "active" : ""} onClick={() => setShowFavorites(false)}>{t.allBooks}</button><button className={showFavorites ? "active" : ""} onClick={() => setShowFavorites(true)}>{t.favorites} <span className="favorites-count">{favorites.length}</span></button><button className={languageFilter === "bn" ? "active" : ""} onClick={() => { setShowFavorites(false); setLanguageFilter("bn"); }}>{t.bengali}</button><button className={languageFilter === "en" ? "active" : ""} onClick={() => { setShowFavorites(false); setLanguageFilter("en"); }}>{t.english}</button><button className={languageFilter === "de" ? "active" : ""} onClick={() => { setShowFavorites(false); setLanguageFilter("de"); }}>{t.german}</button></div></div><div className="book-grid">{filteredBooks.length ? filteredBooks.map((book, index) => <article className={`book-card ${index === 1 ? "book-card-offset" : ""}`} key={book.title} onDoubleClick={() => setLocation(`/book/${encodeURIComponent(book.title)}`)}><div className="book-image"><img src={book.image} alt="" /><span className="book-tag">{book.tag}</span><button className={`favorite-toggle ${favorites.includes(book.title) ? "is-favorite" : ""}`} onClick={() => toggleFavorite(book.title)} aria-label={`${favorites.includes(book.title) ? "Remove" : "Save"} ${book.title} ${t.favorites}`}>{favorites.includes(book.title) ? "♥" : "♡"}</button><button className="book-play" onClick={() => selectBook(book.title)} aria-label={`${t.listen} ${book.title}`}><Play size={15} fill="currentColor" /></button></div><div className="book-details"><span className="book-kicker">{index === 0 ? "PHILOSOPHY" : index === 1 ? "MEMOIR" : "PRACTICE"}</span><h3>{book.title}</h3><p>{book.subtitle}</p><small>{book.author}</small><button className="book-detail-link" onClick={() => setLocation(`/book/${encodeURIComponent(book.title)}`)}>{t.details} <ArrowRight size={13} /></button></div></article>) : <div className="empty-library"><Search size={20} /><strong>{t.noResults}</strong><span>{query || showFavorites ? "Try another title or browse all books." : "Save a book to see it here."}</span></div>}</div></section>

          <section className="chapters-section"><div className="section-heading"><div><p className="eyebrow">{t.nowPlaying} <span className="bengali-seal">ভাবনার পথ</span></p><h2>{t.chapters}</h2></div><div className="player-language"><span>{t.audioLanguage}</span><button onClick={() => { const next = language === "bn" ? "en" : language === "en" ? "de" : "bn"; setLanguage(next); }}>{language === "bn" ? "বাংলা" : language === "de" ? "Deutsch" : "English"}<ChevronDown size={14} /></button></div></div><div className="chapter-list"><span className="chapter-rail" aria-hidden="true" />{chapters.map((item) => <button key={item.id} className={`chapter-row ${activeChapter === item.id ? "current" : ""}`} onClick={() => selectChapter(item.id)}><span className="chapter-number">{String(item.id).padStart(2, "0")}</span><span className="chapter-title"><strong>{language === "bn" ? item.bn : item.title}</strong><small>{t.chapter} {String(item.id).padStart(2, "0")}</small></span><span className="chapter-progress">{item.progress > 0 && <i style={{ width: `${item.progress * 100}%` }} />}</span><span className="chapter-duration">{item.duration}</span><span className="chapter-state">{activeChapter === item.id ? <Pause size={16} fill="currentColor" /> : <Play size={16} />}</span></button>)}</div></section>
        </div>
      </main>

      <div className={`player-dock ${playing ? "is-playing" : ""}`}><div className="dock-art"><img src={activeBook.image} alt="" /><span className="dock-bars"><i /><i /><i /><i /></span></div><div className="dock-title"><small>{t.nowPlaying}</small><strong>{activeBook.title}</strong><span>{t.chapter} {activeChapter} · {language === "bn" ? "বাংলা" : language === "de" ? "Deutsch" : "English"}</span></div><div className="dock-controls"><button onClick={() => seek(-15)} aria-label="Back 15 seconds"><RotateCcw size={17} /></button><button className="dock-play" onClick={togglePlaying} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><button onClick={() => seek(30)} aria-label="Forward 30 seconds"><RotateCw size={17} /></button></div><div className="dock-progress"><div className="dock-times"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div><input aria-label="Playback progress" type="range" min="0" max={duration} value={currentTime} onChange={(event) => { const value = Number(event.target.value); setCurrentTime(value); setProgress(value / duration); if (audioRef.current) audioRef.current.currentTime = value; }} /></div><div className="dock-options"><button onClick={() => setSpeed((value) => value === 1 ? 1.25 : value === 1.25 ? 1.5 : 1)}>{speed}×</button><Volume2 size={17} /><button onClick={() => toast(t.comingSoon)} aria-label="More options"><ChevronDown size={16} /></button></div></div>
    </div>
  );
}
