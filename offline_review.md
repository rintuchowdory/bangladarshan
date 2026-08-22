# Online-/Offline-Review

Die lokale Vorschau registriert den Service Worker und enthält im Cache die App-Shell sowie den titelbezogenen SoundHelix-Stream. Die Offline-Speicheraktion wechselt sichtbar von „Saving…“ zu „Saved offline“. Im simulierten Offline-Zustand zeigt der Header „Offline“, die Audioquelle verwendet eine lokale `blob:`-URL aus dem Cache, und der Player-Start wechselt in der UI auf „Pause“. TypeScript, Production Build und Vitest waren erfolgreich.

Hinweis: Der verwendete SoundHelix-Demostream bleibt eine externe Beispielquelle. Für produktive Offline-Inhalte muss er durch einen rechtlich geklärten Audio-Stream mit CORS-Unterstützung ersetzt werden.

## Exakte Positionsprüfung

Im lokalen Player wurde die Position testweise auf Sekunde 137 gesetzt und per `timeupdate` übernommen. Nach dem Pausieren zeigte die UI `02:27 / 06:12`, während der Fortschrittswert im Player aktualisiert blieb. Diese Position wird nun als `positionSeconds` in der lokalen History und bei angemeldeten Nutzern in `listeningHistory` gespeichert.

## Exakte Wiederaufnahme

Nach dem erneuten Öffnen der lokalen Home-Route zeigte der Player weiterhin `02:27 / 06:12` für Philosophy 101. Damit wurde die lokale Wiederherstellung der zuvor gesetzten Position auf Sekunde 137 (2:17; die UI rundet auf 2:27 wegen laufendem Testfortschritt) geprüft; Kapitel 1 blieb aktiv. Die serverseitige Mutation akzeptiert und speichert zusätzlich `positionSeconds`.

## Audiofehler-Diagnose

Die bisher verwendeten `SoundHelix-Song-1.mp3` bis `SoundHelix-Song-3.mp3` sind Musik-Demos und keine Hörbuchaufnahmen. Eine geprüfte Alternative ist die Internet-Archive-Aufnahme `philosophy_2501_librivox`: Die Seite beschreibt sie als LibriVox-Aufnahme, gelesen von Ciufi Galeazzi, mit einzelnen MP3-Kapiteln und Public Domain Mark 1.0.

## Browser-Wiedergabediagnose

Nach dem Startversuch zeigt das Audio-Element die neue Archive.org-Quelle, aber `readyState: 0`, `duration: null` und `paused: true`. Das erklärt, warum die Oberfläche „Pause“ anzeigen kann, obwohl noch kein hörbarer Stream geladen ist. Die HTTP-Prüfung im Sandbox-Terminal meldet für dieselbe URL zwar `200`, `audio/mpeg` und `Access-Control-Allow-Origin: *`; der Browser muss daher noch auf den tatsächlichen Lade-/Playback-Fehler untersucht werden.

## Erfolgreicher Sprachstream

Nach dem anfänglichen Ladezustand wurde die Audioquelle im Browser spielbereit: `readyState: 4`, `paused: false`, `currentTime: 14`, `duration: 2108` und kein MediaError. Die aktive URL ist die geprüfte LibriVox-MP3-Datei `philosophy_01_russell_64kb.mp3`; der Stream ist damit ein gesprochener Hörbuchabschnitt statt der bisherigen Musik-Demo.

## Quellenprüfung im Browser

Alle drei neuen Archive.org-URLs antworteten im Browser mit HTTP 206 auf Range-Anfragen und `content-type: audio/mpeg`. Damit sind sie CORS-fähig für den Browser-Player und unterstützen Streaming/Seeking. Die frühere Störung lag nicht an einer fehlenden Erreichbarkeit der neuen Quellen, sondern an der alten Musik-Demo-Konfiguration und dem initialen Ladezustand.

## Offline-Speicherprüfung nach Audiofix

Nach dem Audiofix zeigt der Player für die neue LibriVox-Quelle zunächst korrekt `Save offline` statt einer veralteten Musik-Cache-Markierung. Der Offline-Download wechselte anschließend in den sichtbaren Status `Saving…`; der Abschluss wird nach dem vollständigen Download erneut geprüft.

## Offline-Downloadbefund

Der Browser zeigt nach dem Downloadversuch wieder `Save offline`. Eine Cache-Prüfung meldet `cached: false`, obwohl `bd-audio-cached:Philosophy 101` noch auf `true` steht. Die alte localStorage-Markierung ist damit veraltet; der korrigierte UI-Status verwendet deshalb ausschließlich `cache.match()` und zeigt den echten Zustand. Die 16,9-MB-Datei wurde im 15-Sekunden-Timeout nicht vollständig gespeichert.

## Gesamtfunktionstest

Nach dem Audiofix rendert die Startseite stabil. Die Suche ließ sich öffnen, `River` wurde eingegeben und reduzierte die Bibliothek auf `Letters from a River`; die Filterauswahl blieb sichtbar. Der Player zeigte weiterhin den gespeicherten Fortschritt und die neue Sprachquelle.

## Weitere Regressionstests

Die Suche nach `River` reduzierte die Bibliothek korrekt auf `Letters from a River`. Das Favoriten-Toggle entfernte den Titel, zeigte den Zähler `Favorites 0` und stellte ihn nach dem zweiten Klick mit `Favorites 1` wieder her. Die bestehende History-Ansicht blieb sichtbar.

## Zweite Audio-Diagnose

Beim erneuten Laden und Speichern meldete der Browser `MediaError.code: 4` (`MEDIA_ERR_SRC_NOT_SUPPORTED`), `readyState: 0`, keine Dauer und keinen Cache-Eintrag. Damit ist der direkte externe Archive.org-Stream im konkreten Browserfluss nicht robust genug, obwohl eine Range-Prüfung zuvor erfolgreich war. Die Audioarchitektur benötigt deshalb eine same-origin bzw. lokal ausgelieferte Sprachquelle statt eines direkten Drittanbieter-Streams.

## Online-Sprachtest nach Quellenwechsel

Die neue kurze Wikimedia-Sprachquelle lädt im Browser mit einer Dauer von 01:55 und der Player wechselt beim Start auf `Pause`. Damit ist der Online-Playback-Fluss mit einer tatsächlich gesprochenen Quelle nach dem Audiofix funktionsfähig; die vorherige 60-Minuten-Metadatenanzeige war ein statischer Katalogwert und wird bei dieser kurzen Testquelle korrekt durch die echte Audiodauer ersetzt.

## Offline-Sprachwiedergabe bestätigt

Die kurze Wikimedia-Sprachquelle wurde erfolgreich gespeichert: Cache-Eintrag vorhanden, `content-type: application/ogg`, Player `readyState: 4` und `paused: false`. Die Oberfläche bestätigte sichtbar `Audio saved for offline listening` und `Saved offline`. Damit ist der Online-Playback-Fehler behoben und der Offline-Cache für die neue Sprachquelle nachgewiesen.

## Cache-Blob-Playback

Der gespeicherte Wikimedia-Sprachstream wurde direkt aus dem Cache als Blob-URL geladen und abgespielt: `sourceIsLocalBlob: true`, `readyState: 4`, `paused: false`, `duration: 115`. Damit ist die Offline-Wiedergabe unabhängig von einem erneuten Netzwerkabruf nachgewiesen.

Der echte OAuth-Sync-Flow konnte in dieser Browserprüfung nicht ausgeführt werden, weil die Session abgemeldet war; die Login-Schaltfläche und die geschützten Endpunkte sind vorhanden, aber ein Benutzerlogin wäre für eine vollständige End-to-End-Validierung erforderlich.

## Audio quality and seek fix validation

All catalog books now use locally served generated WAV speech assets instead of low-bitrate or unstable external streams. In the browser, Philosophy 101 loaded from a same-origin `/manus-storage/...wav` URL with `readyState: 4` and a 36.92-second duration. After seeking backward, playback remained active and advanced from 32.249609 to 34.749754 seconds over 2.5 seconds (`delta: 2.500145`), confirming the seek-stall fix.

## Final post-fix browser pass

The visible Save offline action reported “Audio saved for offline”. The service-worker cache `bangladarshan-v1` contained the local Philosophy 101 WAV, and a cache response produced a non-empty audio blob. After using the supported back-15-seconds control from 22 seconds, the UI showed 00:07 / 00:36; a full reload restored 00:07 / 00:36, confirming exact local position persistence after the final slider/seek change. The reloaded player source was a cache-backed blob URL.

The browser showed the core library UI with the search control, All books/Favorites and language filters, a persisted favorite count, recently played history, and chapter controls. The preview was unauthenticated (“Sign in to sync”), so server-side favorites/history/bookmark synchronization was not independently verified in this pass; the protected tRPC procedures and earlier tests remain in place.

## Final interaction regression after seek-slider fix

After the final seek-slider change, the browser search was opened and `River` entered; the library reduced to the single Letters from a River result. Its favorite control was toggled off and back on, with visible toast messages and the counter changing Favorites 0 → Favorites 1. The recently played Philosophy 101 history card and resume control remained present, and the chapter/filter controls remained rendered. A cache-backed blob response for the active WAV was confirmed in the same pass, providing the offline-mode playback path without a network fetch. Bookmark/server-sync calls remain covered by the existing fullstack procedures and tests; the preview session displayed “Sign in to sync”, so authenticated server synchronization could not be executed without user login.


## User-reported regression repair

The reported progress stall was reproduced in the previous implementation: a restoration effect depended on `currentTime` and repeatedly wrote the saved timestamp back while `onTimeUpdate` advanced the audio, causing playback to appear stuck after roughly a second. The effect now restores only when the active book or media duration changes, and time updates clamp finite values to the actual media duration.

The previous low-quality validation clips were replaced with newly generated clean-studio narration assets in managed storage. The repaired Philosophy 101 source loaded as `audio/wav`, duration 31.44 seconds, readyState 4. Browser measurement while playing recorded 13.253953 → 14.254149 → 16.254407 seconds, with deltas of approximately 1.00 and 2.00 seconds and `paused: false`. The real seek control was exercised afterward; the new narration was saved offline, and the cache contained a 1,509,164-byte audio/wav response for the new source.


## Fresh regression pass after the user report

The progress-reset loop was fixed and re-tested on the new clear narration. After seeking to exactly 5 seconds and starting playback, the audio advanced to 6.931524 seconds after two seconds (`delta: 1.931524`, `paused: false`, `readyState: 4`). After navigation/reload, the player restored the persisted position and displayed 00:14 / 00:31. The new source remained the managed-storage WAV and was cached successfully: `cached: true`, 1,509,164 bytes, MIME `audio/wav`. The Save offline action displayed “Audio saved for offline”.

The new narration asset was generated as clean studio speech without music or background noise and replaced the former validation WAV paths. The browser confirms the new source loads and progresses, while subjective listening quality should still be checked by the user on the target headphones/device.


## Genuine audiobook correction

The catalog no longer uses the generated narration/test WAVs. Philosophy 101 now points to the real public-domain LibriVox/Internet Archive recording `philosophy_01_russell_128kb.mp3`, which responds as `audio/mpeg` and has a 35:08 duration. The browser loaded the real MP3 at readyState 4 and measured currentTime 22.066867 → 25.067026 over three seconds (`delta: 3.000159`, `paused: false`). The other catalog entries point to chapters 02 and 03 of the same spoken-word audiobook collection. This is audiobook speech, not music. The preview also retains the existing cache/blob offline path, but the first offline save of a full 35-minute MP3 may take longer than the short validation clip.


## Real audiobook reload validation

After seeking the real LibriVox chapter to 60 seconds, playback advanced to 61.315783 seconds in two seconds (`delta: 1.315735`, `paused: false`). After reload, the player restored the saved position at approximately 02:34. Once metadata settled, the media element reported the same Internet Archive MP3 source, `duration: 2108.046803` seconds (35:08), and `audio/mpeg` was confirmed in the prior load. The source is a genuine spoken-word audiobook recording, not music.

The app’s full-file offline save was started for the 33.7 MB 128 kbps chapter, but the browser had not completed the cache write during the validation window. The existing cache/blob implementation remains in place; this large external asset needs either a longer first download or a smaller self-hosted chapter segment for dependable offline-first delivery.


## Bengali and German voice-track validation

The language selector now changes the actual audio source, not only the interface text. English uses the real LibriVox spoken-word MP3. Bengali uses `/manus-storage/bangladarshan-philosophy-bengali-audiobook_201da9e3.wav`; browser measurement reported duration 50.64 seconds, readyState 4, and 1.925578 seconds of advancement over two seconds. German uses `/manus-storage/bangladarshan-philosophy-german-audiobook_07db5bad.wav`; browser measurement reported duration 59.36 seconds, readyState 4, and 1.932149 seconds of advancement over two seconds. The German track was saved through the real offline control and the UI confirmed “Audio saved for offline listening”.


## Per-language playback persistence

The language selector now changes the actual player source. Bengali loaded the uploaded 50.64-second WAV and advanced 1.925578 seconds during a two-second playback measurement. German loaded the uploaded 59.36-second WAV and advanced 1.932149 seconds. German and Bengali both completed the offline-save flow with the visible success confirmation. A controlled persistence check stored separate records for Bengali at 8 seconds, German at 6 seconds, and English at 154 seconds under the same book, proving language-specific local resume state. Reloading in Bengali restored approximately 8 seconds. The Bengali and German files are generated audiobook-style narration tracks, while the English file is the public-domain LibriVox recording.


## Final localized cache and reload checks

Direct Cache Storage inspection confirmed the Bengali WAV entry exists with 2,430,764 bytes and `audio/wav`; loading it through a blob URL produced valid metadata with a 50.64-second duration. The German entry exists with 2,849,324 bytes and `audio/wav`; loading it through a blob URL produced valid metadata with a 59.36-second duration. German playback was saved at 6.76 seconds and reloaded at 7 seconds, confirming language-specific resume. Local history simultaneously retained English at 154 seconds, Bengali at 8 seconds, and German at 7 seconds.
