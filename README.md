# Femmetality — Website

Eine elegante One-Page-Website für die Mentorin/Coachin **Femmetality**.
Markenwerte: **Feminität · Unapologetic · Zeitlos**.

Statisch gebaut (HTML + Tailwind via CDN + etwas JavaScript) — **kein Build-Schritt nötig.**

---

## Öffnen / Ansehen

Doppelklick auf **`index.html`** — die Seite öffnet sich im Browser.

> Tipp: Für die Bearbeitung empfiehlt sich ein lokaler Server (z. B. in VS Code die
> Erweiterung „Live Server"), damit Änderungen sofort sichtbar sind. Nötig ist das aber nicht.

---

## Dateien

```
index.html               → Inhalt & Struktur der ganzen Seite
assets/css/styles.css     → Design (Farben, Schriften, Komponenten, Animationen)
assets/js/main.js         → Interaktionen (Menü, Animationen, FAQ, Formular, Buchungslink)
assets/js/hero-shader.js  → animierter WebGL-Hintergrund im Hero (Three.js)
```

---

## Die 3 wichtigsten Anpassungen

### 1) Buchungslink eintragen
Öffne **`assets/js/main.js`**, ganz oben:
```js
const BOOKING_URL = "#kontakt"; // ← hier deinen echten Link eintragen
```
Beispiel:
```js
const BOOKING_URL = "https://calendly.com/dein-name/erstgespraech";
```
Alle „Erstgespräch buchen"-Buttons nutzen den Link automatisch (öffnet bei externen Links
einen neuen Tab).

### 2) Eigene Fotos einsetzen
Überall, wo aktuell ein Platzhalter mit „**Dein Foto hier**" steht, ist eine
`<div class="img-ph">`. So tauschst du sie gegen ein echtes Foto:

1. Lege deine Bilder unter `assets/img/` ab (Ordner ggf. anlegen), z. B. `hero.jpg`, `ueber.jpg`.
2. In `index.html` den Platzhalter ersetzen. Aus:
   ```html
   <div class="img-ph aspect-[4/5] w-full" data-label="Dein Foto hier"></div>
   ```
   wird:
   ```html
   <img src="assets/img/hero.jpg" alt="Femmetality" class="ph-fill" />
   ```
   *(Das umgebende `<div class="framed">` mit dem Goldrahmen kannst du behalten.)*

**Alternative ohne HTML zu ändern:** ein Hintergrundbild setzen:
```html
<div class="img-ph aspect-[4/5] w-full" style="background-image:url('assets/img/hero.jpg')"></div>
```
(Das Label verschwindet automatisch, sobald ein Bild gesetzt ist.)

Die kleinen runden Platzhalter bei den Testimonials funktionieren genauso.

### 3) Texte ändern
Alle Texte stehen direkt in **`index.html`** und sind deutsche Platzhalter, die zur Marke passen.
Such einfach nach der Stelle (z. B. Überschriften, Angebots-Pakete, FAQ, Testimonials) und
überschreibe sie mit deinen echten Inhalten.

- **E-Mail-Adresse:** aktuell `info@femmetality.com` — in `index.html` (Kontakt & Footer) und
  in `assets/js/main.js` (Formular) ändern, falls gewünscht.
- **Impressum & Datenschutz:** Im Footer sind Platzhalter-Links (`#`). Bitte mit echten,
  rechtlich erforderlichen Seiten/Inhalten verknüpfen.

---

## Animierter Hero-Hintergrund (WebGL-Shader)
Der Hero hat einen lebendigen „Celestial Ink"-Shader (tiefes Aubergine → Blush → Gold),
der sanft auf die Mausbewegung reagiert. Technik: **Three.js**, zur Laufzeit vom CDN geladen
(via `importmap` in `index.html`) — **keine Installation nötig.**

- **Farben anpassen:** in `assets/js/hero-shader.js` die Werte `c1`, `c2`, `blush`, `gold`
  im Fragment-Shader ändern (RGB-Werte von 0–1).
- **Komplett abschalten:** in `index.html` die Zeile
  `<script type="module" src="assets/js/hero-shader.js"></script>` entfernen.
  Der Hero zeigt dann automatisch einen passenden CSS-Verlauf als Fallback.
- **Robust:** Bei deaktiviertem JavaScript, fehlendem WebGL oder offline greift ebenfalls der
  CSS-Verlauf. Bei aktivierter Systemeinstellung „Bewegung reduzieren" wird statt der Animation
  ein ruhiges Standbild gezeigt.

## Farben & Schriften ändern (optional)
Die komplette Farbwelt liegt als CSS-Variablen oben in **`assets/css/styles.css`**
(`:root { --plum … --gold … }`). Wenn du dort eine Farbe änderst, zieht sie durch die ganze Seite.
Dieselben Farben sind in `index.html` im `tailwind.config`-Block hinterlegt (für die Utility-Klassen).

---

## Hinweise
- **Schriften** (Playfair Display, Montserrat, Cormorant Garamond), **Tailwind** und **Three.js**
  (Hero-Shader) werden online geladen. Mit Internet sieht alles perfekt aus; offline greifen
  elegante System-Schriften und der CSS-Verlauf-Fallback im Hero.
- Das Kontaktformular sendet **ohne Server** über das E-Mail-Programm des Besuchers (`mailto:`).
  Wenn du echten Formular-Versand willst, lässt sich später ein Dienst wie Formspree o. Ä. einbinden.
- Die Seite ist responsiv (Handy/Tablet/Desktop), barrierearm (Tastatur-bedienbar, sichtbarer Fokus)
  und respektiert „Bewegung reduzieren"-Einstellungen.
