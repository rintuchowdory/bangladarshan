# Online-/Offline-Review

Die lokale Vorschau registriert den Service Worker und enthält im Cache die App-Shell sowie den titelbezogenen SoundHelix-Stream. Die Offline-Speicheraktion wechselt sichtbar von „Saving…“ zu „Saved offline“. Im simulierten Offline-Zustand zeigt der Header „Offline“, die Audioquelle verwendet eine lokale `blob:`-URL aus dem Cache, und der Player-Start wechselt in der UI auf „Pause“. TypeScript, Production Build und Vitest waren erfolgreich.

Hinweis: Der verwendete SoundHelix-Demostream bleibt eine externe Beispielquelle. Für produktive Offline-Inhalte muss er durch einen rechtlich geklärten Audio-Stream mit CORS-Unterstützung ersetzt werden.
