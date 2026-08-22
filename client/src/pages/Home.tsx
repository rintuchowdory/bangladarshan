/* Design philosophy: River of Thought — contemporary editorial modernism with deep indigo, warm paper, river-mist neutrals, river-line wayfinding, and restrained vermilion action cues. This page keeps audio at the center and uses asymmetric editorial spacing rather than a generic centered dashboard. */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Headphones,
  Library,
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

const artwork = {
  hero: "/manus-storage/bangladarshan-hero_7eb066d8.png",
  library: "/manus-storage/bangladarshan-library_6ddc247e.png",
};

const audioSource = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

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
  { title: "Philosophy 101", subtitle: "A gentle beginning", author: "The listening edition", tag: "Featured", image: artwork.hero, progress: 0.18 },
  { title: "Letters from a River", subtitle: "On memory & place", author: "Selected essays", tag: "New", image: artwork.library, progress: 0 },
  { title: "The Art of Attention", subtitle: "Practices for presence", author: "Short reflections", tag: "12 min", image: artwork.hero, progress: 0 },
];

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? seconds : 0;
  return `${Math.floor(safe / 60).toString().padStart(2, "0")}:${Math.floor(safe % 60).toString().padStart(2, "0")}`;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("bd-language") as Language) || "en");
  const [dark, setDark] = useState(() => localStorage.getItem("bd-theme") === "dark");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(() => Number(localStorage.getItem("bd-progress")) || 0.18);
  const [duration, setDuration] = useState(3600);
  const [currentTime, setCurrentTime] = useState(648);
  const [speed, setSpeed] = useState(1);
  const [activeChapter, setActiveChapter] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem("bd-favorites") || "[]"));
  const [history, setHistory] = useState<Array<{ title: string; chapter: number; progress: number; updatedAt: number }>>(() => {
    const saved = JSON.parse(localStorage.getItem("bd-history") || "[]");
    return saved.length ? saved : [{ title: "Philosophy 101", chapter: 1, progress: 0.18, updatedAt: Number(localStorage.getItem("bd-last-listened")) || Date.now() }];
  });
  const [showLanguages, setShowLanguages] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const t = copy[language];
  const filteredBooks = useMemo(() => books.filter((book) => {
    const matchesQuery = `${book.title} ${book.subtitle} ${book.author}`.toLowerCase().includes(query.toLowerCase());
    const matchesFavorites = !showFavorites || favorites.includes(book.title);
    return matchesQuery && matchesFavorites;
  }), [favorites, query, showFavorites]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("bd-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("bd-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem("bd-progress", String(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("bd-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("bd-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, speed]);

  const remaining = useMemo(() => Math.max(1, Math.round((duration * (1 - progress)) / 60)), [duration, progress]);

  const formatRelative = (timestamp: number) => {
    const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
    if (minutes < 1) return language === "de" ? "Gerade eben" : language === "bn" ? "এইমাত্র" : "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };
  const recordHistory = (chapter = activeChapter) => {
    const entry = { title: "Philosophy 101", chapter, progress, updatedAt: Date.now() };
    setHistory((current) => [entry, ...current.filter((item) => item.title !== entry.title)].slice(0, 6));
    localStorage.setItem("bd-last-listened", String(entry.updatedAt));
  };
  const resumeHistory = (entry: { title: string; chapter: number; progress: number }) => {
    setActiveChapter(entry.chapter);
    setProgress(entry.progress);
    setCurrentTime(entry.progress * duration);
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
  const seek = (amount: number) => {
    const next = Math.max(0, Math.min(duration, currentTime + amount));
    setCurrentTime(next);
    if (audioRef.current) audioRef.current.currentTime = next;
  };
  const selectChapter = (id: number) => {
    setActiveChapter(id);
    setPlaying(true);
    toast.success(`${t.chapter} ${id} selected`);
  };
  const showComingSoon = () => toast(t.comingSoon, { description: "Bookmarks and listening history are part of the next release." });
  const toggleFavorite = (title: string) => {
    setFavorites((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
    toast(favorites.includes(title) ? `${title} removed from ${t.favorites}` : `${title} saved to ${t.favorites}`);
  };

  return (
    <div className="app-shell">
      <audio ref={audioRef} src={audioSource} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => { setCurrentTime(event.currentTarget.currentTime); setProgress(event.currentTarget.currentTime / (event.currentTarget.duration || duration)); }} onEnded={() => setPlaying(false)} />
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
          <button className="profile-row" onClick={() => toast("Profile settings are coming next.")}><span className="avatar">R</span><span><strong>Reader</strong><small>Quiet learner</small></span><Settings2 size={16} /></button>
        </div>
      </aside>

      <main className="main-canvas">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setShowMenu((value) => !value)} aria-label="Open menu">{showMenu ? <X size={20} /> : <Menu size={20} />}</button>
          <div className="breadcrumb"><span>BanglaDarshan</span><span className="breadcrumb-slash">/</span><strong>{t.navHome}</strong></div>
          <div className="top-actions">
            <button className={`icon-button ${showSearch ? "icon-button-active" : ""}`} aria-label="Search" onClick={() => setShowSearch((value) => !value)}><Search size={18} /></button>
            <div className="language-menu">
              <button className="language-button" onClick={() => setShowLanguages((value) => !value)} aria-expanded={showLanguages}>{language === "bn" ? "বাংলা" : language === "de" ? "Deutsch" : "English"}<ChevronDown size={15} /></button>
              {showLanguages && <div className="language-popover">{(["en", "bn", "de"] as Language[]).map((item) => <button key={item} onClick={() => { setLanguage(item); setShowLanguages(false); }} className={item === language ? "selected" : ""}>{item === "bn" ? "বাংলা" : item === "de" ? "Deutsch" : "English"}{item === language && <Check size={14} />}</button>)}</div>}
            </div>
            <button className="avatar top-avatar" aria-label="Open profile">R</button>
          </div>
        </header>

        <div className="content-wrap">
          {showSearch && <div className="search-panel"><Search size={17} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} /><button onClick={() => { setQuery(""); setShowSearch(false); }} aria-label="Close search"><X size={16} /></button></div>}
          <section className="welcome-row"><div><p className="eyebrow">{t.greeting} <span className="eyebrow-dot" /></p><h1>{t.heroTitle}</h1><p className="lede">{t.heroBody}</p></div><button className="round-action" onClick={showComingSoon} aria-label="Adjust preferences"><SlidersHorizontal size={19} /></button></section>

          <section className="feature-layout">
            <div className="feature-art"><img src={artwork.hero} alt="Abstract indigo river-map artwork" /><span className="river-line river-line-art" aria-hidden="true"><i /></span><div className="art-caption"><span>01</span><span>THE LISTENING EDITION</span></div></div>
            <div className="feature-copy"><div className="tag-row"><span className="pill accent-pill">{t.inProgress}</span><span className="muted-label">{t.bengali} · 4 {t.chapters}</span></div><h2>Philosophy <em>101</em></h2><p className="feature-subtitle">{language === "bn" ? "একটি কোমল শুরু" : language === "de" ? "Ein sanfter Anfang" : "A gentle beginning"}</p><p className="feature-description">A slow walk through the ideas that shape a life: wonder, attention, and the courage to ask a better question.</p><div className="feature-meta"><span><Clock3 size={15} /> 1h 21m</span><span><Headphones size={15} /> 4.8k listeners</span></div><div className="feature-cta"><button className="primary-button" onClick={togglePlaying}>{playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}{playing ? "Pause" : t.continueListening}<span className="button-arrow"><ArrowRight size={16} /></span></button><button className="text-button" onClick={() => toast.success(t.save)}><Plus size={17} /> {t.save}</button></div></div>
          </section>

          <section className="continue-section"><div className="section-heading"><div><p className="eyebrow">{t.inProgress} <span className="bengali-seal">শোনা · ০১</span></p><h2>{t.continueListening}</h2></div><button className="link-button" onClick={showComingSoon}>{t.browse} <ArrowRight size={15} /></button></div><div className="continue-card"><img src={artwork.hero} alt="Philosophy 101 cover" /><div className="continue-info"><div className="continue-info-top"><div><strong>Philosophy 101</strong><span>{t.chapter} 01 · {language === "bn" ? "বিস্ময়ের শুরু" : "The beginning of wonder"}</span></div><span className="time-left">{remaining} {t.minutesLeft}</span></div><div className="progress-track"><span style={{ width: `${Math.max(3, progress * 100)}%` }} /><i className="river-line-dot" /></div><div className="continue-bottom"><span>{formatTime(currentTime)} / {formatTime(duration)}</span><button onClick={togglePlaying}>{playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />} {playing ? "Pause" : t.listen}</button></div></div><div className="continue-play"><button onClick={togglePlaying} aria-label={playing ? "Pause playback" : "Play playback"}>{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button></div></div></section>

          <section className="history-section"><div className="section-heading"><div><p className="eyebrow">{t.listeningHistory} <span className="bengali-seal">পথের চিহ্ন</span></p><h2>{t.recentlyPlayed}</h2></div><span className="history-note">{history.length} {history.length === 1 ? "title" : "titles"}</span></div>{history.length ? <div className="history-list">{history.map((entry) => <article className="history-card" key={`${entry.title}-${entry.updatedAt}`}><div className="history-art"><img src={entry.title === "Letters from a River" ? artwork.library : artwork.hero} alt="" /><span>{String(entry.chapter).padStart(2, "0")}</span></div><div className="history-copy"><strong>{entry.title}</strong><span>{t.chapter} {String(entry.chapter).padStart(2, "0")} · {formatRelative(entry.updatedAt)}</span><div className="history-progress"><i style={{ width: `${Math.max(4, entry.progress * 100)}%` }} /></div></div><button className="history-resume" onClick={() => resumeHistory(entry)} aria-label={`${t.resume} ${entry.title}`}><Play size={15} fill="currentColor" /></button></article>)}</div> : <div className="history-empty"><Clock3 size={18} /><span>{t.noHistory}</span></div>}</section>

          <section className="library-section" id="library"><div className="section-heading library-heading"><div><p className="eyebrow">{t.libraryTitle}</p><h2>{t.libraryTitle}</h2></div><div className="filter-tabs"><button className={!showFavorites ? "active" : ""} onClick={() => setShowFavorites(false)}>{t.allBooks}</button><button className={showFavorites ? "active" : ""} onClick={() => setShowFavorites(true)}>{t.favorites} <span className="favorites-count">{favorites.length}</span></button><button>{t.bengali}</button><button>{t.english}</button><button>{t.german}</button></div></div><div className="book-grid">{filteredBooks.length ? filteredBooks.map((book, index) => <article className={`book-card ${index === 1 ? "book-card-offset" : ""}`} key={book.title}><div className="book-image"><img src={book.image} alt="" /><span className="book-tag">{book.tag}</span><button className={`favorite-toggle ${favorites.includes(book.title) ? "is-favorite" : ""}`} onClick={() => toggleFavorite(book.title)} aria-label={`${favorites.includes(book.title) ? "Remove" : "Save"} ${book.title} ${t.favorites}`}>{favorites.includes(book.title) ? "♥" : "♡"}</button><button className="book-play" onClick={() => selectChapter(1)} aria-label={`${t.listen} ${book.title}`}><Play size={15} fill="currentColor" /></button></div><div className="book-details"><span className="book-kicker">{index === 0 ? "PHILOSOPHY" : index === 1 ? "MEMOIR" : "PRACTICE"}</span><h3>{book.title}</h3><p>{book.subtitle}</p><small>{book.author}</small></div></article>) : <div className="empty-library"><Search size={20} /><strong>{t.noResults}</strong><span>{query || showFavorites ? "Try another title or browse all books." : "Save a book to see it here."}</span></div>}</div></section>

          <section className="chapters-section"><div className="section-heading"><div><p className="eyebrow">{t.nowPlaying} <span className="bengali-seal">ভাবনার পথ</span></p><h2>{t.chapters}</h2></div><div className="player-language"><span>{t.audioLanguage}</span><button onClick={() => { const next = language === "bn" ? "en" : language === "en" ? "de" : "bn"; setLanguage(next); }}>{language === "bn" ? "বাংলা" : language === "de" ? "Deutsch" : "English"}<ChevronDown size={14} /></button></div></div><div className="chapter-list"><span className="chapter-rail" aria-hidden="true" />{chapters.map((item) => <button key={item.id} className={`chapter-row ${activeChapter === item.id ? "current" : ""}`} onClick={() => selectChapter(item.id)}><span className="chapter-number">{String(item.id).padStart(2, "0")}</span><span className="chapter-title"><strong>{language === "bn" ? item.bn : item.title}</strong><small>{t.chapter} {String(item.id).padStart(2, "0")}</small></span><span className="chapter-progress">{item.progress > 0 && <i style={{ width: `${item.progress * 100}%` }} />}</span><span className="chapter-duration">{item.duration}</span><span className="chapter-state">{activeChapter === item.id ? <Pause size={16} fill="currentColor" /> : <Play size={16} />}</span></button>)}</div></section>
        </div>
      </main>

      <div className={`player-dock ${playing ? "is-playing" : ""}`}><div className="dock-art"><img src={artwork.hero} alt="" /><span className="dock-bars"><i /><i /><i /><i /></span></div><div className="dock-title"><small>{t.nowPlaying}</small><strong>Philosophy 101</strong><span>{t.chapter} 01 · {language === "bn" ? "বাংলা" : language === "de" ? "Deutsch" : "English"}</span></div><div className="dock-controls"><button onClick={() => seek(-15)} aria-label="Back 15 seconds"><RotateCcw size={17} /></button><button className="dock-play" onClick={togglePlaying} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><button onClick={() => seek(30)} aria-label="Forward 30 seconds"><RotateCw size={17} /></button></div><div className="dock-progress"><div className="dock-times"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div><input aria-label="Playback progress" type="range" min="0" max={duration} value={currentTime} onChange={(event) => { const value = Number(event.target.value); setCurrentTime(value); setProgress(value / duration); if (audioRef.current) audioRef.current.currentTime = value; }} /></div><div className="dock-options"><button onClick={() => setSpeed((value) => value === 1 ? 1.25 : value === 1.25 ? 1.5 : 1)}>{speed}×</button><Volume2 size={17} /><button onClick={() => toast(t.comingSoon)} aria-label="More options"><ChevronDown size={16} /></button></div></div>
    </div>
  );
}
