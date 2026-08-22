# BanglaDarshan — Design Direction

## Three initial approaches

### Theme Name: Quiet Library
**Very Brief Intro:** A warm editorial reading-room aesthetic with parchment, ink, and saffron accents. It makes listening feel like a thoughtful ritual rather than a utility app.

**Probability:** 0.06

### Theme Name: Monsoon Signal
**Very Brief Intro:** A dark, atmospheric listening space with rain-soaked blue, copper highlights, and soft waveform light. It frames audio as an immersive evening practice.

**Probability:** 0.03

### Theme Name: River of Thought
**Very Brief Intro:** A tactile contemporary Bengali-inspired interface built from indigo, river-mist neutrals, and vermilion marks. It balances cultural specificity with a calm, international product language.

**Probability:** 0.08

## Selected approach: River of Thought

### Design Movement
Contemporary editorial modernism with references to Bengali print culture, river maps, and quiet museum wayfinding. The result should feel collected and considered, not decorative or nostalgic.

### Core Principles
1. **Audio as a path:** Every major section should suggest a journey from discovery to listening to reflection.
2. **Editorial clarity:** Strong typography, short copy, and generous negative space should make the interface feel like a well-designed journal.
3. **Cultural signal, not costume:** Bengali visual cues appear through ink-like marks, river-line motifs, and restrained vermilion rather than ornamental overload.
4. **Calm utility:** Controls are obvious, tactile, and supportive; motion should feel like a page or record turning, never like a gaming dashboard.

### Color Philosophy
The palette begins with deep indigo as the grounding color: reflective, scholarly, and recognizable across languages. Warm paper and river-mist neutrals create breathing room, while vermilion is reserved for moments of action and progress. The emotional arc moves from quiet discovery into focused listening.

### Layout Paradigm
Use an asymmetric editorial canvas: a narrow left rail for orientation, a broad listening stage for the featured book, and offset content bands that feel like pages sliding into view. Avoid a centered marketing grid; let the player and book cover establish the visual axis.

### Signature Elements
- A slim vermilion “river line” that connects cover art, progress, and chapter wayfinding.
- Large book-cover tiles with ink-wash texture and small language seals.
- A persistent “now listening” dock that reads like a library checkout slip.

### Interaction Philosophy
Actions should feel like handling a physical collection: selecting a book brings it forward, changing language swaps the audio edition without disturbing the UI, and progress updates are quiet but visible. Non-available features should explain themselves with a concise “coming next” toast rather than pretending to work.

### Animation
Use short, physical transitions: 180–240ms ease-out for buttons and menus; 300ms cover lift and shadow shift on selection; a gentle 1.8s waveform breathing loop only while audio is playing. Stagger chapter rows by 40ms on first entrance. Respect reduced-motion preferences and never animate layout dimensions when opacity/transform can communicate the same change.

### Typography System
Pair **Fraunces** for display headlines and chapter titles with **DM Sans** for interface copy. Bengali text should use **Noto Serif Bengali** for editorial moments and **Noto Sans Bengali** for controls. Display hierarchy: oversized 56–72px hero statement, 28–36px section titles, 18–22px book titles, 13–15px metadata. Use sentence case and generous line height.

### Brand Essence
A multilingual listening room for philosophy and ideas, beginning with Bengali voices and opening outward to the world.

Personality: **Reflective, welcoming, quietly bold.**

### Brand Voice
Headlines should sound like invitations to think, not product slogans. CTAs should be direct and warm. Microcopy should be concise, human, and observant.

Example lines:
- “Give an old idea a little room to breathe.”
- “Continue with chapter two — you’re 18 minutes in.”

### Wordmark & Logo
The mark is a compact river-knot symbol: two indigo strokes crossing around a vermilion dot, suggesting a Bengali letterform, a sound wave, and a point of attention. The wordmark uses a custom Fraunces lockup with a slightly lowered “a” baseline to echo the river-line motif. The logo icon should stand alone in the header and favicon.

### Signature Brand Color
**River Vermilion — #E4573D.** It is warm, ownable, and used sparingly for play, progress, and the moment a listener chooses to begin.

## Implementation guardrails

This is a frontend-only MVP. It will include a multilingual UI switcher (Bengali, English, German), a featured audiobook library, book details, chapter list, functional in-browser audio controls using an openly available sample source, playback speed, seek controls, resume/progress state in local storage, dark mode, responsive layouts, and accessible focus states. Bookmarks, search, favorites, offline support, ingestion, TTS, and AI tutoring will be represented as clearly labeled next-stage affordances rather than fabricated functionality.
