# BanglaDarshan finalization

## Ausgewählte Erweiterungen

- [x] Benutzerkonto und serverseitige Synchronisierung von Favoriten und Hörverlauf einrichten.
- [x] Suche um Thema, Dauer und Inhaltssprache erweitern.
- [x] Buchdetailseite mit Kapitel-Metadaten und Bookmarks ergänzen.
- [x] Gesamtfluss testen, Checkpoint speichern und GitHub synchronisieren.

## Neue Erweiterung

### Hörverlauf

- [x] Hörverlauf mit zuletzt gehörten und pausierten Hörbüchern ergänzen.
- [x] Fortschritt, Kapitel und relative Zeitangabe speichern.
- [x] Direktes Fortsetzen aus dem Hörverlauf ermöglichen.
- [x] Verlauf testen, Checkpoint speichern und GitHub synchronisieren.

- [x] Suchfeld mit Ergebnisfilterung und leerem Zustand ergänzen.
- [x] Favoritenstatus pro Hörbuch mit localStorage speichern.
- [x] Favoritenansicht und zugängliche Toggle-Interaktionen ergänzen.
- [x] Neue Funktion prüfen, Checkpoint speichern und GitHub synchronisieren.

- [x] Create a new private GitHub repository named `bangladarshan` under `rintuchowdory`.
- [x] Push the verified project source and documentation to the new repository.
- [x] Confirm the remote URL and final branch state.

## Qualitätssicherung nach Review

- [x] Hörverlauf an den tatsächlich ausgewählten und abgespielten Buchtitel binden und Sync-Erfolg/-fehler sichtbar behandeln.
- [x] Erweiterte Filter sichtbar integrieren, Sprachbuttons verdrahten und Filterinteraktionen testen.
- [x] Buchdetail-CTA mit echter Wiedergabe/Fortsetzen-Übergabe verbinden und Bookmark-Anlage/Löschung testen.
- [x] Widersprüchliche Coming-soon-Texte entfernen, finalen Checkpoint speichern und GitHub-Sync bestätigen.

## Nachweis-Fixes

- [x] Progress beim Wechsel zu einem neuen Buch zurücksetzen und anschließend den neuen Titel synchronisieren.
- [x] Filter-, CTA- und Bookmark-Flows mit verfügbaren Vorschauprüfungen validieren.
- [x] Finalen Checkpoint speichern und den GitHub-Sync nach den Review-Fixes bestätigen.

## Online und offline hören

- [x] Installierbare PWA-Metadaten und Service Worker ergänzen.
- [x] Audio-Caching für den gewählten Hörbuch-Stream implementieren.
- [x] Online-/Offline-Status und „Für offline speichern“-Aktion in die UI integrieren.
- [x] Offline-Wiedergabe, responsive Darstellung, Checkpoint und GitHub-Sync prüfen.

## Offline-Nachweis-Fixes

- [x] Buchspezifische Audioquellen verdrahten und Offline-Speicherung an den aktiven Titel binden.
- [x] Offline-Wiedergabe nach dem Caching im Browser verifizieren.
- [x] Nach den Offline-/PWA-Fixes neuen Checkpoint speichern und GitHub-Sync bestätigen.

## Letzte Offline-Validierung

- [x] Offline-Modus inklusive Playback aus dem Cache simulieren und bestätigen.
- [x] Erfolgsstatus der „Save offline“-Aktion sichtbar bestätigen.
- [x] Danach neuen Checkpoint speichern und GitHub-Sync ausführen.

## Exakte Wiedergabeposition

- [x] Datenmodell um Position in Sekunden pro Hörbuch und Kapitel erweitern.
- [x] Position beim Abspielen, Pausieren, Seek und Verlassen lokal speichern.
- [x] Position serverseitig synchronisieren und beim Fortsetzen wiederherstellen.
- [x] Exakte Wiederaufnahme testen, Checkpoint speichern und GitHub synchronisieren.

## Positionspersistenz-Nachweis

- [x] Seek-Änderungen und Seitenverlassen explizit lokal persistieren.
- [x] Exakte Wiederaufnahme nach erneutem Öffnen end-to-end prüfen.
- [x] Nach dem Positionsfix neuen Checkpoint speichern und GitHub-Sync bestätigen.

## Veröffentlichungsnachweis Exact Position

- [ ] Neuen Checkpoint nach der Exact-Position-Änderung speichern.
- [ ] Aktuellen Stand anschließend nach GitHub pushen und Remote-Status bestätigen.
