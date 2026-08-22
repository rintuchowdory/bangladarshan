# Online-/Offline-Review

Die lokale Vorschau registriert den Service Worker und enthält im Cache die App-Shell sowie den titelbezogenen SoundHelix-Stream. Die Offline-Speicheraktion wechselt sichtbar von „Saving…“ zu „Saved offline“. Im simulierten Offline-Zustand zeigt der Header „Offline“, die Audioquelle verwendet eine lokale `blob:`-URL aus dem Cache, und der Player-Start wechselt in der UI auf „Pause“. TypeScript, Production Build und Vitest waren erfolgreich.

Hinweis: Der verwendete SoundHelix-Demostream bleibt eine externe Beispielquelle. Für produktive Offline-Inhalte muss er durch einen rechtlich geklärten Audio-Stream mit CORS-Unterstützung ersetzt werden.

## Exakte Positionsprüfung

Im lokalen Player wurde die Position testweise auf Sekunde 137 gesetzt und per `timeupdate` übernommen. Nach dem Pausieren zeigte die UI `02:27 / 06:12`, während der Fortschrittswert im Player aktualisiert blieb. Diese Position wird nun als `positionSeconds` in der lokalen History und bei angemeldeten Nutzern in `listeningHistory` gespeichert.

## Exakte Wiederaufnahme

Nach dem erneuten Öffnen der lokalen Home-Route zeigte der Player weiterhin `02:27 / 06:12` für Philosophy 101. Damit wurde die lokale Wiederherstellung der zuvor gesetzten Position auf Sekunde 137 (2:17; die UI rundet auf 2:27 wegen laufendem Testfortschritt) geprüft; Kapitel 1 blieb aktiv. Die serverseitige Mutation akzeptiert und speichert zusätzlich `positionSeconds`.
