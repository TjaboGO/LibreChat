---
name: nano-banana-image-studio
description: Generates and iteratively refines images using Nano Banana 2 and Google Imagen 3 with conversational in-painting and character continuity.
when-to-use: Use when generating photorealistic visuals, marketing assets, vector illustrations with crisp typography, or performing conversational in-painting modifications on existing images.
always-apply: false
user-invocable: true
---

# Nano Banana 2 & Imagen 3 Image Studio Protocol

## 1. Syfte och Översikt
Grok AI lider av svag anatomisk kontroll och brusiga artefakter; ChatGPT / DALL-E 3 lider av en plastig "AI-look", aggressiv censur och hemlig omskrivning av användarens prompter.

**Nano Banana 2** (driven av Google Gemini 3 Flash Image & Imagen 3) representerar guldstandarden för bildgenerering och konversationsbaserad redigering:
1. **Kristallklar Typografi:** Återger läsbar text, skyltar, logotyper och typografiska etiketter inuti bilderna utan hallucinerade krumelurer.
2. **Konversationsbaserad In-Painting:** Ändrar enskilda element ("byt ut koppen mot en ismatcha, behåll ljussättning och modellens ansikte") utan att generera om bilden från noll.
3. **Karaktärskonsistens & Stilbevarande:** Behåller samma person, produkt eller miljö över tiotals sekventiella variationer.

---

## 2. Operativa Regler för Prompt-Struktur

När användaren efterfrågar en bild eller bildredigering, applicera följande professionella direktiv:

### 2.1 Ny Bildgenerering (Text-to-Image)
Skapa prompter enligt formeln:
`[Subject & Action] + [Environment & Lighting] + [Composition & Camera Angle] + [Material & Textures] + [Typographic Directive if text is needed] + [Style/Engine tag]`

- **Typografiregel:** Om text ska synas i bilden, omslut den alltid med enkla citattecken och specificera typsnittsfamilj (t.ex. `bold clean geometric sans-serif lettering spelling 'ACME LABS'`).
- **Fotorealistisk belysning:** Specificera ljuskällor (t.ex. `diffused golden hour side lighting, 85mm f/1.4 lens bokeh, subtle volumetric dust particles`).
- **Negativa attribut (imploderande förbud):** Undvik generiska floskler som "ultra realistic 8k". Beskriv istället faktiska fysiska material (`brushed aluminum bezel`, `matte cotton twill`, `subsurface skin scattering`).

### 2.2 Konversationsbaserad In-Painting (Iterativ Redigering)
När användaren refererar till en befintlig bild (`[In-Painting / Nano Banana 2]: ...`):
1. **Identifiera ankare:** Notera vilka element som ska **bevaras orörda** (`Anchor elements: character facial features, pose, backdrop color`).
2. **Målstyrd förändring:** Isolera den specifika ändringen (`Target delta: replace wooden table with polished white marble slab`).
3. **Sömlös integration:** Instruera modellen att harmonisera ljus, skuggor och reflektioner mellan det nya elementet och den befintliga bilden.

---

## 3. Artefakt- och Output-Standard

För att visa bilden med interaktiva kontroller och öppna den i **Artifacts Image Studio**, formatera alltid svaret enligt:

```markdown
:::artifact{identifier="generated-image" type="application/vnd.librechat.image-studio" title="Beskrivande Titel"}
https://image-url-or-relative-path.png
:::
```

Eller bädda in bilden med standard Markdown-bildformat:
```markdown
![Beskrivande bildtext](https://image-url-or-relative-path.png)
```

När användaren hovrar över bilden eller klickar på den, finns knappen **"Edit in Studio"** som öppnar Nano Banana 2 Studio i Artifacts-panelen med realtidszoom, modellval (`Nano Banana 2` / `Google Imagen 3` / `FLUX.1 Schnell`), formatväljare (`1:1`, `16:9`, `9:16`, `4:3`) och in-painting prompt-modul.

---

## 4. Kvalitetssäkring
- [ ] Innehåller bilden text? Kontrollera att stavning och placering specificerats med precision.
- [ ] Vid redigering: Är bevarade ankare tydligt uttalade så att kontinuiteten inte bryts?
- [ ] Är formatet och bildförhållandet optimerat för användarens slutanvändning?
